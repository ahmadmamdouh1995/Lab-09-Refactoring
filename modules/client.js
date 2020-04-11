'use stric';

require('dotenv').config();
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) => {  throw new Error(err); }); 

module.exports = client;