import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-finance');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: unknown) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Sample user data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
  },
];

// Seed data function
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Deleted all existing users');

    // Create new users with hashed passwords
    // Note: We're not using the pre-save hook because we're using insertMany
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users seeded successfully:');
    console.log(createdUsers.map(user => ({ name: user.name, email: user.email })));

    return createdUsers;
  } catch (error: unknown) {
    console.error(`Error seeding users: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Main function to run the seeder
const runSeeder = async () => {
  try {
    const conn = await connectDB();
    await seedUsers();
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error: unknown) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();
