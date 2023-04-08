export interface ChatMessage {
  content: string;
}

export interface Channel {
  name: string;
  channelId: string;
  lastMessage: string;
  lastMessageDate: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ChatUser {
  id: string;
  name: string;
}

export type Mode = 'signUp' | 'signIn' | 'confirmAccount';
