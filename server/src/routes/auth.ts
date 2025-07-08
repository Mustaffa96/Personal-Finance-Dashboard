import { Hono } from 'hono';
import { User } from '../models/User.js';
import { jwt } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

const authRoutes = new Hono();

// Middleware for protected routes
export const auth = jwt({
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

// Register a new user
authRoutes.post('/register', async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ success: false, message: 'Email already in use' }, 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    return c.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }, 201);
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    }, 500);
  }
});

// Login user
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return c.json({ success: false, message: 'Invalid credentials' }, 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return c.json({ success: false, message: 'Invalid credentials' }, 401);
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Login failed' 
    }, 500);
  }
});

// Get current user
authRoutes.get('/me', auth, async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const user = await User.findById(userId);

    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get user' 
    }, 500);
  }
});

export { authRoutes };
