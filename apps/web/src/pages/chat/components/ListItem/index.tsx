import { Avatar, Box, Button, ButtonProps, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Channel, ChatUser } from '../../../../types';
import { useChatContext } from '../../context/useChatContext';

interface ListItemProperties extends ButtonProps {
  children: ReactNode;
}

function ListItem({ children, ...properties }: ListItemProperties) {
  return (
    <Button
      {...properties}
      w="full"
      variant="ghost"
      colorScheme="teal"
      justifyContent="start"
      p="1rem 1.5rem"
      gap="1rem"
      h="auto"
      borderRadius="none"
    >
      {children}
    </Button>
  );
}

type ListItemPropertiesWithoutChildren = Omit<ListItemProperties, 'children'>;

interface ChannelListItemProperties extends ListItemPropertiesWithoutChildren {
  channel: Channel;
}

export function ChannelListItem({
  channel,
  ...properties
}: ChannelListItemProperties) {
  const { allMessages } = useChatContext();

  const lastMessage = allMessages?.get(channel.channelArn)?.messages.at(-1);
  return (
    <ListItem {...properties}>
      {' '}
      <Avatar size="md" />
      <Box textAlign="left" minW="0">
        <Text>{channel.name}</Text>
        {lastMessage && (
          <Text
            fontSize="xs"
            fontWeight="light"
            color="gray.400"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {lastMessage.Content}
          </Text>
        )}
      </Box>
      {channel.lastMessageDate && (
        <Text ml="auto" fontSize="small" fontWeight="normal" color="gray.400">
          {new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(channel.lastMessageDate)}
        </Text>
      )}
    </ListItem>
  );
}

export interface UserListItemProperties
  extends ListItemPropertiesWithoutChildren {
  user: ChatUser;
}

export function UserListItem({ user, ...properties }: UserListItemProperties) {
  return (
    <ListItem {...properties}>
      <Avatar size="md" />
      <Box textAlign="left" minW="0">
        <Text>{user.name}</Text>
      </Box>
    </ListItem>
  );
}
