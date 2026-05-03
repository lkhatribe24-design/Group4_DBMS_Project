const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'Garav#31151',
  host: 'localhost',
  port: 5432,
  database: 'lost_found',
});

const sqlFiles = [
  '01_schema.sql',
  '02_constraints.sql',
  '03_functions.sql',
  '04_triggers.sql',
  '05_sample_data.sql'
];

async function setupDatabase() {
  console.log('Starting Database Initialization...');
  try {
    for (const file of sqlFiles) {
      console.log(`Executing ${file}...`);
      const filePath = path.join(__dirname, '../../sql', file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
      console.log(`✅ ${file} executed successfully.`);
    }
    console.log('🎉 Database fully initialized with tables and sample data!');
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message);
  } finally {
    pool.end();
  }
}

setupDatabase();
