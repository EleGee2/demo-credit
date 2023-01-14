/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("transaction", table => {
    table.uuid('id', { primaryKey: true});
    table.string('type', 255).notNullable();
    table.uuid('from').notNullable();
    table.uuid('to').notNullable();
    table.bigInteger('amount').notNullable();
    table.string('status', 255).notNullable();
    table.string('reference', 255).notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("transaction")
};
