# HashVault

A secure file storage and sharing platform with blockchain integration.

## Encryption Flow

```mermaid
flowchart TD
    A[User Uploads File] --> B[Generate AES-256 Key]
    B --> C[Encrypt File with AES-256]
    C --> D[Generate RSA Key Pair]
    D --> E[Encrypt AES Key with RSA Public Key]
    E --> F[Store Encrypted File]
    F --> G[Store Encrypted AES Key]
    G --> H[Hash File Metadata]
    H --> I[Store Hash on Blockchain]
    I --> J[Return File ID to User]
    
    K[User Downloads File] --> L[Retrieve Encrypted File]
    L --> M[Retrieve Encrypted AES Key]
    M --> N[Decrypt AES Key with RSA Private Key]
    N --> O[Decrypt File with AES Key]
    O --> P[Verify Hash from Blockchain]
    P --> Q[Return Decrypted File]
```

## Project Structure

```
hashvault/
├── hashvault-frontend/     # React frontend application
├── hashvault-backend/      # Node.js backend API
├── vercel.json            # Main Vercel deployment config
└── README.md              # This file
```

## Deployment

### Backend Deployment (Render)
Deploy the backend to Render:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the root directory to `hashvault-backend`
4. Render will automatically detect the `render.yaml` configuration
5. Set up environment variables in Render dashboard

## Environment Variables

**Backend (Render):**
- Backend API keys
- Database connections
- Blockchain network settings