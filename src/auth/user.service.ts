import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async sentRequest(from_user: string, to_user: string): Promise<String> {
    let item = await this.userModel.findById(from_user).exec();
    let toUser = await this.userModel.findOne({ username: to_user }).exec();

    if (!toUser) {
      throw new NotFoundException('User not Found');
    }

    if (item._id === toUser._id) {
      return;
    }
    item.friends.push({
      id: toUser._id,
      approved: false,
      need_approval: false,
    });

    toUser.friends.push({
      id: item._id,
      approved: false,
      need_approval: true,
    });
    item.save();
    toUser.save();
    return 'Friend Request Sent!';
  }
  async approveRequest(
    reqId: string,
    user: string,
    ofUser: string,
  ): Promise<String> {
    await this.userModel.findOneAndUpdate(
      {
        _id: user,
        'friends._id': reqId,
      },
      {
        $set: {
          'friends.$.approved': true,
        },
      },
      { new: true },
    );

    await this.userModel.findOneAndUpdate(
      {
        _id: ofUser,
        'friends.id': user,
      },
      {
        $set: {
          'friends.$.approved': true,
        },
      },
      { new: true },
    );

    return 'Approve Friend Request!';
  }

  async allFriends(ofUser: string): Promise<any> {
    let item = await this.userModel
      .findOne({ _id: ofUser })
      .populate({ path: 'friends.id' })
      .exec();

    return item.friends;
  }
}
