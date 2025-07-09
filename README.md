# Personal Finance Dashboard

A web-based personal finance tracker that allows users to manage their income, expenses, and savings goals with a clean, interactive interface.

## Project Overview

This project is built using a modern full-stack architecture with:
- **Client**: Next.js 14.2.30, TypeScript, TailwindCSS, App Router
- **Server**: Node.js/Express, MongoDB

## Features

- **Dashboard**: Visualize income, expenses, and savings with interactive charts
- **Transaction Management**: Add, edit, or delete income/expense entries with categories
- **Budget Goals**: Set and track monthly savings or spending goals
- **Authentication**: Secure user login with JWT and bcrypt password hashing
- **Data Persistence**: Store user data using MongoDB
- **Responsive Design**: Optimized for mobile and desktop using TailwindCSS
- **User Management**: Register, login, and manage user profiles

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Mustaffa96/Personal-Finance-Dashboard.git
   cd Personal-Finance-Dashboard
   ```

2. Install dependencies for both client and server
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables
   ```bash
   # For server
   cp server/.env.example server/.env
   # For client
   cp client/.env.example client/.env
   ```
   
   Update the `.env` files with your configuration.

4. Seed the database (optional)
   ```bash
   # From the server directory
   npm run seed
   ```

5. Start development servers
   ```bash
   # Start the client (from client directory)
   npm run dev
   # The client will run on http://localhost:3001
   
   # Start the server (from server directory)
   npm run dev
   # The server will run on http://localhost:5000
   ```

## Project Structure

```
Personal-Finance-Dashboard/
├── client/                      # Next.js 14.2.30 frontend
│   ├── src/
│   │   ├── app/                 # App router pages and components
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Shared utilities
│   │   ├── services/            # API services
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets
│   └── tailwind.config.ts       # TailwindCSS configuration
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/              # Server configuration
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic services
│   │   └── utils/               # Utility functions
│   ├── .env                     # Environment variables
│   └── .env.example             # Environment variables template
└── package.json                 # Root package.json
```

## Technologies Used

### Frontend
- **Next.js 14.2.30**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **React Hook Form**: Form handling and validation
- **Chart.js**: Data visualization
- **SWR/React Query**: Data fetching and caching
- **Axios**: HTTP client

### Backend
- **Express**: Web framework for Node.js
- **Node.js**: JavaScript runtime
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **bcrypt**: Password hashing
- **JWT**: JSON Web Tokens for authentication
- **dotenv**: Environment variable management

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- [Mustaffa96](https://github.com/Mustaffa96)
