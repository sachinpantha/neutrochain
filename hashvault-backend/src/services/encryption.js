const crypto = require('crypto');

function encryptWithWallet(file, receiverAddress, message = '') {
    const payload = {
        filename: file.originalname,
        mimetype: file.mimetype,
        file: file.buffer.toString('base64'),
        message,
        timestamp: Date.now()
    };

    const plaintext = JSON.stringify(payload);
    
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(receiverAddress.toLowerCase(), salt, 100000, 32, 'sha512');
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Use AES-256-GCM instead of ChaCha20 for compatibility
    const aes2Key = crypto.randomBytes(32);
    const aes2Iv = crypto.randomBytes(16);
    const aes2Cipher = crypto.createCipheriv('aes-256-gcm', aes2Key, aes2Iv);
    
    let doubleEncrypted = aes2Cipher.update(encrypted, 'hex', 'hex');
    doubleEncrypted += aes2Cipher.final('hex');
    const aes2Tag = aes2Cipher.getAuthTag();
    
    const keyEncryptionKey = crypto.pbkdf2Sync(receiverAddress.toLowerCase() + 'keyenc', salt, 50000, 32, 'sha512');
    const keyIv = crypto.randomBytes(16);
    const keyCipher = crypto.createCipheriv('aes-256-gcm', keyEncryptionKey, keyIv);
    
    let encryptedAes2Key = keyCipher.update(aes2Key, null, 'hex');
    encryptedAes2Key += keyCipher.final('hex');
    const keyAuthTag = keyCipher.getAuthTag();
    
    return Buffer.from(JSON.stringify({
        encrypted: doubleEncrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        authTag: authTag.toString('hex'),
        aes2Iv: aes2Iv.toString('hex'),
        aes2Tag: aes2Tag.toString('hex'),
        encryptedKey: encryptedAes2Key,
        keyIv: keyIv.toString('hex'),
        keyAuthTag: keyAuthTag.toString('hex'),
        algorithm: 'aes-256-gcm+aes-256-gcm',
        kdf: 'pbkdf2-sha512-100k'
    }));
}

function encryptForMultipleRecipients(file, receiverAddresses, message = '') {
    const payload = {
        filename: file.originalname,
        mimetype: file.mimetype,
        file: file.buffer.toString('base64'),
        message,
        timestamp: Date.now()
    };

    const plaintext = JSON.stringify(payload);
    const masterKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    const recipientKeys = {};
    
    receiverAddresses.forEach(address => {
        const salt = crypto.randomBytes(32);
        const keyEncryptionKey = crypto.pbkdf2Sync(address.toLowerCase() + 'multienc', salt, 100000, 32, 'sha512');
        const keyIv = crypto.randomBytes(16);
        const keyCipher = crypto.createCipheriv('aes-256-gcm', keyEncryptionKey, keyIv);
        
        let encryptedMasterKey = keyCipher.update(masterKey, null, 'hex');
        encryptedMasterKey += keyCipher.final('hex');
        const keyAuthTag = keyCipher.getAuthTag();
        
        recipientKeys[address.toLowerCase()] = {
            encryptedKey: encryptedMasterKey,
            salt: salt.toString('hex'),
            keyIv: keyIv.toString('hex'),
            keyAuthTag: keyAuthTag.toString('hex')
        };
    });
    
    return Buffer.from(JSON.stringify({
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        recipientKeys,
        recipients: receiverAddresses.map(addr => addr.toLowerCase()),
        algorithm: 'aes-256-gcm-multi',
        kdf: 'pbkdf2-sha512-100k'
    }));
}

function decryptWithWallet(encryptedData, receiverAddress) {
    try {
        const data = JSON.parse(encryptedData);
        
        const salt = Buffer.from(data.salt, 'hex');
        const keyEncryptionKey = crypto.pbkdf2Sync(receiverAddress.toLowerCase() + 'keyenc', salt, 50000, 32, 'sha512');
        
        const keyIv = Buffer.from(data.keyIv, 'hex');
        const keyAuthTag = Buffer.from(data.keyAuthTag, 'hex');
        const keyDecipher = crypto.createDecipheriv('aes-256-gcm', keyEncryptionKey, keyIv);
        keyDecipher.setAuthTag(keyAuthTag);
        
        let aes2Key = keyDecipher.update(data.encryptedKey, 'hex');
        aes2Key = Buffer.concat([aes2Key, keyDecipher.final()]);
        
        const aes2Iv = Buffer.from(data.aes2Iv, 'hex');
        const aes2Tag = Buffer.from(data.aes2Tag, 'hex');
        const aes2Decipher = crypto.createDecipheriv('aes-256-gcm', aes2Key, aes2Iv);
        aes2Decipher.setAuthTag(aes2Tag);
        
        let aesEncrypted = aes2Decipher.update(data.encrypted, 'hex', 'hex');
        aesEncrypted += aes2Decipher.final('hex');
        
        const key = crypto.pbkdf2Sync(receiverAddress.toLowerCase(), salt, 100000, 32, 'sha512');
        const iv = Buffer.from(data.iv, 'hex');
        const authTag = Buffer.from(data.authTag, 'hex');
        
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(aesEncrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return null;
    }
}

function decryptMultiRecipient(encryptedData, receiverAddress) {
    try {
        const data = JSON.parse(encryptedData);
        const normalizedAddress = receiverAddress.toLowerCase();
        
        if (!data.recipientKeys || !data.recipientKeys[normalizedAddress]) {
            return null;
        }
        
        const recipientKey = data.recipientKeys[normalizedAddress];
        const salt = Buffer.from(recipientKey.salt, 'hex');
        const keyEncryptionKey = crypto.pbkdf2Sync(normalizedAddress + 'multienc', salt, 100000, 32, 'sha512');
        
        const keyIv = Buffer.from(recipientKey.keyIv, 'hex');
        const keyAuthTag = Buffer.from(recipientKey.keyAuthTag, 'hex');
        const keyDecipher = crypto.createDecipheriv('aes-256-gcm', keyEncryptionKey, keyIv);
        keyDecipher.setAuthTag(keyAuthTag);
        
        let masterKey = keyDecipher.update(recipientKey.encryptedKey, 'hex');
        masterKey = Buffer.concat([masterKey, keyDecipher.final()]);
        
        const iv = Buffer.from(data.iv, 'hex');
        const authTag = Buffer.from(data.authTag, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Multi-recipient decryption failed:', error.message);
        return null;
    }
}

module.exports = { encryptWithWallet, decryptWithWallet, encryptForMultipleRecipients, decryptMultiRecipient };