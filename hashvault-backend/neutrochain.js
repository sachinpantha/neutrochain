const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { uploadEncryptedToPinata } = require('./pinata');
const { encryptWithWallet, decryptWithWallet } = require('./services/encryption');
const { generateNFTImage, extractHashFromNFT } = require('./services/nftGenerator');
const { addToInbox, getInboxFiles, findFileById, deleteFile } = require('./services/inboxService');
const { verifySignature } = require('./services/authService');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }
});

// Send file to receiver's inbox
router.post('/send-to-inbox', upload.single('file'), async (req, res) => {
    const { receiverAddress, message, senderAddress, signature } = req.body;
    
    if (!req.file || !receiverAddress || !senderAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        if (!verifySignature('NeutroChain Upload', signature, senderAddress)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        addToInbox(receiverAddress, req.file, senderAddress, message);
        res.json({ success: true, message: 'File sent to inbox successfully' });

    } catch (error) {
        console.error('Send to inbox error:', error);
        res.status(500).json({ error: 'Failed to send file' });
    }
});

// Get inbox files
router.get('/inbox/:address', (req, res) => {
    const files = getInboxFiles(req.params.address);
    res.json({ files });
});

// Generate NFT from inbox file
router.post('/generate-nft/:fileId', async (req, res) => {
    const { fileId } = req.params;
    
    try {
        const result = findFileById(fileId);
        if (!result) {
            return res.status(404).json({ error: 'File not found' });
        }

        const { file: fileData, receiverAddress } = result;
        
        const encryptedData = encryptWithWallet({
            buffer: Buffer.from(fileData.fileData, 'base64'),
            originalname: fileData.filename,
            mimetype: fileData.mimetype
        }, receiverAddress, fileData.message || '');
        
        const ipfsHash = await uploadEncryptedToPinata({
            buffer: encryptedData,
            originalname: fileData.filename + '.enc'
        });

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
    
    if (deleteFile(fileId)) {
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Encrypt file using receiver's wallet address (legacy endpoint)
router.post('/encrypt-upload', upload.single('file'), async (req, res) => {
    const { receiverAddress, message, senderAddress, signature } = req.body;
    
    if (!req.file || !receiverAddress || !senderAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        if (!verifySignature('NeutroChain Upload', signature, senderAddress)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const encryptedData = encryptWithWallet(req.file, receiverAddress, message);
        
        const ipfsHash = await uploadEncryptedToPinata({
            buffer: encryptedData,
            originalname: req.file.originalname + '.enc'
        });

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
        if (!verifySignature('NeutroChain Decrypt', signature, receiverAddress)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const ipfsHash = await extractHashFromNFT(nftImage.buffer);
        
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
            responseType: 'text',
            timeout: 30000
        });

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



module.exports = router;