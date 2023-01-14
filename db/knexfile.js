const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      database: "test_db",
      user:     "postgres",
      password: "admin"
    },
    migrations: {
      directory: './migrations'
    }
  }
};
