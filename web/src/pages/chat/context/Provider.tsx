import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { ReactNode, useMemo, useState } from 'react';
import { Channel } from '../../../types';
import { ChatContext, ChatContextProperties } from './Context';

interface ChatProviderProperties {
  children: ReactNode;
}

const MOCKED_CHANNELS: Channel[] = [
  { channelId: '2131', name: 'John Doe', lastMessageDate: new Date() },
  { channelId: '2313', name: 'Joe Biden', lastMessageDate: new Date() },
  { channelId: '4214', name: 'Mary Jane', lastMessageDate: new Date() },
];

const MOCKED_MESSAGES: ChannelMessage[] = [
  { Content: 'aaaaaaaaaa', MessageId: '1231' },
];

export function ChatProvider({ children }: ChatProviderProperties) {
  const [messages] = useState<ChannelMessage[]>(MOCKED_MESSAGES);
  const [channels] = useState<Channel[]>(MOCKED_CHANNELS);

  const value = useMemo<ChatContextProperties>(
    () => ({
      messages,
      channels,
    }),
    []
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
