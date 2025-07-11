import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserAuthDTO, UserResponseDTO } from '../entities/User';
import { UserRepository } from '../interfaces/repositories/UserRepository';
import { JWT_SECRET, TOKEN_EXPIRATION } from '../../infrastructure/config/jwt';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async validateUser(credentials: UserAuthDTO): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponseDTO;
  }

  generateToken(userId: string): string {
    const payload = { userId };
    
    // Use the shared JWT configuration with proper typing
    // Cast TOKEN_EXPIRATION to a type that works with jwt.sign
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION as jwt.SignOptions['expiresIn']
    });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
}
