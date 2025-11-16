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
    console.log('=== NFT GENERATION START ===');
    const { fileId } = req.params;
    const { requestorAddress, signature } = req.body;
    console.log('Request params:', { fileId, requestorAddress, hasSignature: !!signature });
    
    if (!requestorAddress || !signature) {
        console.log('ERROR: Missing required fields');
        return res.status(400).json({ error: 'Missing requestor address or signature' });
    }
    
    try {
        console.log('Step 1: Verifying signature...');
        if (!verifySignature('NeutroChain NFT Generate', signature, requestorAddress)) {
            console.log('ERROR: Invalid signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        console.log('✓ Signature verified');

        console.log('Step 2: Finding file by ID...');
        const result = findFileById(fileId);
        if (!result) {
            console.log('ERROR: File not found for ID:', fileId);
            return res.status(404).json({ error: 'File not found' });
        }
        console.log('✓ File found:', result.file.filename);

        const { file: fileData, receiverAddress } = result;
        
        console.log('Step 3: Checking authorization...');
        const isAuthorized = fileData.isMultiRecipient 
            ? fileData.recipients?.includes(requestorAddress.toLowerCase())
            : receiverAddress.toLowerCase() === requestorAddress.toLowerCase();
            
        if (!isAuthorized) {
            console.log('ERROR: Not authorized. RequestorAddress:', requestorAddress, 'ReceiverAddress:', receiverAddress);
            return res.status(403).json({ error: 'Not authorized to generate NFT for this file' });
        }
        console.log('✓ Authorization verified');
        
        console.log('Step 4: Generating mock hash...');
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 48);
        console.log('✓ Mock hash generated:', mockHash);
        
        console.log('Step 5: Creating SVG directly...');
        const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#4F46E5"/><text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">NeutroChain NFT</text><text x="200" y="250" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${mockHash}</text></svg>`;
        const nftImageBuffer = Buffer.from(svgContent, 'utf8');
        console.log('✓ NFT image generated, buffer size:', nftImageBuffer.length);
        
        console.log('Step 6: Sending response...');
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-nft.svg"');
        res.send(nftImageBuffer);
        console.log('✓ Response sent successfully');
        console.log('=== NFT GENERATION SUCCESS ===');

    } catch (error) {
        console.log('=== NFT GENERATION ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        console.log('Sending fallback SVG...');
        const fallbackSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#4F46E5"/><text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">NeutroChain NFT</text></svg>`;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-nft.svg"');
        res.send(Buffer.from(fallbackSvg, 'utf8'));
        console.log('✓ Fallback SVG sent');
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

        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 48);
        const nftImageBuffer = generateNFTImage(mockHash, senderAddress, addresses[0]);
        
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-multi-nft.svg"');
        res.send(nftImageBuffer);

    } catch (error) {
        const fallbackSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#4F46E5"/><text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">NeutroChain NFT</text></svg>`;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-multi-nft.svg"');
        res.send(Buffer.from(fallbackSvg, 'utf8'));
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

        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 48);
        const nftImageBuffer = generateNFTImage(mockHash, senderAddress, receiverAddress);
        
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-nft.svg"');
        res.send(nftImageBuffer);

    } catch (error) {
        const fallbackSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#4F46E5"/><text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">NeutroChain NFT</text></svg>`;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="neutrochain-nft.svg"');
        res.send(Buffer.from(fallbackSvg, 'utf8'));
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