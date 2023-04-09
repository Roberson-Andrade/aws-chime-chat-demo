import {
  ChannelMessage,
  ChimeSDKMessagingClient,
} from '@aws-sdk/client-chime-sdk-messaging';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { createContext } from 'use-context-selector';
import { AllMessagesPayload, Channel, ChatUser } from '../../../types';
import { Action } from '../reducers/messages/reducer';

export interface ChatContextProperties {
  token?: string;
  users?: ChatUser[];
  client?: ChimeSDKMessagingClient;
  channels: Channel[];
  messages: ChannelMessage[];
  selectedChannel?: Channel;
  allMessages?: Map<string, AllMessagesPayload>;
  loggedUserArn?: string;
  isChannelsLoading: boolean;
  virtuosoReference: RefObject<VirtuosoHandle>;
  dispatch: Dispatch<Action>;
  setChannels: Dispatch<SetStateAction<Channel[]>>;
  setSelectedChannel: Dispatch<SetStateAction<Channel | undefined>>;
}

export const ChatContext = createContext<ChatContextProperties | undefined>(
  undefined
);
