import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { createContext } from 'use-context-selector';
import { Channel } from '../../../types';

export interface ChatContextProperties {
  messages: ChannelMessage[];
  channels: Channel[];
}

export const ChatContext = createContext<ChatContextProperties | undefined>(
  undefined
);
