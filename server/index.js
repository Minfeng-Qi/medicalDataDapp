const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const ipfsRouter = require('./routes/ipfs');

const app = express();
const port = 5001;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use('/api/ipfs', ipfsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});