import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { AuthCredentialsDto } from './auth-credentials.dto';
import { User } from './user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    const { username, password } = authCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({ username, password: hashedPassword });

    try {
      let userNew = await user.save();
      return {
        user: user,
        accessToken: await (await this.signIn(userNew)).accessToken,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async signIn(user: User) {
    const payload = { username: user.username, sub: user._id };
    return {
      user: user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async userExists(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username } = authCredentialsDto;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      return null;
    }
    return user;
  }
  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(pass, user.password);

    if (valid) {
      return user;
    }

    return null;
  }
}
