import {
  ChannelMessage,
  ChannelSummary,
} from '@aws-sdk/client-chime-sdk-messaging';
import { Dispatch, SetStateAction } from 'react';
import { createContext } from 'use-context-selector';
import { Channel, ChatUser } from '../../../types';

export interface ChatContextProperties {
  messages: ChannelMessage[];
  channels: ChannelSummary[];
  loggedUserArn?: string;
  setMessages: Dispatch<SetStateAction<ChannelMessage[]>>;
  setChannels: Dispatch<SetStateAction<ChannelSummary[]>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  token?: string;
  users?: ChatUser[];
  selectedChannel?: Channel;
  setSelectedChannel: Dispatch<SetStateAction<Channel | undefined>>;
}

export const ChatContext = createContext<ChatContextProperties | undefined>(
  undefined
);
