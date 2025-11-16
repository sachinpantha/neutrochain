const { createCanvas, loadImage } = require('canvas');

function generateNFTImage(ipfsHash, senderAddress, receiverAddress) {
    try {
        const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
        
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
    
        const nftTypes = ['alien', 'robot', 'zombie', 'demon', 'angel', 'wizard', 'ninja', 'pirate'];
        const colors = ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#80FF00', '#FF4080', '#40FF80'];
        
        const nftType = nftTypes[Math.floor(random() * nftTypes.length)];
        const primaryColor = colors[Math.floor(random() * colors.length)];
        let secondaryColor = colors[Math.floor(random() * colors.length)];
        while (secondaryColor === primaryColor) {
            secondaryColor = colors[Math.floor(random() * colors.length)];
        }
        const accentColor = colors[Math.floor(random() * colors.length)];
        
        const gradient = ctx.createLinearGradient(0, 0, 400, 400);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(0.5, secondaryColor);
        gradient.addColorStop(1, accentColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        ctx.fillStyle = accentColor + '40';
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
        
        drawNFTCharacter(ctx, nftType);
        embedHashInImage(ctx, ipfsHash);
        
        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('Canvas error:', error.message);
        return createFallbackImage();
    }
}

function drawNFTCharacter(ctx, nftType) {
    if (nftType === 'alien') {
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(200, 150, 100, 120, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(170, 140, 25, 35, 0, 0, 2 * Math.PI);
        ctx.ellipse(230, 140, 25, 35, 0, 0, 2 * Math.PI);
        ctx.fill();
    } else if (nftType === 'robot') {
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(150, 100, 100, 120);
        ctx.fillRect(160, 220, 80, 100);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(170, 130, 15, 15);
        ctx.fillRect(215, 130, 15, 15);
    } else if (nftType === 'wizard') {
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(200, 180, 80, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.moveTo(150, 120);
        ctx.lineTo(200, 50);
        ctx.lineTo(250, 120);
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.fillText('★', 180, 90);
    }
}

function embedHashInImage(ctx, ipfsHash) {
    const imageData = ctx.getImageData(0, 0, 400, 400);
    const data = imageData.data;
    const hashBytes = Buffer.from(ipfsHash, 'utf8');
    
    const length = hashBytes.length;
    for (let i = 0; i < 32; i++) {
        const bit = (length >> (31 - i)) & 1;
        data[i * 4] = (data[i * 4] & 0xFE) | bit;
    }
    
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
}

function extractHashFromNFT(imageBuffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const canvas = createCanvas(400, 400);
            const ctx = canvas.getContext('2d');
            
            const img = await loadImage(imageBuffer);
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, 400, 400);
            const data = imageData.data;
            
            let length = 0;
            for (let i = 0; i < 32; i++) {
                const bit = data[i * 4] & 1;
                length = (length << 1) | bit;
            }
            
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
}

function createFallbackImage() {
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

module.exports = { generateNFTImage, extractHashFromNFT };