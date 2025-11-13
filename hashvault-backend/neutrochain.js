const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { uploadEncryptedToPinata } = require('./pinata');
const { encryptWithWallet, decryptWithWallet, encryptForMultipleRecipients, decryptMultiRecipient } = require('./services/encryption');
const { generateNFTImage, extractHashFromNFT } = require('./services/nftGenerator');
const { addToInbox, addToMultipleInboxes, getInboxFiles, findFileById, deleteFile } = require('./services/inboxService');
const { verifySignature } = require('./services/authService');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }
});

// Send file to receiver's inbox (supports multiple recipients)
router.post('/send-to-inbox', upload.single('file'), async (req, res) => {
    const { receiverAddress, receiverAddresses, message, senderAddress, signature } = req.body;
    
    if (!req.file || (!receiverAddress && !receiverAddresses) || !senderAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        if (!verifySignature('NeutroChain Upload', signature, senderAddress)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Handle multiple recipients
        if (receiverAddresses) {
            const addresses = JSON.parse(receiverAddresses);
            if (addresses.length > 10) {
                return res.status(400).json({ error: 'Maximum 10 recipients allowed' });
            }
            addToMultipleInboxes(addresses, req.file, senderAddress, message);
            res.json({ success: true, message: `File sent to ${addresses.length} recipients successfully` });
        } else {
            // Single recipient (backward compatibility)
            addToInbox(receiverAddress, req.file, senderAddress, message);
            res.json({ success: true, message: 'File sent to inbox successfully' });
        }

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
    const { requestorAddress, signature } = req.body;
    
    if (!requestorAddress || !signature) {
        return res.status(400).json({ error: 'Missing requestor address or signature' });
    }
    
    try {
        if (!verifySignature('NeutroChain NFT Generate', signature, requestorAddress)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const result = findFileById(fileId);
        if (!result) {
            return res.status(404).json({ error: 'File not found' });
        }

        const { file: fileData, receiverAddress } = result;
        
        // Verify requestor is authorized recipient
        const isAuthorized = fileData.isMultiRecipient 
            ? fileData.recipients?.includes(requestorAddress.toLowerCase())
            : receiverAddress.toLowerCase() === requestorAddress.toLowerCase();
            
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Not authorized to generate NFT for this file' });
        }
        
        // Create recipient-specific payload with binding
        const recipientSpecificPayload = {
            filename: fileData.filename,
            mimetype: fileData.mimetype,
            file: fileData.fileData,
            message: fileData.message || '',
            timestamp: Date.now(),
            boundTo: requestorAddress.toLowerCase(),
            originalSender: fileData.senderAddress
        };

        // Encrypt with recipient binding
        const encryptedData = encryptWithWallet({
            buffer: Buffer.from(JSON.stringify(recipientSpecificPayload)),
            originalname: fileData.filename + '.bound',
            mimetype: 'application/json'
        }, requestorAddress, fileData.message || '');
        
        const ipfsHash = await uploadEncryptedToPinata({
            buffer: encryptedData,
            originalname: fileData.filename + '.enc'
        });

        const nftImageBuffer = generateNFTImage(ipfsHash, fileData.senderAddress, requestorAddress);
        
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

// Encrypt file for multiple recipients
router.post('/encrypt-multi', upload.single('file'), async (req, res) => {
    const { receiverAddresses, message, senderAddress, signature } = req.body;
    
    if (!req.file || !receiverAddresses || !senderAddress || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        if (!verifySignature('NeutroChain Upload', signature, senderAddress)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const addresses = JSON.parse(receiverAddresses);
        if (addresses.length > 10) {
            return res.status(400).json({ error: 'Maximum 10 recipients allowed' });
        }

        const encryptedData = encryptForMultipleRecipients(req.file, addresses, message);
        
        const ipfsHash = await uploadEncryptedToPinata({
            buffer: encryptedData,
            originalname: req.file.originalname + '.enc'
        });

        const nftImageBuffer = generateNFTImage(ipfsHash, senderAddress, addresses[0]);
        
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-multi-nft.png"');
        res.send(nftImageBuffer);

    } catch (error) {
        console.error('Multi-encryption error:', error);
        res.status(500).json({ error: 'Multi-encryption failed' });
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

        // Try decryption
        let decryptedData = decryptWithWallet(response.data, receiverAddress);
        if (!decryptedData) {
            decryptedData = decryptMultiRecipient(response.data, receiverAddress);
        }
        
        if (!decryptedData) {
            return res.status(401).json({ error: 'Decryption failed - invalid key' });
        }

        // Handle recipient-bound NFTs
        if (decryptedData.filename && decryptedData.filename.endsWith('.bound')) {
            try {
                const boundPayload = JSON.parse(Buffer.from(decryptedData.file, 'base64').toString());
                
                // Verify binding to current recipient
                if (boundPayload.boundTo !== receiverAddress.toLowerCase()) {
                    return res.status(403).json({ error: 'NFT not bound to this recipient' });
                }
                
                // Return original file data
                res.json({
                    success: true,
                    filename: boundPayload.filename,
                    mimetype: boundPayload.mimetype,
                    file: boundPayload.file,
                    message: boundPayload.message
                });
            } catch (error) {
                return res.status(400).json({ error: 'Invalid bound NFT format' });
            }
        } else {
            // Regular NFT
            res.json({
                success: true,
                filename: decryptedData.filename,
                mimetype: decryptedData.mimetype,
                file: decryptedData.file,
                message: decryptedData.message
            });
        }

    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ error: 'Decryption failed' });
    }
});



module.exports = router;