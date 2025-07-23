// db.js
const { Pool } = require('pg'); // Use CommonJS require

// Database Configuration using environment variables
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Add an error listener to the pool to catch connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1); // Exit the process if a database error occurs
});

// Export the query function and the pool instance using CommonJS module.exports
module.exports = {
    query: (text, params) => {
        console.log('EXECUTING QUERY:', text, params || '');
        return pool.query(text, params);
    },
    pool: pool // IMPORTANT: Export the pool instance directly
};
