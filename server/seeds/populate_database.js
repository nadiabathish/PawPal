/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import users from '../seed-data/user_profiles.json' assert { type: 'json' };
import dogProfiles from '../seed-data/dog_profiles.json' assert { type: 'json' };
import matches from '../seed-data/matches.json' assert { type: 'json' };
import messages from '../seed-data/messages.json' assert { type: 'json' };

export async function seed(knex) {
  // Deletes ALL existing entries in reverse order to maintain foreign key constraints
  await knex('messages').del();
  await knex('chats').del();
  await knex('matches').del();
  await knex('dog_profiles').del();
  await knex('users').del();

  // Insert new data
  await knex('users').insert(users);
  // Insert dog profiles with play_styles and profile_pictures as JSON strings
  await knex('dog_profiles').insert(dogProfiles.map(profile => ({
    ...profile,
    play_styles: JSON.stringify(profile.play_styles),  // Convert to JSON string
    profile_pictures: JSON.stringify(profile.profile_pictures)  // Convert to JSON string
  })));
  await knex('matches').insert(matches);

  // Insert data into the chats table based on matches
  const chats = matches.map(match => ({
    match_id: match.id,
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  }));
  await knex('chats').insert(chats);

  // Insert messages
  await knex('messages').insert(messages.map(message => ({
    chat_id: message.chat_id,  // Assuming chat_id exists
    sender_id: message.sender_id,
    recipient_id: message.recipient_id,
    message: message.message,
    sent_at: message.sent_at
  })));
}

