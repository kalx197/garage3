// Postman-tested relational DDL and core query layouts
const queries = {
  initializeTables: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'mechanic'
    );

    CREATE TABLE IF NOT EXISTS tools (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'available',
      total_qty INT NOT NULL DEFAULT 1,
      available_qty INT NOT NULL DEFAULT 1,
      location_bin VARCHAR(50) NOT NULL
    );
  `,
  createUser: 'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
  findUserByEmail: 'SELECT * FROM users WHERE email = $1',
  getAllTools: 'SELECT * FROM tools ORDER BY id DESC',
  insertTool: 'INSERT INTO tools (name, category, total_qty, available_qty, location_bin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
  updateToolStatus: 'UPDATE tools SET status = $1, available_qty = $2 WHERE id = $3 RETURNING *'
};

module.exports = queries;
