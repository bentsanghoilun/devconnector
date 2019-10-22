const express = require('express');
const connectDB = require('./config/db');

//Connect DB
connectDB();

const app = express();
app.get('/', (req, res) => res.send('API running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));