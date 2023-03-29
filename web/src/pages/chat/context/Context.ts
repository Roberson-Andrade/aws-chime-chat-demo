import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { Dispatch, SetStateAction } from 'react';
import { createContext } from 'use-context-selector';
import { Channel } from '../../../types';

export interface ChatContextProperties {
  messages: ChannelMessage[];
  channels: Channel[];
  loggedUserArn: string;
  setMessages: Dispatch<SetStateAction<ChannelMessage[]>>;
  setChannels: Dispatch<SetStateAction<Channel[]>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  token?: string;
}

export const ChatContext = createContext<ChatContextProperties | undefined>(
  undefined
);
