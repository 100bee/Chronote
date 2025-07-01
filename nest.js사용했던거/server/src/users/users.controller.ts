// src/users/users.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body) {
    return this.usersService.create(body);
  }
}
