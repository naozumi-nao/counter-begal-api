//require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/reports');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Mongo Database'));

app.use(express.json());



const reportsRouter = require('./routes/reports.js');
app.use('/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
