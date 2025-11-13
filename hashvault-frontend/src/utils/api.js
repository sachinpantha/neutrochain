import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API functions
export const apiService = {
  // Send file to inbox
  sendToInbox: (formData) => {
    return api.post(API_ENDPOINTS.SEND_TO_INBOX, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Get inbox files
  getInbox: (walletAddress) => {
    return api.get(`${API_ENDPOINTS.GET_INBOX}/${walletAddress}`);
  },

  // Delete file from inbox
  deleteFile: (fileId) => {
    return api.delete(`${API_ENDPOINTS.DELETE_FILE}/${fileId}`);
  },

  // Generate NFT
  generateNFT: (fileId, requestorAddress, signature) => {
    return api.post(`${API_ENDPOINTS.GENERATE_NFT}/${fileId}`, {
      requestorAddress,
      signature
    }, {
      responseType: 'blob'
    });
  },

  // Decrypt and download file
  decryptDownload: (formData) => {
    return api.post(API_ENDPOINTS.DECRYPT_DOWNLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Encrypt for multiple recipients
  encryptMulti: (formData) => {
    return api.post(API_ENDPOINTS.ENCRYPT_MULTI, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    });
  }
};

export default api;