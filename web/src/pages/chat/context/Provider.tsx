import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { faker } from '@faker-js/faker';
import { ReactNode, useMemo, useState } from 'react';
import { generateMessages } from '../../../api/mockedChime';
import { Channel, User } from '../../../types';
import { ChatContext, ChatContextProperties } from './Context';

interface ChatProviderProperties {
  children: ReactNode;
}

const MOCKED_CHANNELS: Channel[] = [
  {
    channelId: faker.datatype.uuid(),
    name: faker.name.fullName(),
    lastMessageDate: new Date(),
    lastMessage: faker.lorem.lines(1),
  },
  {
    channelId: faker.datatype.uuid(),
    name: faker.name.fullName(),
    lastMessageDate: new Date(),
    lastMessage: faker.lorem.lines(1),
  },
  {
    channelId: faker.datatype.uuid(),
    name: faker.name.fullName(),
    lastMessageDate: new Date(),
    lastMessage: faker.lorem.lines(1),
  },
];

const MOCKED_USERS: User[] = [
  { id: faker.datatype.uuid(), name: faker.name.fullName() },
  { id: faker.datatype.uuid(), name: faker.name.fullName() },
  { id: faker.datatype.uuid(), name: faker.name.fullName() },
];

export function ChatProvider({ children }: ChatProviderProperties) {
  const [messages, setMessages] = useState<ChannelMessage[]>(() =>
    generateMessages(10)
  );
  const [channels, setChannels] = useState<Channel[]>(MOCKED_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [users, setUsers] = useState(MOCKED_USERS);
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
      users,
      selectedChannel,
      setSelectedChannel,
    }),
    [messages, channels, loggedUserArn, token, users, selectedChannel]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
