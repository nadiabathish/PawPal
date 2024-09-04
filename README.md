
# **PawPal**

### Overview
PawPal is a full-stack web application built using React.js and Node.js, designed to help dog owners find playmates for their pets. Functioning similarly to a dating app, PawPal allows users to create dog profiles, swipe through other dog profiles, and chat with mutually interested dog owners to arrange playdates. The app prioritizes usability and security while fostering an engaging and fun user experience for dog lovers.

---

## Problem
Dog owners often find it challenging to identify suitable playmates for their pets. PawPal solves this by connecting nearby dog owners and providing them with a platform to browse, match, and interact with potential playmates.

### Primary Users:
- **Dog owners** looking for playmates for their pets.

### Special Considerations:
- **User Data Security**: Token-based authentication (JWT) and password hashing ensure user data remains secure.
- **User Experience**: The UI is intuitive and provides a familiar swiping interface, making it easy for users to navigate the app.

---

## Features
### Core Functionality:
- **User Registration & Login**: Secure registration and authentication using JWT.
- **Dog Profiles**: Users can create and update dog profiles, including details such as name, breed, age, and temperament.
- **Swiping Interface**: Swipe through profiles to find potential playmates for their dog.
- **Matchmaking**: Users are notified when they have a mutual match, allowing them to chat.
- **Chat**: Real-time chat functionality for matched users to arrange playdates.
- **Notifications**: Users receive notifications when their dog’s profile is liked.

### Future Enhancements (Nice-to-Haves):
- **Geolocation-based Match Suggestions**: Filter matches by proximity.
- **Push Notifications**: Receive real-time alerts for new messages or matches.
- **Dog Park Locator**: Integrate a map feature to find nearby parks for playdates.

---

## Technologies Used
### Frontend:
- **React.js**: Component-based UI.
- **Axios**: For API requests.
- **Sass**: Styling with SCSS.

### Backend:
- **Node.js & Express**: RESTful API and routing.
- **Knex.js**: Database query builder (MySQL).
- **JWT (JSON Web Token)**: Secure user authentication.

### Database:
- **MySQL**: Relational database for storing user and dog profile information, matches, and messages.

### Other Libraries:
- **Multer**: File uploads (profile pictures).
- **bcrypt.js**: Password hashing for secure storage.

---

## Installation & Setup

### Prerequisites:
- Node.js
- MySQL
- Git

### Steps to Run Locally:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/nadiabathish/PawPal.git
   cd pawpal
   ```

2. **Install dependencies for both client and server:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set up the database:**
   - Create a MySQL database and configure the connection in the `.env` file:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=pawpal
     JWT_SECRET=yourjwtsecret
     ```

4. **Run database migrations and seed the database:**
   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

5. **Start the client and server:**
   - **Client**:
     ```bash
     cd client
     npm run dev
     ```
   - **Server**:
     ```bash
     cd server
     npm start
     ```

---

## API Endpoints

### **Authentication** (`auth.js`)
- **POST /signup**: Register a new user and their dog profile.
- **POST /login**: Log in an existing user and return a JWT.

### **Dog Profiles** (`profiles.js`)
- **GET /profiles/profile/:userId**: Fetch a user's dog profile.
- **PUT /profiles/profile/:userId**: Update a user's dog profile.

### **Matchmaking & Swiping** (`playmates.js`)
- **GET /playmates**: Fetch potential playmates for a user.
- **PUT /playmates/like**: Like another dog profile.
- **PUT /playmates/pass**: Pass on another dog profile.

### **Notifications** (`notifications.js`)
- **GET /notifications**: Fetch pending likes where another user liked the current user’s dog profile.

### **Messaging** (`messages.js`)
- **POST /messages**: Send a message to a matched user.
- **GET /messages/:matchId**: Fetch all messages in a chat.

---

## Known Issues
- **Settings Route Unused**: The `/settings/:userId` route is currently not utilized in the client for user settings.

---

## Project Structure
- **`/client`**: React.js code for the frontend.
- **`/server`**: Node.js/Express code for the backend, including routes, controllers, and database configuration.
- **`/db`**: Knex.js migration and seed files for setting up the MySQL database.

---

## Future Enhancements
- **Geolocation-based matching**: Display nearby playmates.
- **Push notifications**: Real-time updates for matches and messages.

---

## Contributors
- **Nadia Bathish**: Full-Stack Developer. [LinkedIn](https://www.linkedin.com/in/nadia-bathish/)
