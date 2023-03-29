import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { ReactNode, useMemo, useState } from 'react';
import { generateMessages } from '../../../api/mockedChime';
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

export function ChatProvider({ children }: ChatProviderProperties) {
  const [messages, setMessages] = useState<ChannelMessage[]>(() =>
    generateMessages(10)
  );
  const [channels, setChannels] = useState<Channel[]>(MOCKED_CHANNELS);
  const [loggedUserArn, setLoggedUserArn] = useState('arn1');
  generateMessages(10);
  const [token, setToken] = useState<string | undefined>('aa');

  const value = useMemo<ChatContextProperties>(
    () => ({
      messages,
      channels,
      loggedUserArn,
      setMessages,
      setChannels,
      token,
      setToken,
    }),
    [
      messages,
      channels,
      loggedUserArn,
      setMessages,
      setChannels,
      token,
      setToken,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
