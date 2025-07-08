# Personal Finance Dashboard

A web-based personal finance tracker that allows users to manage their income, expenses, and savings goals with a clean, interactive interface.

## Project Overview

This project is built using a monorepo structure with:
- **Client**: Next.js, TypeScript, TailwindCSS, NextAuth.js
- **Server**: HonoJS, Node.js, MongoDB

## Features

- **Dashboard**: Visualize income, expenses, and savings with interactive charts
- **Transaction Management**: Add, edit, or delete income/expense entries with categories
- **Budget Goals**: Set and track monthly savings or spending goals
- **Authentication**: Secure user login with NextAuth.js
- **Data Persistence**: Store user data using MongoDB
- **Responsive Design**: Optimized for mobile and desktop using TailwindCSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Mustaffa96/Personal-Finance-Dashboard.git
   cd Personal-Finance-Dashboard
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   # For server
   cp server/.env.example server/.env
   # For client
   cp client/.env.example client/.env
   ```
   
   Update the `.env` files with your configuration.

4. Start development servers
   ```bash
   # Start both client and server
   pnpm dev
   
   # Or start them separately
   pnpm --filter client dev
   pnpm --filter server dev
   ```

## Project Structure

```
Personal-Finance-Dashboard/
├── client/                 # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   └── public/             # Static assets
├── server/                 # HonoJS backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
└── package.json            # Root package.json for monorepo
```

## Technologies Used

### Frontend
- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **NextAuth.js**: Authentication for Next.js
- **Chart.js**: Data visualization

### Backend
- **HonoJS**: Lightweight, fast web framework
- **Node.js**: JavaScript runtime
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- [Mustaffa96](https://github.com/Mustaffa96)
