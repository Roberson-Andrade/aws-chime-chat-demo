import {
  ChannelMessage,
  ChimeSDKMessagingClient,
} from '@aws-sdk/client-chime-sdk-messaging';
import {
  DefaultMessagingSession,
  MessagingSessionObserver,
} from 'amazon-chime-sdk-js';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/Auth/useAuthContext';
import { Channel, User } from '../../../types';
import { messageService } from '../messageService';
import { generateUserArn } from '../utils';
import { ChatContext, ChatContextProperties } from './Context';

interface ChatProviderProperties {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProperties) {
  const [client, setClient] = useState<ChimeSDKMessagingClient>();
  const [session, setSession] = useState<DefaultMessagingSession>();

  const [messages, setMessages] = useState<ChannelMessage[]>(() => []);
  const [channels, setChannels] = useState<Channel[]>([]);

  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [users, setUsers] = useState<User[]>([]);
  const [loggedUserArn, setLoggedUserArn] = useState<string>();
  const [token, setToken] = useState<string | undefined>();

  const user = useAuth((state) => state?.user);

  useEffect(() => {
    if (user && !client)
      (async () => {
        const userArn = generateUserArn(user.id);
        const messageServiceResponse = await messageService(userArn);

        messageServiceResponse.session.start();

        setClient(messageServiceResponse.client);
        setSession(messageServiceResponse.session);
        setLoggedUserArn(userArn);
      })();
  }, [client, user]);

  const observer: MessagingSessionObserver = useMemo(
    () => ({
      messagingSessionDidStart: (): void => {},
      messagingSessionDidStartConnecting: (): void => {},
      messagingSessionDidStop: (): void => {},
      messagingSessionDidReceiveMessage: (message): void => {
        switch (message.type) {
          case 'CREATE_CHANNEL_MESSAGE': {
            console.log('message', message);

            break;
          }
          case 'UPDATE_CHANNEL_MESSAGE': {
            console.log('message', message);
            break;
          }
          default:
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (session) {
      session.addObserver(observer);
    }
    return () => {
      if (session) {
        session.removeObserver(observer);
      }
    };
  }, [observer, session]);

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
