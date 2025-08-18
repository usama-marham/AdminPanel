import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { type: true },
    });

    // Check if user exists and is an agent
    if (!user || user.type.typeName !== 'agent') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = dto.password === user.passwordHash;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      type: user.type.typeName,
    };

    const token = await this.jwtService.signAsync(payload);

    // Update last seen
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() },
    });

    return {
      access_token: token,
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        type: user.type.typeName,
      },
    };
  }

  async logout(userId: string) {
    // Convert string back to BigInt for Prisma
    const id = BigInt(userId);
    
    // Update last seen
    await this.prisma.user.update({
      where: { id },
      data: { lastSeenAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }
}
