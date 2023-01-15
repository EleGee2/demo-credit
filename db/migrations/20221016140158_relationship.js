/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("user", (table) => {
    // table.integer("wallet_id").references("id").inTable("wallet").alter();
    table.foreign('wallet_id').references('wallet.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("user", (table) => {
    table.dropForeign('wallet_id');
  });
};
