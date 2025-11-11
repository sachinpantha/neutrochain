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

module.exports = { addToInbox, getInboxFiles, findFileById, deleteFile };