import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigModule } from './config/database/config.module';
import { DatabaseConfigService } from './config/database/config.service';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: async (config: DatabaseConfigService) => ({
        uri: config.dbURL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [DatabaseConfigService],
    }),
    ChatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
