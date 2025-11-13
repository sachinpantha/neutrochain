// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  SEND_TO_INBOX: '/api/neutrochain/send-to-inbox',
  GET_INBOX: '/api/neutrochain/inbox',
  DELETE_FILE: '/api/neutrochain/inbox',
  GENERATE_NFT: '/api/neutrochain/generate-nft',
  DECRYPT_DOWNLOAD: '/api/neutrochain/decrypt-download',
  ENCRYPT_MULTI: '/api/neutrochain/encrypt-multi'
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 25 * 1024 * 1024, // 25MB
  ACCEPTED_TYPES: [
    'image/*',
    'application/pdf',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// Animation Durations
export const ANIMATIONS = {
  FADE_IN: 0.8,
  SLIDE_UP: 0.6,
  STAGGER_DELAY: 0.2
};