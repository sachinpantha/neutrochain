function generateNFTImage(ipfsHash, senderAddress, receiverAddress) {
    console.log('generateNFTImage called with:', { ipfsHash, senderAddress, receiverAddress });
    try {
        console.log('Creating SVG content...');
        // Create SVG image as string
        const svgContent = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad1)" />
  <text x="200" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">NeutroChain NFT</text>
  <text x="200" y="150" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Hash: ${ipfsHash.substring(0, 20)}...</text>
  <text x="200" y="200" font-family="Arial" font-size="14" fill="white" text-anchor="middle">From: ${senderAddress.slice(0, 6)}...${senderAddress.slice(-4)}</text>
  <text x="200" y="230" font-family="Arial" font-size="14" fill="white" text-anchor="middle">To: ${receiverAddress.slice(0, 6)}...${receiverAddress.slice(-4)}</text>
  <text x="200" y="300" font-family="Arial" font-size="10" fill="white" text-anchor="middle" opacity="0.1">${ipfsHash}</text>
</svg>`;
        
        console.log('Converting SVG to buffer...');
        const buffer = Buffer.from(svgContent, 'utf8');
        console.log('✓ SVG buffer created, size:', buffer.length);
        return buffer;
    } catch (error) {
        console.error('SVG generation error:', error);
        const fallbackSvg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#4F46E5"/><text x="200" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">NeutroChain NFT</text></svg>`;
        return Buffer.from(fallbackSvg, 'utf8');
    }
}





function extractHashFromNFT(svgBuffer) {
    return new Promise((resolve, reject) => {
        try {
            const svgContent = svgBuffer.toString('utf8');
            // Extract hash from hidden text element
            const hashMatch = svgContent.match(/<text[^>]*opacity="0\.1"[^>]*>([^<]+)<\/text>/);
            
            if (hashMatch && hashMatch[1]) {
                resolve(hashMatch[1]);
            } else {
                reject(new Error('Invalid NFT format - no IPFS hash found'));
            }
        } catch (error) {
            reject(new Error('Invalid NFT format'));
        }
    });
}



module.exports = { generateNFTImage, extractHashFromNFT };