import {
  ChimeSDKIdentityClient,
  ListAppInstanceUsersCommand,
} from '@aws-sdk/client-chime-sdk-identity';
import {
  ChannelMessage,
  ChimeSDKMessagingClient,
  ListChannelMembershipsForAppInstanceUserCommand,
  ChannelSummary,
  ListChannelMessagesCommand,
  ChannelMessageSummary,
} from '@aws-sdk/client-chime-sdk-messaging';
import {
  DefaultMessagingSession,
  MessagingSessionObserver,
} from 'amazon-chime-sdk-js';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/Auth/useAuthContext';
import { Channel, ChatUser } from '../../../types';
import { messageService } from '../messageService';
import { generateUserArn, getAppInstanceArn, getIdFromUserArn } from '../utils';
import { ChatContext, ChatContextProperties } from './Context';

interface ChatProviderProperties {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProperties) {
  const [client, setClient] = useState<ChimeSDKMessagingClient>();
  const [identityClient, setIdentityClient] =
    useState<ChimeSDKIdentityClient>();
  const [session, setSession] = useState<DefaultMessagingSession>();

  const [messages, setMessages] = useState<ChannelMessage[]>(() => []);
  const [allMessages, setAllMessages] =
    useState<Map<string, ChannelMessageSummary[]>>();
  const [channels, setChannels] = useState<ChannelSummary[]>([]);

  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [users, setUsers] = useState<ChatUser[]>();
  const [loggedUserArn, setLoggedUserArn] = useState<string>();
  const [token, setToken] = useState<string | undefined>();

  const user = useAuth((state) => state?.user);

  /**
   * Configure the chime client and session
   */
  useEffect(() => {
    if (user && !client)
      (async () => {
        const userArn = generateUserArn(user.id);
        const messageServiceResponse = await messageService(userArn);

        messageServiceResponse.session.start();

        setClient(messageServiceResponse.client);
        setIdentityClient(messageServiceResponse.identityClient);
        setSession(messageServiceResponse.session);
        setLoggedUserArn(userArn);
      })();
  }, [client, user]);

  /**
   * Fetch all chat users
   */
  useEffect(() => {
    (async () => {
      if (identityClient && !users) {
        const listUsersResponse = await identityClient.send(
          new ListAppInstanceUsersCommand({
            AppInstanceArn: getAppInstanceArn(),
          })
        );

        if (listUsersResponse.AppInstanceUsers) {
          const formattedUsers = listUsersResponse.AppInstanceUsers.map(
            (chatUser) => ({
              id: getIdFromUserArn(chatUser.AppInstanceUserArn ?? ''),
              name: chatUser.Name ?? '',
            })
          );

          const filteredUsers = formattedUsers.filter(
            (item) => item.id !== user.id && item.id !== 'application-worker'
          );

          setUsers(filteredUsers);
        }
      }
    })();
  }, [identityClient]);

  /**
   * Fetch all channels that the logged user is part in
   */
  useEffect(() => {
    if (loggedUserArn && client) {
      (async () => {
        const channelsResponse = await client.send(
          new ListChannelMembershipsForAppInstanceUserCommand({
            ChimeBearer: loggedUserArn,
            AppInstanceUserArn: loggedUserArn,
          })
        );

        if (
          channelsResponse.ChannelMemberships &&
          channelsResponse.ChannelMemberships.length > 0
        ) {
          const validChannels = [];

          for (const channelItem of channelsResponse.ChannelMemberships) {
            if (channelItem.ChannelSummary) {
              validChannels.push(channelItem.ChannelSummary);
            }
          }

          setChannels(validChannels);
        }
      })();
    }
  }, [client, loggedUserArn]);

  /**
   * List the first 10 messages from each channel
   */
  useEffect(() => {
    (async () => {
      if (client && channels.length > 0 && !allMessages) {
        const promises = [];

        for (const channel of channels) {
          promises.push(
            client.send(
              new ListChannelMessagesCommand({
                ChannelArn: channel.ChannelArn,
                ChimeBearer: loggedUserArn,
                MaxResults: 10,
              })
            )
          );
        }

        const allMessagesResponse = await Promise.all(promises);

        if (allMessagesResponse) {
          const messagesToMap: [string, ChannelMessageSummary[]][] = [];

          for (const message of allMessagesResponse) {
            if (message.ChannelArn && message.ChannelMessages) {
              messagesToMap.push([message.ChannelArn, message.ChannelMessages]);
            }
          }

          setAllMessages(new Map(messagesToMap));
        }

        console.log('allMessagesResponse', allMessagesResponse);
      }
    })();
  }, [allMessages, channels, client, loggedUserArn]);

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
