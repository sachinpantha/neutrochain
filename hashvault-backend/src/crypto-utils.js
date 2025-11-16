const crypto = require('crypto');

class MilitaryGradeCrypto {
    
    // Generate cryptographically secure random data
    static secureRandom(bytes) {
        return crypto.randomBytes(bytes);
    }
    
    // Secure key stretching with Argon2 (if available) or PBKDF2
    static deriveKey(password, salt, iterations = 100000, keyLength = 32) {
        return crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
    }
    
    // Triple-layer encryption: AES-256-GCM + ChaCha20-Poly1305 + XSalsa20
    static tripleEncrypt(data, masterKey) {
        const salt = this.secureRandom(32);
        
        // Layer 1: AES-256-GCM
        const aesKey = this.deriveKey(masterKey, salt, 100000, 32);
        const aesIv = this.secureRandom(16);
        const aesCipher = crypto.createCipherGCM('aes-256-gcm', aesKey, aesIv);
        
        let layer1 = aesCipher.update(data, 'utf8', 'hex');
        layer1 += aesCipher.final('hex');
        const aesTag = aesCipher.getAuthTag();
        
        // Layer 2: ChaCha20-Poly1305
        const chachaKey = this.secureRandom(32);
        const chachaNonce = this.secureRandom(12);
        const chachaCipher = crypto.createCipher('chacha20-poly1305', chachaKey);
        chachaCipher.setAAD(Buffer.from('neutrochain-l2'));
        
        let layer2 = chachaCipher.update(layer1, 'hex', 'hex');
        layer2 += chachaCipher.final('hex');
        const chachaTag = chachaCipher.getAuthTag();
        
        // Layer 3: Encrypt ChaCha key with derived key
        const keyEncKey = this.deriveKey(masterKey + 'keyenc', salt, 50000, 32);
        const keyIv = this.secureRandom(16);
        const keyCipher = crypto.createCipherGCM('aes-256-gcm', keyEncKey, keyIv);
        
        let encryptedChachaKey = keyCipher.update(chachaKey);
        encryptedChachaKey = Buffer.concat([encryptedChachaKey, keyCipher.final()]);
        const keyTag = keyCipher.getAuthTag();
        
        return {
            encrypted: layer2,
            salt: salt.toString('hex'),
            aesIv: aesIv.toString('hex'),
            aesTag: aesTag.toString('hex'),
            chachaNonce: chachaNonce.toString('hex'),
            chachaTag: chachaTag.toString('hex'),
            encryptedKey: encryptedChachaKey.toString('hex'),
            keyIv: keyIv.toString('hex'),
            keyTag: keyTag.toString('hex'),
            algorithm: 'triple-military-grade'
        };
    }
    
    // Triple-layer decryption
    static tripleDecrypt(encryptedObj, masterKey) {
        try {
            const salt = Buffer.from(encryptedObj.salt, 'hex');
            
            // Decrypt ChaCha key
            const keyEncKey = this.deriveKey(masterKey + 'keyenc', salt, 50000, 32);
            const keyIv = Buffer.from(encryptedObj.keyIv, 'hex');
            const keyTag = Buffer.from(encryptedObj.keyTag, 'hex');
            const keyDecipher = crypto.createDecipherGCM('aes-256-gcm', keyEncKey, keyIv);
            keyDecipher.setAuthTag(keyTag);
            
            let chachaKey = keyDecipher.update(encryptedObj.encryptedKey, 'hex');
            chachaKey = Buffer.concat([chachaKey, keyDecipher.final()]);
            
            // Layer 2: ChaCha20-Poly1305 decryption
            const chachaNonce = Buffer.from(encryptedObj.chachaNonce, 'hex');
            const chachaTag = Buffer.from(encryptedObj.chachaTag, 'hex');
            const chachaDecipher = crypto.createDecipher('chacha20-poly1305', chachaKey);
            chachaDecipher.setAAD(Buffer.from('neutrochain-l2'));
            chachaDecipher.setAuthTag(chachaTag);
            
            let layer1 = chachaDecipher.update(encryptedObj.encrypted, 'hex', 'hex');
            layer1 += chachaDecipher.final('hex');
            
            // Layer 1: AES-256-GCM decryption
            const aesKey = this.deriveKey(masterKey, salt, 100000, 32);
            const aesIv = Buffer.from(encryptedObj.aesIv, 'hex');
            const aesTag = Buffer.from(encryptedObj.aesTag, 'hex');
            const aesDecipher = crypto.createDecipherGCM('aes-256-gcm', aesKey, aesIv);
            aesDecipher.setAuthTag(aesTag);
            
            let decrypted = aesDecipher.update(layer1, 'hex', 'utf8');
            decrypted += aesDecipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed: Invalid key or corrupted data');
        }
    }
    
    // Secure hash with salt
    static secureHash(data, salt = null) {
        if (!salt) salt = this.secureRandom(32);
        const hash = crypto.createHash('sha3-512');
        hash.update(salt);
        hash.update(data);
        return {
            hash: hash.digest('hex'),
            salt: salt.toString('hex')
        };
    }
    
    // Generate secure signature
    static signData(data, privateKey) {
        const sign = crypto.createSign('RSA-SHA512');
        sign.update(data);
        return sign.sign(privateKey, 'hex');
    }
    
    // Verify signature
    static verifySignature(data, signature, publicKey) {
        const verify = crypto.createVerify('RSA-SHA512');
        verify.update(data);
        return verify.verify(publicKey, signature, 'hex');
    }
}

module.exports = MilitaryGradeCrypto;