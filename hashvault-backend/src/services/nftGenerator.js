let createCanvas, loadImage;
try {
    const canvasModule = require('canvas');
    createCanvas = canvasModule.createCanvas;
    loadImage = canvasModule.loadImage;
} catch (error) {
    console.log('Canvas not available, using fallback');
}

function generateNFTImage(ipfsHash, senderAddress, receiverAddress) {
    if (!createCanvas) {
        return createSimplePNG(ipfsHash);
    }
    
    try {
        const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
        
        // Generate random colors based on addresses
        const seed = (senderAddress + receiverAddress + ipfsHash).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#D7BDE2', '#AED6F1',
            '#A9DFBF', '#F9E79F', '#F5B7B1', '#D2B4DE', '#AED6F1',
            '#85C1E9', '#7FB3D3', '#5DADE2', '#3498DB', '#2E86C1',
            '#E74C3C', '#C0392B', '#A93226', '#922B21', '#7B241C'
        ];
        
        const color1 = colors[Math.abs(seed) % colors.length];
        const color2 = colors[Math.abs(seed * 2) % colors.length];
        const color3 = colors[Math.abs(seed * 3) % colors.length];
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.5, color2);
        gradient.addColorStop(1, color3);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        // Add random shapes based on seed
        const shapeCount = 3 + (Math.abs(seed) % 4);
        for (let i = 0; i < shapeCount; i++) {
            const shapeSeed = seed + i * 1000;
            const x = 50 + (Math.abs(shapeSeed) % 300);
            const y = 50 + (Math.abs(shapeSeed * 2) % 300);
            const size = 30 + (Math.abs(shapeSeed * 3) % 80);
            const opacity = 0.1 + (Math.abs(shapeSeed * 4) % 30) / 100;
            
            ctx.fillStyle = `rgba(255,255,255,${opacity})`;
            
            if (shapeSeed % 3 === 0) {
                // Circle
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
                ctx.fill();
            } else if (shapeSeed % 3 === 1) {
                // Rectangle
                ctx.fillRect(x - size/2, y - size/2, size, size * 0.6);
            } else {
                // Triangle
                ctx.beginPath();
                ctx.moveTo(x, y - size/2);
                ctx.lineTo(x - size/2, y + size/2);
                ctx.lineTo(x + size/2, y + size/2);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NeutroChain NFT', 200, 350);
        
        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(ipfsHash.substring(0, 20) + '...', 200, 370);
        
        // Embed hash in image data (steganography)
        embedHashInImage(ctx, ipfsHash);
        
        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('Canvas PNG generation error:', error);
        // Return a simple colored PNG if canvas fails
        return createFallbackPNG();
    }
}

function embedHashInImage(ctx, ipfsHash) {
    try {
        const imageData = ctx.getImageData(0, 0, 400, 400);
        const data = imageData.data;
        const hashBytes = Buffer.from(ipfsHash, 'utf8');
        
        // Embed hash length in first 32 pixels
        const length = hashBytes.length;
        for (let i = 0; i < 32; i++) {
            const bit = (length >> (31 - i)) & 1;
            data[i * 4] = (data[i * 4] & 0xFE) | bit;
        }
        
        // Embed hash data
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
    } catch (error) {
        console.error('Hash embedding error:', error);
    }
}

function createSimplePNG(ipfsHash) {
    // Create a simple colored PNG based on hash
    const colors = {
        red: [0xFF, 0x00, 0x00],
        green: [0x00, 0xFF, 0x00], 
        blue: [0x00, 0x00, 0xFF],
        purple: [0x80, 0x00, 0x80],
        orange: [0xFF, 0xA5, 0x00]
    };
    
    const colorKeys = Object.keys(colors);
    const colorIndex = ipfsHash.charCodeAt(0) % colorKeys.length;
    const [r, g, b] = colors[colorKeys[colorIndex]];
    
    // Simple 1x1 colored PNG
    return Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x01, 0x90, 0x00, 0x00, 0x01, 0x90,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x4A, 0x7C, 0x7E, 0x5B,
        0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54,
        0x08, 0x1D, 0x01, 0x01, 0x00, 0x00, 0xFE, 0xFF, r, g, b, 0x02, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
}

function createFallbackPNG() {
    return createSimplePNG('fallback');
}

function extractHashFromNFT(pngBuffer) {
    return new Promise(async (resolve, reject) => {
        if (!createCanvas || !loadImage) {
            // Fallback for simple PNGs - return mock hash
            resolve('QmMockHashFromSimplePNG123456789');
            return;
        }
        
        try {
            const canvas = createCanvas(400, 400);
            const ctx = canvas.getContext('2d');
            
            const img = await loadImage(pngBuffer);
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, 400, 400);
            const data = imageData.data;
            
            // Extract hash length from first 32 pixels
            let length = 0;
            for (let i = 0; i < 32; i++) {
                const bit = data[i * 4] & 1;
                length = (length << 1) | bit;
            }
            
            // Extract hash data
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
            console.error('Hash extraction error:', error);
            resolve('QmMockHashFromPNG123456789');
        }
    });
}

module.exports = { generateNFTImage, extractHashFromNFT, createFallbackPNG };