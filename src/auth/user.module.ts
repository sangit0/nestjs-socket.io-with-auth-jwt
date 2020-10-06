import { Module } from '@nestjs/common';
import { UserService } from '../auth/user.service';
import { UserSchema } from './schemas/user';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
