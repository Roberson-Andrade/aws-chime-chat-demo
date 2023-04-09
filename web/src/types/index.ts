/* eslint-disable no-shadow */
import {
  ChannelMessage,
  ChannelMessageSummary,
} from '@aws-sdk/client-chime-sdk-messaging';

export interface ChatMessage {
  content: string;
}

export interface Channel {
  name: string;
  channelArn: string;
  lastMessageDate?: Date;
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

export interface AllMessagesPayload {
  token?: string;
  messages: ChannelMessageSummary[];
}

export type Mode = 'signUp' | 'signIn' | 'confirmAccount';

export enum MessageAction {
  ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE',
  ADD_ALL_MESSAGES = 'ADD_ALL_MESSAGES',
  SET_MESSAGES_FROM_SELECTED_CHANNEL = 'SET_MESSAGES_FROM_SELECTED_CHANNEL',
  RESET_MESSAGES = 'RESET_MESSAGES',
}

export interface MessageState {
  messages: ChannelMessage[];
  allMessages?: Map<string, AllMessagesPayload>;
  token?: string;
}
