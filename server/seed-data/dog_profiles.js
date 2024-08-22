import { faker } from '@faker-js/faker';

const dogProfilesData = [];

// Generate 10 dog profiles associated with the 10 users
for (let i = 0; i < 10; i++) {
  dogProfilesData.push({
    dog_name: faker.person.firstName(),
    dog_age: faker.number.int({ min: 1, max: 10 }),
    dog_breed: faker.animal.dog(),
    play_styles: JSON.stringify([
      faker.helpers.arrayElement([
        'Fetch',
        'Tug-of-War',
        'Chase',
        'Wrestling',
        'Swimming',
        'Running',
        'Quiet Play',
      ]),
    ]),
    profile_picture_url: faker.image.animals(400, 400, true), 
    owner_id: i + 1, 
    created_at: faker.date.recent(),
  });
}

export default dogProfilesData;
