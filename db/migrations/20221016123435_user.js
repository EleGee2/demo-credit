/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("user", table => {
    table.increments('id').primary();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('phone_number', 255).notNullable().unique();
    table.timestamps(true, true);
    table.integer('wallet_id').unsigned()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("user")
};
