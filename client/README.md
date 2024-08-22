# Project Title
-> **PawPal**

## Overview
** What is your app? Brief description in a couple of sentences.

-> **_PawPal_** is a React-based web application designed to help dog owners find playmates for their pets. Similar in functionality to a Tinder-like dating app, PawPal allows users to create profiles for their dogs, swipe through potential playmates, and arrange playdates.

### Problem
** Who will use your app? How will they use it? Any special considerations that your app must take into account.

-> 
**Primary Users:**
- Dog owners looking for playmates for their pets.

**Usage:**
- Users will create profiles for their dogs, including information about their pet’s age, breed, and temperament.
- Users will swipe through profiles of other dogs, indicating interest in arranging a playdate.
- When two users show mutual interest, they can chat and arrange a playdate.

**Special Considerations:**
- Ensuring the safety and security of user data.
- Providing a user-friendly interface that is easy to navigate.
- Implementing measures to prevent misuse of the app.


### Features
** List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.

-> 
- User Registration/Login: Users can create an account and log in securely
- Dog Profiles: Users can create and edit profiles for their dogs, including uploading photos
- Swiping Interface: Users can swipe right to show interest in a playdate or left to pass
- Matchmaking: When two users swipe right on each other’s profiles, they become a match
- Chat: Matched users can chat within the app to arrange playdates

## Implementation
** List technologies that will be used in your app, including any libraries to save time or provide more functionality. Be sure to research any potential limitations.

->
- Frontend: React
- Backend: Node.js, Express
- Database: MySQL
- Authentication: JWT 
- Libraries: Axios

### APIs
** List any external sources of data that will be used in your app.

->
- Geolocation API: To help users find playmates nearby.


### Sitemap
** List the pages of your app with brief descriptions. You can show this visually, or write it out.

->
- Home Page: Introduction and login/signup options.
- Profile Page: Create and edit dog profiles.
- Browse Page: Swipe through profiles of potential playmates.
- Match Page: View and chat with matches.

### Mockups
** Describe your data and the relationships between them. You can show this visually using diagrams, or write it out. 

-> **Entities:**
- User: _id, username, password, email
- DogProfile: _id, ownerId (User reference), name, age, breed, temperament, photos
- Match: _id, dog1Id (DogProfile reference), dog2Id (DogProfile reference)
- Message: _id, matchId (Match reference), senderId (User reference), content, timestamp

### Endpoints
** List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

-> 
**User:**
- POST /register: Create a new user
- POST /login: Authenticate a user

**DogProfile:**
- POST /dog-profiles: Create a new dog profile
- GET /dog-profiles: Get all dog profiles
- GET /dog-profiles/:id: Get a specific dog profile
- PUT /dog-profiles/:id: Update a dog profile
- DELETE /dog-profiles/:id: Delete a dog profile

**Match:**
- POST /matches: Create a new match
- GET /matches: Get all matches for a user
- GET /matches/:id: Get a specific match

**Message:**
- POST /messages: Send a new message
- GET /messages/:matchId: Get all messages for a match


### Auth
** Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation. Think about what you can reasonably complete before the due date. The more detail you provide, the easier it will be to build.

->
**Sprint 1 (August 6-10):**
- Set up project structure and environment
- Implement user registration and authentication
- Create the dog profile creation and editing feature

**Sprint 2 (August 11-15):**
- Develop the swiping interface and matchmaking logic
- Implement chat functionality for matched users

**Sprint 3 (August 16-18):**
- Finalize the UI/UX design
- Conduct testing and debugging
- Deploy the app to Heroku

**Sprint 4 (August19):**
- Perform user acceptance testing
- Prepare for final presentation and submission

## Nice-to-haves
Your project will be marked based on what you committed to in the above document. Under nice-to-haves, you can list any additional features you may complete if you have extra time, or after finishing.

->
**Nice-to-haves**
- Geolocation-based match suggestions: To show nearby playmates
- In-app photo sharing: Allow users to share photos within the chat
- Dog parks locator: Integrate a feature to find nearby dog parks for playdates
- Push notifications: For real-time updates and reminders

