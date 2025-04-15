# Task Manager API

Task Manager API is a RESTful API built with **Node.js**, **Express**, and **MongoDB** that allows users to register, authenticate, create tasks, and manage them.

## Features
- User registration and authentication (JWT-based authentication)
- Task management (CRUD operations)
- Secure password storage with bcrypt
- User profile management with avatar upload (Multer & Sharp)
- Email notifications on account creation and deletion

## Technologies Used
- **Node.js** (Express.js)
- **MongoDB** (Mongoose ODM)
- **JWT** (JSON Web Token Authentication)
- **Multer & Sharp** (For image processing)
- **Bcrypt.js** (Password hashing)

## Installation

### Prerequisites
- Install **Node.js** and **MongoDB** on your system.
- Create a `.env` file and add the required environment variables.

### Clone the Repository
```sh
git clone https://github.com/yourusername/task-manager-api.git
cd task-manager-api
```

### Install Dependencies
```sh
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory and add:
```sh
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_email@example.com
```

### Start the Server
```sh
npm run dev
```

The API will be running at `http://localhost:3000`

## API Endpoints

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/users` | Register a new user |
| POST   | `/users/login` | Login user |
| POST   | `/users/logout` | Logout from current session |
| POST   | `/users/logoutAll` | Logout from all sessions |
| GET    | `/users/me` | Get authenticated user profile |
| PATCH  | `/users/me` | Update user profile |
| DELETE | `/users/me` | Delete user account |

### Task Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/tasks` | Create a new task |
| GET    | `/tasks` | Get all user tasks (supports filtering, sorting, pagination) |
| GET    | `/tasks/:id` | Get a specific task by ID |
| PATCH  | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### User Avatar Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/users/me/avatar` | Upload user avatar |
| DELETE | `/users/me/avatar` | Delete user avatar |
| GET    | `/users/:id/avatar` | Fetch a user's avatar |

## Running Tests
To run tests, use:
```sh
npm test
```

### Step 2: Install dependencies

bash

CopyEdit

`npm install`

### Step 3: Start the app

To start the application in development mode (with hot-reloading):

bash

CopyEdit

`npm run dev`

Alternatively, to run the application in production mode:

bash

CopyEdit

`npm start`

The app will be running on `http://localhost:3000`.

Usage
-----

-   Open `http://localhost:3000` in your browser.

-   Enter your username and the room you want to join.

-   Start chatting, share locations, and see updates as other users join or leave the room.

Project Structure
-----------------

plaintext

CopyEdit

`chat-app/
│
├── public/                   # Static files (HTML, CSS, JS)
│   ├── index.html            # Main HTML file
│   ├── chat.js               # Client-side JavaScript (handles chat functionality)
│   ├── style.css             # Styles for the app
│   └── templates/            # Mustache templates
│
├── src/                      # Server-side code
│   ├── index.js              # Main entry point of the server
│   ├── utils/                # Utility functions
│   │   ├── messages.js       # Functions to generate messages
│   │   └── users.js          # Functions to manage users in chat rooms
│   └── package.json          # Project dependencies and scripts
│
└── README.md                 # Project documentation (this file)`

Contributing
------------

If you'd like to contribute to this project, feel free to fork the repository and submit pull requests. Here are a few ways you can help:

-   Fix bugs or enhance existing features.

-   Add new features like file sharing, group chats, or user authentication.

-   Improve documentation.

