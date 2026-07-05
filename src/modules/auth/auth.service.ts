import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtUser } from './types/jwt-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.issueTokens(user);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const tokens = await this.issueTokens(user);
    return { user: await this.usersService.findById(user.id), ...tokens };
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive.');
    }

    const storedTokens = await this.refreshTokensRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    const match = await this.findMatchingRefreshToken(refreshToken, storedTokens);
    if (!match) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.refreshTokensRepository.delete(match.id);
    return this.issueTokens(user);
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const storedTokens = await this.refreshTokensRepository.find({
      where: { userId: payload.sub },
    });
    const match = await this.findMatchingRefreshToken(refreshToken, storedTokens);

    if (match) {
      await this.refreshTokensRepository.delete(match.id);
    }

    return { loggedOut: true };
  }

  async validateUser(payload: JwtUser): Promise<JwtUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive.');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private async issueTokens(user: User) {
    const payload: JwtUser = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn') as never,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') as never,
    });

    await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 12),
        expiresAt: this.refreshExpiryDate(),
      }),
    );

    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(token: string): Promise<JwtUser> {
    try {
      return await this.jwtService.verifyAsync<JwtUser>(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  private async findMatchingRefreshToken(
    token: string,
    storedTokens: RefreshToken[],
  ): Promise<RefreshToken | null> {
    const now = new Date();
    for (const storedToken of storedTokens) {
      if (storedToken.expiresAt <= now) {
        await this.refreshTokensRepository.delete(storedToken.id);
        continue;
      }

      if (await bcrypt.compare(token, storedToken.tokenHash)) {
        return storedToken;
      }
    }

    return null;
  }

  private refreshExpiryDate(): Date {
    const days = 7;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}
