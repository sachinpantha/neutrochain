const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    /\.vercel\.app$/,
    /\.vercel\.com$/
  ],
  credentials: true
}));
app.use(express.json());

const neutroChainRouter = require('./src/neutrochain');
app.use('/api/neutrochain', neutroChainRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});