import { Chat } from './chat';

/* for interface class version*/

export interface ChatProvider {
  getEntities(): Promise<Chat[]>;
  insert(message: string, from_user: string, to_user: string): Promise<String>;
  getEntityByUser(id: string, to_user: string): Promise<Chat[]>;
  deleteEntity(id: string): Promise<String>;
}
