/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    // Create users table
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    // Create dog_profiles table with dog_age included
    .createTable("dog_profiles", (table) => {
      table.increments("id").primary();
      table.string("dog_name").notNullable();
      table.integer("dog_age").notNullable(); // Dog age included
      table.string("dog_breed").notNullable();
      table.json("play_styles").nullable(); // Store play styles as JSON array
      table.json("profile_pictures").nullable(); // Store an array of image URLs as JSON
      table
        .integer("owner_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Owner of the dog (reference to users table)
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    // Create matches table
    .createTable("matches", (table) => {
      table.increments("id").primary();
      table
        .integer("user1_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // First user in the match
      table
        .integer("user2_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Second user in the match
      table.enum("status", ["pending", "matched", "rejected"]).notNullable(); // Match status
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    // Create chats table (optional for tracking chats if needed)
    .createTable("chats", (table) => {
      table.increments("id").primary();
      table
        .integer("match_id")
        .unsigned()
        .references("id")
        .inTable("matches")
        .onDelete("CASCADE"); // Chat is linked to a match
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    // Create messages table
    .createTable("messages", (table) => {
      table.increments("id").primary();
      table
        .integer("chat_id")
        .unsigned()
        .references("id")
        .inTable("chats")
        .onDelete("CASCADE"); // Message belongs to a chat
      table
        .integer("sender_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Sender of the message
      table
        .integer("recipient_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Recipient of the message
      table.text("message").notNullable(); // Message content
      table.timestamp("sent_at").defaultTo(knex.fn.now()); // Time sent
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTable("messages")
    .dropTable("chats")
    .dropTable("matches")
    .dropTable("dog_profiles")
    .dropTable("users");
}
