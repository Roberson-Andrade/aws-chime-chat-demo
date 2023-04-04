import {
  ChannelMessage,
  ChimeSDKMessagingClient,
} from '@aws-sdk/client-chime-sdk-messaging';
import { faker } from '@faker-js/faker';
import { DefaultMessagingSession } from 'amazon-chime-sdk-js';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { generateMessages } from '../../../api/mockedChime';
import { useAuth } from '../../../contexts/Auth/useAuthContext';
import { Channel, User } from '../../../types';
import { messageService } from '../messageService';
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
  const [client, setClient] = useState<ChimeSDKMessagingClient>();
  const [session, setSession] = useState<DefaultMessagingSession>();

  const [messages, setMessages] = useState<ChannelMessage[]>(() =>
    generateMessages(10)
  );
  const [channels, setChannels] = useState<Channel[]>(MOCKED_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [users, setUsers] = useState(MOCKED_USERS);
  const [loggedUserArn, setLoggedUserArn] = useState('arn1');
  generateMessages(10);
  const [token, setToken] = useState<string | undefined>('aa');

  const user = useAuth((state) => state?.user);

  useEffect(() => {
    if (user)
      (async () => {
        const messageServiceResponse = await messageService(user);

        setClient(messageServiceResponse.client);
        setSession(messageServiceResponse.session);
      })();
  }, [user]);

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
