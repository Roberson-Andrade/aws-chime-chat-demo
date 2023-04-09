import {
  ChimeSDKIdentityClient,
  ListAppInstanceUsersCommand,
} from '@aws-sdk/client-chime-sdk-identity';
import {
  ChannelMessage,
  ChimeSDKMessagingClient,
  ListChannelMembershipsForAppInstanceUserCommand,
  ListChannelMessagesCommand,
  SortOrder,
} from '@aws-sdk/client-chime-sdk-messaging';
import {
  DefaultMessagingSession,
  MessagingSessionObserver,
} from 'amazon-chime-sdk-js';
import {
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { useAuth } from '../../../contexts/Auth/useAuthContext';
import {
  AllMessagesPayload,
  Channel,
  ChatUser,
  MessageState,
} from '../../../types';
import { messageService } from '../messageService';
import {
  addAllMessagesAction,
  addNewMessageAction,
} from '../reducers/messages/actions';
import { messagesReducer } from '../reducers/messages/reducer';
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

  const [messageState, dispatch] = useReducer<
    typeof messagesReducer,
    MessageState
  >(messagesReducer, { messages: [] }, (state) => state);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();

  const [users, setUsers] = useState<ChatUser[]>();
  const [loggedUserArn, setLoggedUserArn] = useState<string>();

  const [isChannelsLoading, setIsChannelsLoading] = useState(true);
  const virtuosoReference = useRef<VirtuosoHandle>(null);

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
    if (loggedUserArn && client && users) {
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
          const validChannels: Channel[] = [];

          for (const {
            ChannelSummary,
          } of channelsResponse.ChannelMemberships) {
            if (
              ChannelSummary &&
              ChannelSummary.ChannelArn &&
              ChannelSummary.Name
            ) {
              const [firstId, secondId] = ChannelSummary.Name.split('#');

              const name =
                firstId === user.id
                  ? users.find((userItem) => userItem.id === secondId)?.name
                  : users.find((userItem) => userItem.id === firstId)?.name;

              if (!name) {
                return;
              }

              validChannels.push({
                channelArn: ChannelSummary.ChannelArn,
                lastMessageDate: ChannelSummary.LastMessageTimestamp,
                name,
              });
            }
          }

          setChannels(validChannels);
        }

        setIsChannelsLoading(false);
      })();
    }
  }, [client, loggedUserArn, user.id, users]);

  /**
   * List the first 15 messages from each channel
   */
  useEffect(() => {
    (async () => {
      if (client && channels.length > 0 && !messageState.allMessages) {
        const promises = [];

        for (const channel of channels) {
          promises.push(
            client.send(
              new ListChannelMessagesCommand({
                ChannelArn: channel.channelArn,
                ChimeBearer: loggedUserArn,
                MaxResults: 15,
                SortOrder: SortOrder.DESCENDING,
              })
            )
          );
        }

        const allMessagesResponse = await Promise.all(promises);

        if (allMessagesResponse) {
          const messagesToMap: [string, AllMessagesPayload][] = [];

          for (const message of allMessagesResponse) {
            if (message.ChannelArn && message.ChannelMessages) {
              messagesToMap.push([
                message.ChannelArn,
                {
                  messages: message.ChannelMessages.reverse(),
                  token: message.NextToken,
                },
              ]);
            }
          }

          dispatch(addAllMessagesAction(new Map(messagesToMap)));
        }
      }
    })();
  }, [channels, client, loggedUserArn, messageState.allMessages]);

  const observer: MessagingSessionObserver = useMemo(
    () => ({
      messagingSessionDidReceiveMessage: (message): void => {
        switch (message.type) {
          case 'CREATE_CHANNEL_MESSAGE': {
            const parsedMessage = JSON.parse(message.payload) as Omit<
              ChannelMessage,
              'CreatedTimestamp' | 'LastUpdatedTimestamp'
            > & { CreatedTimestamp: string; LastUpdatedTimestamp: string };

            const formattedMessage: ChannelMessage = {
              ...parsedMessage,
              CreatedTimestamp: new Date(parsedMessage.CreatedTimestamp),
              LastUpdatedTimestamp: new Date(
                parsedMessage.LastUpdatedTimestamp
              ),
            };

            const foundChannel = channels.find(
              (channel) => channel.channelArn === formattedMessage.ChannelArn
            );

            if (!foundChannel) {
              setChannels((previousChannels) => {
                if (
                  formattedMessage.Sender?.Name &&
                  formattedMessage.CreatedTimestamp &&
                  formattedMessage.ChannelArn
                ) {
                  return [
                    ...previousChannels,
                    {
                      channelArn: formattedMessage.ChannelArn,
                      name: formattedMessage.Sender.Name,
                      lastMessageDate: formattedMessage.CreatedTimestamp,
                    },
                  ];
                }

                return previousChannels;
              });
            }
            dispatch(
              addNewMessageAction(
                formattedMessage,
                selectedChannel?.channelArn === formattedMessage.ChannelArn
              )
            );

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
    [channels, selectedChannel?.channelArn]
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
      messages: messageState.messages,
      channels,
      loggedUserArn,
      setChannels,
      token: messageState.token,
      users,
      selectedChannel,
      setSelectedChannel,
      client,
      allMessages: messageState.allMessages,
      isChannelsLoading,
      virtuosoReference,
      dispatch,
    }),
    [
      messageState.messages,
      messageState.token,
      messageState.allMessages,
      channels,
      loggedUserArn,
      users,
      selectedChannel,
      client,
      isChannelsLoading,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
