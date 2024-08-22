import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const usersData = [];

const predefinedPassword = 'password123';  // Set a predefined password for testing
const hashedPassword = await bcrypt.hash(predefinedPassword, 10); 

// Generate 10 users
for (let i = 0; i < 10; i++) {
  usersData.push({
    email: faker.internet.email(),
    password: hashedPassword, 
    owner_name: faker.person.firstName() + ' ' + faker.person.lastName(),
    created_at: faker.date.recent(),
  });
}

export default usersData;
