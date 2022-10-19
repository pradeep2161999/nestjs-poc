import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    const password = await argon.hash(
      dto.password,
    );
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
        },
        // select: {
        //   id: true,
        // },
      });
      if (!user)
        throw new ForbiddenException(
          'crediatials incorrect',
        );
      const pwMatches = await argon.verify(
        user.password,
        dto.password,
      );
      if (!pwMatches)
        throw new ForbiddenException(
          'credentials incorrect',
        );

      // delete user.password;
      // return user;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'p2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    return { msg: 'I have signed in' };
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );
    // const secret = this.config.get('JWT_SECRET');
    return {
      access_token: token,
    };
    // return this.jwt.signAsync(payload, {
    //   expiresIn: '15m',
    //   secret: 'secret',
    // });
  }
}
