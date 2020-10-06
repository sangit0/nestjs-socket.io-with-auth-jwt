import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  friends: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      approved: Boolean,
      need_approval: Boolean,
    },
  ],
});
