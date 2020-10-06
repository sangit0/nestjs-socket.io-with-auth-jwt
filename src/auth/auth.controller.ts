import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<Object> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('register-or-login')
  async registerLogin(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ) {
    let user = await this.authService.userExists(authCredentialsDto);

    if (user) {
      const { username, password } = authCredentialsDto;
      const validedUser = await this.authService.validateUser(
        username,
        password,
      );

      return this.authService.signIn(validedUser);
    } else {
      return await this.authService.signUp(authCredentialsDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
