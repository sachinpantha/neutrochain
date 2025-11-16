const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const neutroChainRouter = require('./neutrochain');
app.use('/api/neutrochain', neutroChainRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});