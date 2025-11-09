// download.js
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const MARKER = "---HASHVAULT_START---";
const PEPPER = process.env.PEPPER || "";

// Basic IP-based rate limiting
const decryptLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/decrypt", decryptLimiter, async (req, res) => {
    const { hash, pin, socketId } = req.body;
    const io = req.app.get('io'); // Get socket.io instance

    if (!hash || typeof hash !== "string" || !/^[A-Za-z0-9]+$/.test(hash) || hash.length > 128) {
        return res.status(400).json({ error: "Invalid hash format" });
    }
    if (!/^\d{5}$/.test(pin)) {
        return res.status(400).json({ error: "Hash and 5-digit PIN required" });
    }

    const key = `${req.ip}:${hash}`;
    if (!global.__hv_attempts) global.__hv_attempts = new Map();
    const WINDOW_MS = 10 * 60 * 1000;
    const MAX_ATTEMPTS = 3;
    const now = Date.now();
    const rec = global.__hv_attempts.get(key) || { count: 0, until: now + WINDOW_MS };
    if (now > rec.until) {
        rec.count = 0;
        rec.until = now + WINDOW_MS;
    }
    if (rec.count >= MAX_ATTEMPTS) {
        return res.status(429).json({ error: "Too many attempts for this file. Try later." });
    }

    try {
        // Emit progress update
        if (socketId && io) {
            io.to(socketId).emit('decrypt-progress', { progress: 10, message: 'Connecting to IPFS...' });
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        if (socketId && io) {
            io.to(socketId).emit('decrypt-progress', { progress: 30, message: 'Downloading from IPFS...' });
        }

        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
        const response = await axios.get(ipfsUrl, {
            responseType: "text",
            timeout: 80000,
            maxContentLength: 40 * 1024 * 1024,
            headers: { Accept: "application/json" },
            validateStatus: (s) => s >= 200 && s < 400,
            onDownloadProgress: (progressEvent) => {
                if (socketId && io && progressEvent.total) {
                    const downloadProgress = 30 + (progressEvent.loaded / progressEvent.total) * 40; // Scale to 30-70%
                    io.to(socketId).emit('decrypt-progress', {
                        progress: Math.min(70, downloadProgress),
                        message: 'Downloading from IPFS...'
                    });
                }
            }
        });

        if (socketId && io) {
            io.to(socketId).emit('decrypt-progress', { progress: 75, message: 'Parsing encrypted data...' });
        }

        let enc;
        try {
            enc = JSON.parse(response.data);
        } catch {
            rec.count++;
            global.__hv_attempts.set(key, rec);
            if (socketId && io) {
                io.to(socketId).emit('decrypt-error', { error: 'Invalid encrypted file' });
            }
            return res.status(400).json({ error: "Invalid encrypted file" });
        }

        if (socketId && io) {
            io.to(socketId).emit('decrypt-progress', { progress: 85, message: 'Decrypting file...' });
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        const decrypted = decryptPayload(enc, pin);
        if (!decrypted || decrypted.marker !== MARKER) {
            rec.count++;
            global.__hv_attempts.set(key, rec);
            if (socketId && io) {
                io.to(socketId).emit('decrypt-error', { error: 'Incorrect PIN or corrupt file' });
            }
            return res.status(401).json({ error: "Incorrect PIN or corrupt file" });
        }

        if (socketId && io) {
            io.to(socketId).emit('decrypt-progress', { progress: 95, message: 'Preparing download...' });
        }

        global.__hv_attempts.delete(key);

        const fileBuffer = Buffer.from(decrypted.data, "base64");
        const filename = sanitizeFilename(decrypted.name || "decrypted_file");
        const mime = decrypted.type || "application/octet-stream";

        if (socketId && io) {
            io.to(socketId).emit('decrypt-progress', { progress: 100, message: 'Decryption complete!' });
        }

        // ✅ Instead of sending raw file, send JSON metadata + base64 file
        return res.json({
            filename,
            mime,
            file: fileBuffer.toString("base64"),
        });
    } catch (err) {
        console.error("❌ Decryption failed:", err && err.message ? err.message : err);
        if (socketId && io) {
            io.to(socketId).emit('decrypt-error', { error: 'Decryption failed or file not found' });
        }
        return res.status(500).json({ error: "Decryption failed or file not found" });
    }
});

function decryptPayload(enc, pin) {
    try {
        if (!enc || enc.v !== 2 || enc.alg !== "AES-256-GCM") return null;
        if (!enc.salt || !enc.iv || !enc.tag || !enc.ct) return null;

        const salt = Buffer.from(enc.salt, "base64");
        const iv = Buffer.from(enc.iv, "base64");
        const tag = Buffer.from(enc.tag, "base64");
        const ct = Buffer.from(enc.ct, "base64");

        const key = crypto.scryptSync(pin + PEPPER, salt, 32);

        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(tag);
        const pt = Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
        return JSON.parse(pt);
    } catch {
        return null;
    }
}

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9_\-.\(\) ]+/g, "_").slice(0, 200);
}

module.exports = router;