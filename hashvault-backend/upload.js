// upload.js
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { uploadEncryptedToPinata } = require('./pinata');

const router = express.Router();

// Limit: memory storage but restrict file size to prevent OOM
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: parseInt(process.env.MAX_UPLOAD_BYTES || `${25 * 1024 * 1024}`), // default 25MB
    },
});

const MARKER = '---HASHVAULT_START---';
const PEPPER = process.env.PEPPER || '';

router.post('/upload', upload.single('file'), async (req, res) => {
    const { pin, socketId } = req.body;
    const io = req.app.get('io'); // Get socket.io instance

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!/^\d{5}$/.test(pin)) return res.status(400).json({ error: 'PIN must be exactly 5 digits' });

    try {
        // Emit progress update
        if (socketId && io) {
            io.to(socketId).emit('upload-progress', { progress: 10, message: 'Starting encryption...' });
        }

        // Simulate encryption progress
        await new Promise(resolve => setTimeout(resolve, 500));
        if (socketId && io) {
            io.to(socketId).emit('upload-progress', { progress: 30, message: 'Encrypting file...' });
        }

        const encryptedBuffer = encryptFilePayload(req.file, pin);
        const encryptedFile = {
            buffer: encryptedBuffer,
            originalname: req.file.originalname + '.enc',
        };

        if (socketId && io) {
            io.to(socketId).emit('upload-progress', { progress: 50, message: 'Preparing for IPFS upload...' });
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        if (socketId && io) {
            io.to(socketId).emit('upload-progress', { progress: 70, message: 'Uploading to IPFS...' });
        }

        const ipfsHash = await uploadEncryptedToPinata(encryptedFile, (progress) => {
            if (socketId && io) {
                const uploadProgress = 70 + (progress * 0.25); // Scale to 70-95%
                io.to(socketId).emit('upload-progress', {
                    progress: Math.min(95, uploadProgress),
                    message: 'Uploading to IPFS...'
                });
            }
        });

        if (socketId && io) {
            io.to(socketId).emit('upload-progress', { progress: 100, message: 'Upload complete!' });
        }

        res.json({ hash: ipfsHash });
    } catch (err) {
        console.error('Upload error:', err);
        if (socketId && io) {
            io.to(socketId).emit('upload-error', { error: 'Encryption or upload failed' });
        }
        res.status(500).json({ error: 'Encryption or upload failed' });
    }
});

function encryptFilePayload(file, pin) {
    const payloadObj = {
        marker: MARKER,
        name: file.originalname,
        type: file.mimetype || 'application/octet-stream',
        data: file.buffer.toString('base64'),
    };

    const plaintext = Buffer.from(JSON.stringify(payloadObj), 'utf8');

    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);

    // ✅ Use scryptSync with defaults
    const derivedKey = crypto.scryptSync(pin + PEPPER, salt, 32);

    const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();

    const out = {
        v: 2,
        alg: 'AES-256-GCM',
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        ct: ciphertext.toString('base64'),
    };

    return Buffer.from(JSON.stringify(out), 'utf8');
}

module.exports = router;