# NeutroChain API Documentation

## Endpoints

### 1. Encrypt & Upload File
**POST** `/api/neutrochain/encrypt-upload`

**Body (multipart/form-data):**
- `file`: File to encrypt
- `receiverAddress`: Ethereum wallet address of receiver
- `senderAddress`: Ethereum wallet address of sender
- `signature`: MetaMask signature for authentication
- `message`: Optional message (string)

**Response:**
```json
{
  "success": true,
  "ipfsHash": "QmXXXXXX...",
  "nftMetadata": { ... },
  "token": "jwt-token"
}
```

### 2. Decrypt & Download File
**POST** `/api/neutrochain/decrypt-download`

**Body (JSON):**
```json
{
  "nftData": "NFT metadata JSON",
  "receiverAddress": "0x...",
  "signature": "MetaMask signature"
}
```

**Response:**
```json
{
  "success": true,
  "filename": "file.txt",
  "mimetype": "text/plain",
  "file": "base64-encoded-file",
  "message": "optional message"
}
```

## Authentication Flow

1. **Sender Side:**
   - Connect MetaMask
   - Sign message: `"NeutroChain Upload: ${timestamp}"`
   - Upload file with signature

2. **Receiver Side:**
   - Upload NFT received from sender
   - Connect MetaMask
   - Sign message: `"NeutroChain Decrypt: ${timestamp}"`
   - Decrypt and download file

## Security Features

- Files encrypted using receiver's wallet address as key
- MetaMask signature verification
- JWT tokens for transaction tracking
- IPFS for decentralized storage
- NFTs as verifiable file carriers