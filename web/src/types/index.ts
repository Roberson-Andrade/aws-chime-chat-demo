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
  name: string;
}
