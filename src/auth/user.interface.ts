import { Document } from 'mongoose';

interface Friends {
  readonly id: string;
  readonly approved: boolean;
  readonly need_approval: boolean;
}
export interface User extends Document {
  readonly username: string;
  readonly password: string;
  readonly friends: Friends[];
}
