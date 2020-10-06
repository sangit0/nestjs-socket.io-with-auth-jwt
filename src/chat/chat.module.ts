import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../auth/user.module';

import { ChatsController } from './chat.controller';
import { ChatsService } from './chat.service';
// import { User } from '../auth/user.interface';

import { ChatSchema } from './chat';
const IServiceProvider: Provider = {
  provide: 'ChatProvider', //an injectable interface
  useClass: ChatsService,
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    UserModule,
  ],
  controllers: [ChatsController],
  providers: [IServiceProvider],
  exports: [],
})
export class ChatModule {}
