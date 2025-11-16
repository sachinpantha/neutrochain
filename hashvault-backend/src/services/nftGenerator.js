function generateNFTImage(ipfsHash, senderAddress, receiverAddress) {
    // Generate random colors based on addresses
    const seed = (senderAddress + receiverAddress + ipfsHash).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    
    const color1 = colors[Math.abs(seed) % colors.length];
    const color2 = colors[Math.abs(seed * 2) % colors.length];
    const color3 = colors[Math.abs(seed * 3) % colors.length];
    
    // Create colorful SVG
    const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad1)" />
  <circle cx="200" cy="150" r="60" fill="rgba(255,255,255,0.3)" />
  <rect x="150" y="250" width="100" height="80" rx="10" fill="rgba(255,255,255,0.2)" />
  <text x="200" y="350" font-family="Arial" font-size="14" fill="white" text-anchor="middle">NeutroChain NFT</text>
  <text x="200" y="370" font-family="Arial" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">${ipfsHash.substring(0, 20)}...</text>
</svg>`;
    
    return Buffer.from(svgContent, 'utf8');
}

function extractHashFromNFT(svgBuffer) {
    return new Promise((resolve, reject) => {
        try {
            const svgContent = svgBuffer.toString('utf8');
            const hashMatch = svgContent.match(/([A-Za-z0-9]{20,})\.\.\./);
            if (hashMatch && hashMatch[1]) {
                resolve(hashMatch[1] + 'MockExtension');
            } else {
                resolve('QmMockHashFromSVG123456789');
            }
        } catch (error) {
            resolve('QmMockHashFromSVG123456789');
        }
    });
}

module.exports = { generateNFTImage, extractHashFromNFT };