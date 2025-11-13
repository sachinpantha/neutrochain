# Multi-Recipient Encryption Test

## Features Implemented

✅ **Backend Changes:**
- Added `encryptForMultipleRecipients()` function using hybrid encryption
- Added `decryptMultiRecipient()` function for decryption
- Updated inbox service to handle multiple recipients
- Modified API endpoints to support recipient arrays
- Added new `/encrypt-multi` endpoint for direct multi-recipient encryption

✅ **Frontend Changes:**
- Added toggle between single/multiple recipients in upload form
- Dynamic recipient input fields (up to 10 recipients)
- Visual indicators for multi-recipient files in inbox
- Updated form validation and submission logic

## How It Works

1. **Hybrid Encryption**: File is encrypted with a master AES key
2. **Per-Recipient Keys**: Master key is encrypted separately for each recipient using their wallet address
3. **Shared Storage**: Single encrypted file with multiple encrypted keys
4. **Decryption**: Each recipient can decrypt using their wallet address to get the master key, then decrypt the file

## Security Features

- Each recipient can only decrypt with their own wallet address
- File content is encrypted once with strong AES-256-GCM
- Master key is encrypted per-recipient with PBKDF2 key derivation
- No recipient can see other recipients' keys
- Maximum 10 recipients per file for performance

## Usage

1. **Upload**: Select "Multiple Recipients" toggle
2. **Add Recipients**: Click "Add Recipient" to add wallet addresses
3. **Send**: File appears in all recipients' inboxes
4. **Decrypt**: Each recipient can decrypt independently

## Test Scenarios

- [ ] Single recipient (backward compatibility)
- [ ] Multiple recipients (2-10 addresses)
- [ ] Invalid wallet addresses
- [ ] Duplicate recipients
- [ ] Large files with multiple recipients
- [ ] NFT generation for multi-recipient files
- [ ] Decryption by each recipient