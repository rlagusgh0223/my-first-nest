import { Body, Controller, Post } from '@nestjs/common';
import { UsersSignUpDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('accounts/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UsersSignUpDto) {
    const { email, password } = dto;
    const result = await this.usersService.signUp(dto);
    return result;
  }

  @Post('log-in')
  async logIn() {
    const result = await this.usersService.logIn();
    return result;
  }
}
