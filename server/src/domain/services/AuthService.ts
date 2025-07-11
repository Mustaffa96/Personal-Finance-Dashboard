import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserAuthDTO, UserResponseDTO } from '../entities/User';
import { UserRepository } from '../interfaces/repositories/UserRepository';

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;
  private tokenExpiration: string;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.tokenExpiration = process.env.TOKEN_EXPIRATION || '1d';
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
    // Using a more direct approach without type assertions
    return jwt.sign(
      { userId },
      this.jwtSecret,
      { expiresIn: '1d' } // Hardcode a valid value for now
    );
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
