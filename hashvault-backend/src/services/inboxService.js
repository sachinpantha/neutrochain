const crypto = require('crypto');

const inboxStorage = new Map();

function addToInbox(receiverAddress, fileData, senderAddress, message) {
    const fileId = crypto.randomUUID();
    const inboxFile = {
        id: fileId,
        filename: fileData.originalname,
        mimetype: fileData.mimetype,
        fileData: fileData.buffer.toString('base64'),
        message: message || '',
        senderAddress,
        timestamp: Date.now()
    };

    if (!inboxStorage.has(receiverAddress.toLowerCase())) {
        inboxStorage.set(receiverAddress.toLowerCase(), []);
    }
    inboxStorage.get(receiverAddress.toLowerCase()).push(inboxFile);
    
    return fileId;
}

function addToMultipleInboxes(receiverAddresses, fileData, senderAddress, message) {
    const fileId = crypto.randomUUID();
    const inboxFile = {
        id: fileId,
        filename: fileData.originalname,
        mimetype: fileData.mimetype,
        fileData: fileData.buffer.toString('base64'),
        message: message || '',
        senderAddress,
        recipients: receiverAddresses.map(addr => addr.toLowerCase()),
        isMultiRecipient: true,
        timestamp: Date.now()
    };

    receiverAddresses.forEach(address => {
        const normalizedAddress = address.toLowerCase();
        if (!inboxStorage.has(normalizedAddress)) {
            inboxStorage.set(normalizedAddress, []);
        }
        inboxStorage.get(normalizedAddress).push(inboxFile);
    });
    
    return fileId;
}

function getInboxFiles(address) {
    return inboxStorage.get(address.toLowerCase()) || [];
}

function findFileById(fileId) {
    for (const [address, files] of inboxStorage.entries()) {
        const file = files.find(f => f.id === fileId);
        if (file) {
            return { file, receiverAddress: address };
        }
    }
    return null;
}

function deleteFile(fileId) {
    for (const [address, files] of inboxStorage.entries()) {
        const index = files.findIndex(f => f.id === fileId);
        if (index !== -1) {
            files.splice(index, 1);
            return true;
        }
    }
    return false;
}

module.exports = { addToInbox, addToMultipleInboxes, getInboxFiles, findFileById, deleteFile };