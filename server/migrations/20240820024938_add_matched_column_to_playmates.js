/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.table('playmates', (table) => {
    table.boolean('matched').defaultTo(false);  // Adding 'matched' column to 'playmates' table
  });
}
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.table('playmates', (table) => {
    table.dropColumn('matched');  // Rolling back the 'matched' column if necessary
  });
}
  
