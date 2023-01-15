/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("wallet", table => {
    table.increments('id').primary();
    table.bigInteger('balance').notNullable();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('user.id');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.table('wallet', table => {
      table.dropForeign('user_id', "wallet_user_id_foreign");
    })
    .then(() => knex.schema.dropTable('wallet'));
};
