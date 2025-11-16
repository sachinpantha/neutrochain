const { ethers } = require('ethers');

function verifySignature(message, signature, expectedAddress) {
    console.log('=== SIGNATURE VERIFICATION ===');
    console.log('Message:', message);
    console.log('Signature:', signature);
    console.log('Expected Address:', expectedAddress);
    
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        console.log('Recovered Address:', recoveredAddress);
        
        const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
        console.log('Signature Valid:', isValid);
        
        if (!isValid) {
            console.log('Address mismatch:');
            console.log('  Expected (lower):', expectedAddress.toLowerCase());
            console.log('  Recovered (lower):', recoveredAddress.toLowerCase());
        }
        
        return isValid;
    } catch (error) {
        console.error('Signature verification error:', error);
        console.error('Error message:', error.message);
        return false;
    }
}

module.exports = { verifySignature };