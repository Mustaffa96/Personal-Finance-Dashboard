import { Hono } from 'hono';
import { User } from '../models/User.js';
import { auth } from './auth.js';

const userRoutes = new Hono();

// Apply auth middleware to all routes
userRoutes.use('*', auth);

// Get user profile
userRoutes.get('/profile', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get user profile' 
    }, 500);
  }
});

// Update user profile
userRoutes.put('/profile', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { name, email } = await c.req.json();
    
    // Check if email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return c.json({ success: false, message: 'Email already in use' }, 400);
      }
    }
    
    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to update profile' 
    }, 500);
  }
});

// Change password
userRoutes.put('/change-password', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { currentPassword, newPassword } = await c.req.json();
    
    // Find user with password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return c.json({ success: false, message: 'Current password is incorrect' }, 401);
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    return c.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to change password' 
    }, 500);
  }
});

// Delete user account
userRoutes.delete('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    
    // Delete user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    
    // Note: In a real application, you might want to:
    // 1. Delete all user data (transactions, budgets, etc.)
    // 2. Implement a soft delete instead of hard delete
    // 3. Add additional security checks
    
    return c.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to delete account' 
    }, 500);
  }
});

export { userRoutes };
