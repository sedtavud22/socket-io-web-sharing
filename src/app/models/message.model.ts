import { User } from './user.model';

export interface Message {
  id: string;
  user: User;
  text?: string;
  room: string;
  type: MessageType;
}

export enum MessageType {
  Text,
  Join,
  Leave,
}
