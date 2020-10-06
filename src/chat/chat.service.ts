import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Chat } from './chat';
import { User } from '../auth/user.interface';

import { ChatProvider } from './chat.provider';

@Injectable()
export class ChatsService implements ChatProvider {
  constructor(@InjectModel('Chat') private readonly model: Model<Chat>) {}

  async insert(
    message: string,
    from_user: string,
    to_user: string,
  ): Promise<String> {
    const newItem = new this.model({
      message,
      from_user: from_user,
      to_user,
    });
    const result = await newItem.save();
    return result.id as string;
  }

  async getEntities(): Promise<Chat[]> {
    return await this.model.find().exec();
  }
  async getEntityByUser(id: string, to_user: string): Promise<Chat[]> {
    let chats = await this.model
      .find({
        $or: [
          { $or: [{ from_user: id, to_user: to_user }] },
          { $or: [{ from_user: to_user, to_user: id }] },
        ],
      })
      .exec();

    return chats;
  }

  async deleteEntity(id: string): Promise<String> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find.');
    }
    return id;
  }

  private async findEntity(id: string): Promise<Chat> {
    let item;
    try {
      item = await this.model.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find item.');
    }
    if (!item) {
      throw new NotFoundException('Could not find item.');
    }
    return item;
  }
}
