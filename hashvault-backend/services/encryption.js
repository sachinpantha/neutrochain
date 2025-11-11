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
    
    const chachaKey = crypto.randomBytes(32);
    const chachaNonce = crypto.randomBytes(12);
    const chachaCipher = crypto.createCipher('chacha20-poly1305', chachaKey);
    chachaCipher.setAAD(Buffer.from('neutrochain-military'));
    
    let doubleEncrypted = chachaCipher.update(encrypted, 'hex', 'hex');
    doubleEncrypted += chachaCipher.final('hex');
    const chachaTag = chachaCipher.getAuthTag();
    
    const keyEncryptionKey = crypto.pbkdf2Sync(receiverAddress.toLowerCase() + 'keyenc', salt, 50000, 32, 'sha512');
    const keyIv = crypto.randomBytes(16);
    const keyCipher = crypto.createCipheriv('aes-256-gcm', keyEncryptionKey, keyIv);
    
    let encryptedChachaKey = keyCipher.update(chachaKey, null, 'hex');
    encryptedChachaKey += keyCipher.final('hex');
    const keyAuthTag = keyCipher.getAuthTag();
    
    return Buffer.from(JSON.stringify({
        encrypted: doubleEncrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        authTag: authTag.toString('hex'),
        chachaNonce: chachaNonce.toString('hex'),
        chachaTag: chachaTag.toString('hex'),
        encryptedKey: encryptedChachaKey,
        keyIv: keyIv.toString('hex'),
        keyAuthTag: keyAuthTag.toString('hex'),
        algorithm: 'aes-256-gcm+chacha20-poly1305',
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
        
        let chachaKey = keyDecipher.update(data.encryptedKey, 'hex');
        chachaKey = Buffer.concat([chachaKey, keyDecipher.final()]);
        
        const chachaNonce = Buffer.from(data.chachaNonce, 'hex');
        const chachaTag = Buffer.from(data.chachaTag, 'hex');
        const chachaDecipher = crypto.createDecipher('chacha20-poly1305', chachaKey);
        chachaDecipher.setAAD(Buffer.from('neutrochain-military'));
        chachaDecipher.setAuthTag(chachaTag);
        
        let aesEncrypted = chachaDecipher.update(data.encrypted, 'hex', 'hex');
        aesEncrypted += chachaDecipher.final('hex');
        
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

module.exports = { encryptWithWallet, decryptWithWallet };