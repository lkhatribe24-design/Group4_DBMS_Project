const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'lost_found',
  password: process.env.PG_PASSWORD || 'Garav#31151',
  port: process.env.PG_PORT || 5432,
});

module.exports = pool;
