
exports.up = function(knex, Promise) {
  return knex.schema.createTable('guilds', function(t) {
    t.increments('id').unsigned().primary();
    t.string('guildid').notNull();
    t.string('guildname').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('guilds');
};
