import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../auth/user.service';

import { ChatDto } from './chat';
import { ChatProvider } from './chat.provider';

@Controller('chats')
export class ChatsController {
  constructor(
    @Inject('ChatProvider') private provider: ChatProvider,
    private userService: UserService,
  ) {}

  @Post()
  async newMessage(@Body() chat: ChatDto) {
    const generatedId = await this.provider.insert(
      chat.message,
      chat.from_user,
      chat.to_user,
    );
    return { id: generatedId };
  }

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  getFriends(@Request() req) {
    let user = req.user;
    return this.userService.allFriends(user._id);
  }

  @Get('sent-request/:username')
  @UseGuards(JwtAuthGuard)
  sentRequest(@Param('username') username: string, @Request() req) {
    let user = req.user;
    return this.userService.sentRequest(user._id, username);
  }

  @Get('approve-request/:id/:ofUser')
  @UseGuards(JwtAuthGuard)
  approveRequest(
    @Param('id') id: string,
    @Param('ofUser') ofUser: string,
    @Request() req,
  ) {
    let user = req.user;
    return this.userService.approveRequest(id, user._id, ofUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getChatByUser(@Param('id') toUser: string, @Request() req) {
    let user = req.user;
    return this.provider.getEntityByUser(user._id, toUser);
  }
}
