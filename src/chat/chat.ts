import * as mongoose from 'mongoose';

export const ChatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  from_user: { type: String, required: true },
  to_user: { type: String, required: true },
});

export interface Chat extends mongoose.Document {
  id: string;
  message: string;
  from_user: string;
  to_user: string;
}

export class ChatDto {
  message: string;
  from_user: string;
  to_user: string;
}
