# HashVault

A secure file storage and sharing platform with blockchain integration.

## Project Structure

```
hashvault/
├── hashvault-frontend/     # React frontend application
├── hashvault-backend/      # Node.js backend API
├── vercel.json            # Main Vercel deployment config
└── README.md              # This file
```

## Deployment

### Option 1: Monorepo Deployment (Recommended)
Deploy both frontend and backend together from the root directory:
```bash
vercel --prod
```

### Option 2: Separate Deployments
Deploy frontend and backend separately:

**Frontend:**
```bash
cd hashvault-frontend
vercel --prod
```

**Backend:**
```bash
cd hashvault-backend
vercel --prod
```

## Environment Variables

Make sure to set up environment variables in Vercel dashboard for:
- Backend API keys
- Database connections
- Blockchain network settings