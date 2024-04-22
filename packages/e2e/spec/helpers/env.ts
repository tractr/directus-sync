import path from 'path';

// Define required environment variables
process.env = {
  ...process.env,
  DB_FILENAME:path.resolve('directus', 'db', `test.db`),
};

