export interface ChatMessage {
  content: string;
}

export interface Channel {
  name: string;
  channelId: string;
  lastMessageDate: Date;
}
