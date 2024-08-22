/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.string("owner_name").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    .createTable("dog_profiles", (table) => {
      table.increments("id").primary();
      table.string("dog_name").notNullable();
      table.integer("dog_age").notNullable();
      table.string("dog_breed").notNullable();
      table.json("play_styles");
      table.string("profile_picture_url"); 
      table
        .integer("owner_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    .createTable("playmates", (table) => {
      table.increments("id").primary();
      table
        .integer("dog_id")
        .unsigned()
        .references("id")
        .inTable("dog_profiles")
        .onDelete("CASCADE"); 
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.enu("status", ["liked", "passed"]); 
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })

    .createTable("messages", (table) => {
      table.increments("id").primary();
      table
        .integer("sender_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("recipient_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.text("message").notNullable(); 
      table.timestamp("sent_at").defaultTo(knex.fn.now()); 
    })

    .createTable("settings", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.json("preferences");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTable("settings")
    .dropTable("messages")
    .dropTable("playmates")
    .dropTable("dog_profiles")
    .dropTable("users");
}