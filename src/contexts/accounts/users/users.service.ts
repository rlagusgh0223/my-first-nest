import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/db/prisma/prisma.service';
import isEmail from 'validator/lib/isEmail';
import { UsersSignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(dto: UsersSignUpDto) {
    const { email, password } = dto;
    if (!email.trim()) throw new Error('No email');
    if (!isEmail(email)) throw new Error('Invalid email');
    if (!password.trim()) throw new Error('No email');
    if (password.length < 4) throw new Error('Too short password');

    const encryptedPassword = await hash(password, 12);
    const user = await this.prismaService.user.create({
      data: {
        email,
        encryptedPassword,
        profile: {
          create: {},
        },
        cart: {
          create: {},
        },
      },
    });
    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async logIn() {
    return { accessToken: 'balb' };
  }

  generateAccessToken(user: Pick<User, 'id' | 'email'>) {
    const JWT_SECRETE_KEY = process.env.JWT_SECRET_KEY;
    const accessToken = sign({ email: user.email }, JWT_SECRETE_KEY, {
      subject: String(user.id),
      expiresIn: '5m',
    });
    return accessToken;
  }
}
