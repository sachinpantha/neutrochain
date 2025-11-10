const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { ethers } = require('ethers');
const { createCanvas, loadImage } = require('canvas');
const { uploadEncryptedToPinata } = require('./pinata');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }
});

// In-memory storage for inbox (in production, use a database)
const inboxStorage = new Map();

// Send file to receiver's inbox
router.post('/send-to-inbox', upload.single('file'), async (req, res) => {
    const { receiverAddress, message, senderAddress, signature } = req.body;
    
    if (!req.file || !receiverAddress || !senderAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Verify sender's signature
        const recoveredAddress = ethers.verifyMessage('NeutroChain Upload', signature);
        
        if (recoveredAddress.toLowerCase() !== senderAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Store file in receiver's inbox
        const fileId = crypto.randomUUID();
        const fileData = {
            id: fileId,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            fileData: req.file.buffer.toString('base64'),
            message: message || '',
            senderAddress,
            timestamp: Date.now()
        };

        if (!inboxStorage.has(receiverAddress.toLowerCase())) {
            inboxStorage.set(receiverAddress.toLowerCase(), []);
        }
        inboxStorage.get(receiverAddress.toLowerCase()).push(fileData);

        res.json({ success: true, message: 'File sent to inbox successfully' });

    } catch (error) {
        console.error('Send to inbox error:', error);
        res.status(500).json({ error: 'Failed to send file' });
    }
});

// Get inbox files
router.get('/inbox/:address', (req, res) => {
    const address = req.params.address.toLowerCase();
    const files = inboxStorage.get(address) || [];
    res.json({ files });
});

// Generate NFT from inbox file
router.post('/generate-nft/:fileId', async (req, res) => {
    const { fileId } = req.params;
    
    try {
        // Find file in all inboxes
        let fileData = null;
        let receiverAddress = null;
        
        for (const [address, files] of inboxStorage.entries()) {
            const file = files.find(f => f.id === fileId);
            if (file) {
                fileData = file;
                receiverAddress = address;
                break;
            }
        }
        
        if (!fileData) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Create payload for NFT
        const payload = {
            filename: fileData.filename,
            mimetype: fileData.mimetype,
            file: fileData.fileData,
            message: fileData.message || '',
            timestamp: Date.now(),
            sender: fileData.senderAddress
        };
        
        // Simple encryption using basic crypto
        const encryptedData = encryptWithWallet({
            buffer: Buffer.from(fileData.fileData, 'base64'),
            originalname: fileData.filename,
            mimetype: fileData.mimetype
        }, receiverAddress, fileData.message || '');
        
        // Upload to IPFS
        const ipfsHash = await uploadEncryptedToPinata({
            buffer: encryptedData,
            originalname: fileData.filename + '.enc'
        });

        // Generate NFT image
        const nftImageBuffer = generateNFTImage(ipfsHash, fileData.senderAddress, receiverAddress);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-nft.png"');
        res.send(nftImageBuffer);

    } catch (error) {
        console.error('NFT generation error:', error.message);
        res.status(500).json({ error: `NFT generation failed: ${error.message}` });
    }
});

// Delete file from inbox
router.delete('/inbox/:fileId', (req, res) => {
    const { fileId } = req.params;
    
    for (const [address, files] of inboxStorage.entries()) {
        const index = files.findIndex(f => f.id === fileId);
        if (index !== -1) {
            files.splice(index, 1);
            return res.json({ success: true });
        }
    }
    
    res.status(404).json({ error: 'File not found' });
});

// Encrypt file using receiver's wallet address (legacy endpoint)
router.post('/encrypt-upload', upload.single('file'), async (req, res) => {
    const { receiverAddress, message, senderAddress, signature } = req.body;
    
    if (!req.file || !receiverAddress || !senderAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Verify sender's signature
        const recoveredAddress = ethers.verifyMessage('NeutroChain Upload', signature);
        
        if (recoveredAddress.toLowerCase() !== senderAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Encrypt file using receiver's address as key
        const encryptedData = encryptWithWallet(req.file, receiverAddress, message);
        
        // Upload to IPFS
        const ipfsHash = await uploadEncryptedToPinata({
            buffer: encryptedData,
            originalname: req.file.originalname + '.enc'
        });

        // Generate NFT image
        const nftImageBuffer = generateNFTImage(ipfsHash, senderAddress, receiverAddress);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-nft.png"');
        res.send(nftImageBuffer);

    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({ error: 'Encryption failed' });
    }
});

// Decrypt file using receiver's wallet address
router.post('/decrypt-download', upload.single('nftImage'), async (req, res) => {
    const { receiverAddress, signature } = req.body;
    const nftImage = req.file;
    
    if (!nftImage || !receiverAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Verify receiver's signature
        const recoveredAddress = ethers.verifyMessage('NeutroChain Decrypt', signature);
        
        if (recoveredAddress.toLowerCase() !== receiverAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Extract IPFS hash from NFT image
        const ipfsHash = await extractHashFromNFT(nftImage.buffer);
        
        // Download from IPFS
        const axios = require('axios');
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
            responseType: 'text',
            timeout: 30000
        });

        // Decrypt using receiver's address
        const decryptedData = decryptWithWallet(response.data, receiverAddress);
        
        if (!decryptedData) {
            return res.status(401).json({ error: 'Decryption failed - invalid key' });
        }

        res.json({
            success: true,
            filename: decryptedData.filename,
            mimetype: decryptedData.mimetype,
            file: decryptedData.file,
            message: decryptedData.message
        });

    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ error: 'Decryption failed' });
    }
});

function encryptWithWallet(file, receiverAddress, message = '') {
    const payload = {
        filename: file.originalname,
        mimetype: file.mimetype,
        file: file.buffer.toString('base64'),
        message,
        timestamp: Date.now()
    };

    const plaintext = JSON.stringify(payload);
    
    // Military-grade key derivation using PBKDF2 with 100,000 iterations
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(receiverAddress.toLowerCase(), salt, 100000, 32, 'sha512');
    
    // AES-256-GCM for authenticated encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Additional layer: ChaCha20-Poly1305 encryption
    const chachaKey = crypto.randomBytes(32);
    const chachaNonce = crypto.randomBytes(12);
    const chachaCipher = crypto.createCipher('chacha20-poly1305', chachaKey);
    chachaCipher.setAAD(Buffer.from('neutrochain-military'));
    
    let doubleEncrypted = chachaCipher.update(encrypted, 'hex', 'hex');
    doubleEncrypted += chachaCipher.final('hex');
    const chachaTag = chachaCipher.getAuthTag();
    
    // Encrypt the ChaCha key with receiver's address
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
        
        // Derive the key encryption key
        const salt = Buffer.from(data.salt, 'hex');
        const keyEncryptionKey = crypto.pbkdf2Sync(receiverAddress.toLowerCase() + 'keyenc', salt, 50000, 32, 'sha512');
        
        // Decrypt the ChaCha key
        const keyIv = Buffer.from(data.keyIv, 'hex');
        const keyAuthTag = Buffer.from(data.keyAuthTag, 'hex');
        const keyDecipher = crypto.createDecipheriv('aes-256-gcm', keyEncryptionKey, keyIv);
        keyDecipher.setAuthTag(keyAuthTag);
        
        let chachaKey = keyDecipher.update(data.encryptedKey, 'hex');
        chachaKey = Buffer.concat([chachaKey, keyDecipher.final()]);
        
        // Decrypt with ChaCha20-Poly1305
        const chachaNonce = Buffer.from(data.chachaNonce, 'hex');
        const chachaTag = Buffer.from(data.chachaTag, 'hex');
        const chachaDecipher = crypto.createDecipher('chacha20-poly1305', chachaKey);
        chachaDecipher.setAAD(Buffer.from('neutrochain-military'));
        chachaDecipher.setAuthTag(chachaTag);
        
        let aesEncrypted = chachaDecipher.update(data.encrypted, 'hex', 'hex');
        aesEncrypted += chachaDecipher.final('hex');
        
        // Decrypt with AES-256-GCM
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

function generateNFTImage(ipfsHash, senderAddress, receiverAddress) {
    try {
        const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
        
        // Dynamic seeded random generator using current timestamp + addresses + hash
        let seedValue = Date.now() + Math.random() * 1000000;
        try {
            const hashSeed = ipfsHash.substring(0, 8);
            seedValue += parseInt(senderAddress.slice(-8), 16) + parseInt(receiverAddress.slice(-8), 16) + hashSeed.charCodeAt(0);
        } catch (e) {
            seedValue += Math.random() * 999999;
        }
        
        const random = () => {
            seedValue = (seedValue * 16807 + Date.now()) % 2147483647;
            return (seedValue % 1000) / 1000;
        };
    
    // Expanded NFT types and colors for more variety
    const nftTypes = ['alien', 'robot', 'zombie', 'demon', 'angel', 'wizard', 'ninja', 'pirate', 'dragon', 'phoenix', 'ghost', 'vampire', 'cyborg', 'mage', 'warrior', 'assassin'];
    const colors = ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#80FF00', '#FF4080', '#40FF80', '#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2', '#073B4C', '#EF476F', '#FFD166'];
    
    const nftType = nftTypes[Math.floor(random() * nftTypes.length)];
    const primaryColor = colors[Math.floor(random() * colors.length)];
    let secondaryColor = colors[Math.floor(random() * colors.length)];
    // Ensure different colors
    while (secondaryColor === primaryColor) {
        secondaryColor = colors[Math.floor(random() * colors.length)];
    }
    const accentColor = colors[Math.floor(random() * colors.length)];
    
    // Dynamic gradient background
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(0.5, secondaryColor);
    gradient.addColorStop(1, accentColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    // Add random geometric patterns
    ctx.fillStyle = accentColor + '40'; // Semi-transparent
    for (let i = 0; i < 5; i++) {
        const x = random() * 400;
        const y = random() * 400;
        const size = 20 + random() * 60;
        if (random() > 0.5) {
            ctx.fillRect(x, y, size, size);
        } else {
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    if (nftType === 'alien') {
        // Alien with big head and tentacles
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(200, 150, 100, 120, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Big black eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(170, 140, 25, 35, 0, 0, 2 * Math.PI);
        ctx.ellipse(230, 140, 25, 35, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Tentacles
        ctx.strokeStyle = '#90EE90';
        ctx.lineWidth = 15;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(150 + i * 20, 270);
            ctx.quadraticCurveTo(120 + i * 30, 320, 100 + i * 40, 380);
            ctx.stroke();
        }
    } else if (nftType === 'robot') {
        // Boxy robot
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(150, 100, 100, 120);
        ctx.fillRect(160, 220, 80, 100);
        
        // Robot eyes (LED)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(170, 130, 15, 15);
        ctx.fillRect(215, 130, 15, 15);
        
        // Antenna
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(200, 100);
        ctx.lineTo(200, 70);
        ctx.stroke();
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(200, 70, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Bolts
        ctx.fillStyle = '#000';
        for (let bolt of [[160, 110], [240, 110], [160, 200], [240, 200]]) {
            ctx.beginPath();
            ctx.arc(bolt[0], bolt[1], 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    } else if (nftType === 'zombie') {
        // Decaying zombie
        ctx.fillStyle = '#8FBC8F';
        ctx.beginPath();
        ctx.arc(200, 180, 80, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(150, 250, 100, 150);
        
        // Bloodshot eyes
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(175, 165, 15, 0, 2 * Math.PI);
        ctx.arc(225, 165, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Stitches
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(140 + i * 30, 200);
            ctx.lineTo(150 + i * 30, 210);
            ctx.stroke();
        }
        
        // Dripping
        ctx.fillStyle = '#8B0000';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(160 + i * 40, 260, 5, 30);
        }
    } else if (nftType === 'demon') {
        // Red demon with horns
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.arc(200, 180, 80, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(150, 250, 100, 150);
        
        // Horns
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(160, 120);
        ctx.lineTo(140, 60);
        ctx.lineTo(180, 100);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(240, 120);
        ctx.lineTo(260, 60);
        ctx.lineTo(220, 100);
        ctx.fill();
        
        // Fire eyes
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(175, 165, 12, 0, 2 * Math.PI);
        ctx.arc(225, 165, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Tail
        ctx.strokeStyle = '#DC143C';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(250, 350);
        ctx.quadraticCurveTo(320, 300, 350, 250);
        ctx.stroke();
    } else if (nftType === 'angel') {
        // White angel with wings
        ctx.fillStyle = '#F8F8FF';
        ctx.beginPath();
        ctx.arc(200, 180, 80, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(150, 250, 100, 150);
        
        // Halo
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(200, 100, 40, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Wings
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(120, 200, 40, 80, -0.3, 0, 2 * Math.PI);
        ctx.ellipse(280, 200, 40, 80, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Peaceful eyes
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(175, 165, 10, 0, 2 * Math.PI);
        ctx.arc(225, 165, 10, 0, 2 * Math.PI);
        ctx.fill();
    } else if (nftType === 'wizard') {
        // Wizard with hat and beard
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(200, 180, 80, 0, 2 * Math.PI);
        ctx.fill();
        
        // Wizard hat
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.moveTo(150, 120);
        ctx.lineTo(200, 50);
        ctx.lineTo(250, 120);
        ctx.fill();
        
        // Stars on hat
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.fillText('★', 180, 90);
        ctx.fillText('★', 210, 100);
        
        // Long beard
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.ellipse(200, 280, 60, 100, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Staff
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(280, 200);
        ctx.lineTo(280, 380);
        ctx.stroke();
        ctx.fillStyle = '#9400D3';
        ctx.beginPath();
        ctx.arc(280, 200, 15, 0, 2 * Math.PI);
        ctx.fill();
    } else if (nftType === 'ninja') {
        // Black ninja
        ctx.fillStyle = '#000';
        ctx.fillRect(150, 100, 100, 250);
        
        // Mask with eyes only
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(175, 165, 8, 0, 2 * Math.PI);
        ctx.arc(225, 165, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Katana
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(280, 150);
        ctx.lineTo(350, 80);
        ctx.stroke();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(275, 145, 20, 10);
        
        // Throwing stars
        ctx.fillStyle = '#C0C0C0';
        for (let star of [[320, 300], [340, 280], [360, 320]]) {
            ctx.font = '15px Arial';
            ctx.fillText('✦', star[0], star[1]);
        }
    } else if (nftType === 'pirate') {
        // Pirate with eyepatch and hat
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(200, 180, 80, 0, 2 * Math.PI);
        ctx.fill();
        
        // Pirate hat
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(200, 120, 90, 30, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.font = '30px Arial';
        ctx.fillText('☠', 185, 130);
        
        // Eyepatch
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(175, 165, 20, 0, 2 * Math.PI);
        ctx.fill();
        
        // Good eye
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(225, 165, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Hook hand
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(280, 280, 20, 0, Math.PI);
        ctx.stroke();
        
        // Parrot
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.ellipse(320, 150, 15, 25, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(335, 150);
        ctx.lineTo(345, 145);
        ctx.lineTo(340, 155);
        ctx.fill();
    }
    
    // Embed IPFS hash using LSB steganography
    const imageData = ctx.getImageData(0, 0, 400, 400);
    const data = imageData.data;
    const hashBytes = Buffer.from(ipfsHash, 'utf8');
    
    // Embed length in first 32 bits
    const length = hashBytes.length;
    for (let i = 0; i < 32; i++) {
        const bit = (length >> (31 - i)) & 1;
        data[i * 4] = (data[i * 4] & 0xFE) | bit;
    }
    
    // Embed hash bits
    let bitIndex = 0;
    for (let i = 0; i < hashBytes.length; i++) {
        for (let bit = 0; bit < 8; bit++) {
            const hashBit = (hashBytes[i] >> (7 - bit)) & 1;
            const pixelIndex = (32 + bitIndex) * 4;
            if (pixelIndex < data.length) {
                data[pixelIndex] = (data[pixelIndex] & 0xFE) | hashBit;
            }
            bitIndex++;
        }
    }
    
        ctx.putImageData(imageData, 0, 0);
        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('Canvas error:', error.message);
        // Return a simple fallback image
        const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NeutroChain NFT', 200, 200);
        return canvas.toBuffer('image/png');
    }
}

function extractHashFromNFT(imageBuffer) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                const canvas = createCanvas(400, 400);
                const ctx = canvas.getContext('2d');
                
                const img = await loadImage(imageBuffer);
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, 400, 400);
                const data = imageData.data;
                
                // Extract length from first 32 LSBs
                let length = 0;
                for (let i = 0; i < 32; i++) {
                    const bit = data[i * 4] & 1;
                    length = (length << 1) | bit;
                }
                
                // Extract hash bits
                const hashBytes = new Uint8Array(length);
                let bitIndex = 0;
                for (let i = 0; i < length; i++) {
                    let byte = 0;
                    for (let bit = 0; bit < 8; bit++) {
                        const pixelIndex = (32 + bitIndex) * 4;
                        if (pixelIndex < data.length) {
                            const hashBit = data[pixelIndex] & 1;
                            byte = (byte << 1) | hashBit;
                        }
                        bitIndex++;
                    }
                    hashBytes[i] = byte;
                }
                
                resolve(Buffer.from(hashBytes).toString('utf8'));
            } catch (error) {
                reject(new Error('Invalid NFT image format'));
            }
        });
    } catch (error) {
        throw new Error('Invalid NFT image format');
    }
}

module.exports = router;