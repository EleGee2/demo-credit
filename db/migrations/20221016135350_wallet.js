/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("wallet", table => {
    table.uuid('id', { primaryKey: true}).defaultTo(knex.raw('uuid_generate_v4()'));
    table.bigInteger('balance').notNullable();
    table.uuid('user_id').references('id').inTable('user')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("wallet")
};
