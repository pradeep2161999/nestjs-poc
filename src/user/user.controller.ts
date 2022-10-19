import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('test')
  getMe(@GetUser('') user) {
    return user;
  }
}
