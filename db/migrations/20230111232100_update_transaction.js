/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("transaction", table => {
      table.string("from").nullable().alter();
      table.string("to").nullable().alter();
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("transaction", table => {
      table.string("from").notNullable().alter();
      table.string("to").notNullable().alter();
  })
};
