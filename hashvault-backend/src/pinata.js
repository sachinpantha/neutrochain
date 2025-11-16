// pinata.js
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

async function uploadEncryptedToPinata(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const jwt = process.env.PINATA_JWT;
    if (!jwt) throw new Error('PINATA_JWT env var is required');

    const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
            maxBodyLength: Infinity,
            timeout: 200000,
            headers: {
                Authorization: jwt,
                ...formData.getHeaders(),
            },
            validateStatus: s => s >= 200 && s < 300,
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    onProgress(progress);
                }
            }
        }
    );

    if (!res.data || !res.data.IpfsHash) {
        throw new Error('Pinata upload did not return an IpfsHash');
    }

    return res.data.IpfsHash;
}

module.exports = { uploadEncryptedToPinata };
