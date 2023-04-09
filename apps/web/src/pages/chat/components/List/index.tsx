import {
  UnorderedList,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  IconButton,
  Stack,
  Skeleton,
} from '@chakra-ui/react';
import { AddressBook, Chats, MagnifyingGlass } from 'phosphor-react';
import { useState } from 'react';
import { createChannel } from '../../../../api/chime';
import { useAuth } from '../../../../contexts/Auth/useAuthContext';
import { Channel, ChatUser } from '../../../../types';
import { useChatContext } from '../../context/useChatContext';
import {
  resetMessagesAction,
  setMessagesFromSelectedChannelAction,
} from '../../reducers/messages/actions';
import { filterList } from '../../utils';
import { ChannelListItem, UserListItem } from '../ListItem';

export function List() {
  const [textFilter, setTextFilter] = useState('');
  const [listToDisplay, setListToDisplay] = useState<'channel' | 'user'>(
    'channel'
  );
  const {
    channels: channelList,
    users: userList,
    selectedChannel,
    client,
    allMessages,
    isChannelsLoading,
    virtuosoReference,
    setSelectedChannel,
    setChannels,
    dispatch,
  } = useChatContext();

  const user = useAuth((state) => state?.user);

  function onToggleDisplayList() {
    setListToDisplay((previousList) =>
      previousList === 'channel' ? 'user' : 'channel'
    );
  }

  function onChangeTextFilter(value: string) {
    setTextFilter(value);
  }

  function onSelectChannel(value: Channel) {
    setSelectedChannel(value);
    const selectedMessages = allMessages?.get(value.channelArn);

    if (selectedMessages) {
      virtuosoReference.current?.scrollTo({ top: 999_999_999_999_999 });

      dispatch(
        setMessagesFromSelectedChannelAction(
          selectedMessages.messages,
          selectedMessages.token
        )
      );
    }
  }

  async function onClickUser(clickedUser: ChatUser) {
    const foundChannel = channelList.find(
      (channel) => channel.name === clickedUser.name
    );

    if (foundChannel) {
      const selectedMessages = allMessages?.get(foundChannel.channelArn);

      setSelectedChannel(foundChannel);
      setListToDisplay('channel');

      if (selectedMessages) {
        dispatch(
          setMessagesFromSelectedChannelAction(
            selectedMessages.messages,
            selectedMessages.token
          )
        );
      }
      return;
    }

    if (client) {
      const channelArn = await createChannel({
        chimeClient: client,
        currentUserId: user.id,
        userToChatId: clickedUser.id,
      });

      const newChannel: Channel = { channelArn, name: clickedUser.name };

      setChannels((previousChannels) => [...previousChannels, newChannel]);
      setSelectedChannel(newChannel);
      setListToDisplay('channel');
      dispatch(resetMessagesAction());
    }
  }

  const filteredChannelList = filterList(channelList ?? [], textFilter).sort(
    (a, b) => {
      const parsedTimestampA = allMessages
        ?.get(a.channelArn)
        ?.messages.at(-1)?.CreatedTimestamp;

      const parsedTimestampB = allMessages
        ?.get(b.channelArn)
        ?.messages.at(-1)?.CreatedTimestamp;

      if (
        parsedTimestampA &&
        parsedTimestampB &&
        parsedTimestampA > parsedTimestampB
      ) {
        return -1;
      }

      return 1;
    }
  );
  const filteredUserList = filterList(userList ?? [], textFilter);
  const shouldDisplayChannelList = listToDisplay === 'channel';

  function renderItemsList() {
    if (isChannelsLoading) {
      return (
        <Stack p="1rem 1.5rem">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} height="60px" />
          ))}
        </Stack>
      );
    }
    if (shouldDisplayChannelList) {
      if (filteredChannelList.length === 0) {
        return (
          <Flex
            w="100%"
            h="100%"
            justify="center"
            align="center"
            color="teal.900"
          >
            No channel found
          </Flex>
        );
      }

      return filteredChannelList.map((channel) => (
        <ChannelListItem
          key={channel.channelArn}
          channel={channel}
          isActive={channel.channelArn === selectedChannel?.channelArn}
          onClick={() => onSelectChannel(channel)}
        />
      ));
    }

    if (filteredUserList.length === 0) {
      return (
        <Flex
          w="100%"
          h="100%"
          justify="center"
          align="center"
          color="teal.900"
        >
          No user found
        </Flex>
      );
    }

    return filteredUserList.map((userItem) => (
      <UserListItem
        key={userItem.id}
        user={userItem}
        onClick={() => onClickUser(userItem)}
      />
    ));
  }
  return (
    <Box
      h="full"
      w="full"
      maxW="400px"
      display="flex"
      flexDirection="column"
      py="1.5rem"
      gap="1rem"
      bg="white"
    >
      <Flex px="1.5rem" gap="6">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<MagnifyingGlass color="#ddd" />}
          />
          <Input
            type="text"
            focusBorderColor="teal.500"
            placeholder="Search channel"
            pr="4.5rem"
            value={textFilter}
            onChange={(event) => onChangeTextFilter(event.target.value)}
            isDisabled={isChannelsLoading}
          />
        </InputGroup>
        <IconButton
          aria-label="Add user"
          icon={
            shouldDisplayChannelList ? (
              <AddressBook width="24px" height="24px" />
            ) : (
              <Chats width="24px" height="24px" />
            )
          }
          colorScheme="teal"
          variant="outline"
          onClick={onToggleDisplayList}
          isDisabled={isChannelsLoading}
        />
      </Flex>
      <UnorderedList
        display="flex"
        flexDirection="column"
        h="full"
        w="full"
        margin="0"
      >
        {renderItemsList()}
      </UnorderedList>
    </Box>
  );
}
