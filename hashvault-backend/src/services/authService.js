const { ethers } = require('ethers');

function verifySignature(message, signature, expectedAddress) {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
}

module.exports = { verifySignature };