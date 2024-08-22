import usersData from '../seed-data/users.js';
import dogProfilesData from '../seed-data/dog_profiles.js';

export async function seed(knex) {
  await knex('dog_profiles').del();
  await knex('users').del();

  await knex('users').insert(usersData);

  const insertedUsers = await knex('users').select('id');
  const updatedDogProfilesData = dogProfilesData.map((profile, index) => ({
    ...profile,
    owner_id: insertedUsers[index].id,
  }));

  await knex('dog_profiles').insert(updatedDogProfilesData);
}
