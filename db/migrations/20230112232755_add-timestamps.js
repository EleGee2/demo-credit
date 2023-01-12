/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("wallet", function(table) {
      table.timestamps(true, true);
    }).alterTable("transaction", function(table) {
      table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.alterTable("wallet", function(table) {
      table.timestamps(false);
    }).alterTable("transaction", function(table) {
      table.timestamps(false);
    })
};
