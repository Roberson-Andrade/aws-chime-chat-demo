import {
  UnorderedList,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { AddressBook, Chats, MagnifyingGlass } from 'phosphor-react';
import { useState } from 'react';
import { Channel } from '../../../../types';
import { useChatContext } from '../../context/useChatContext';
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
    setSelectedChannel,
  } = useChatContext((state) => state);

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
  }

  const filteredChannelList = filterList(channelList, textFilter);
  const filteredUserList = filterList(userList, textFilter);
  const shouldDisplayChannelList = listToDisplay === 'channel';
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
        />
      </Flex>
      <UnorderedList
        display="flex"
        flexDirection="column"
        h="full"
        w="full"
        margin="0"
      >
        {shouldDisplayChannelList
          ? filteredChannelList.map((channel) => (
              <ChannelListItem
                key={channel.channelId}
                channel={channel}
                isActive={channel.channelId === selectedChannel?.channelId}
                onClick={() => onSelectChannel(channel)}
              />
            ))
          : filteredUserList.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
      </UnorderedList>
    </Box>
  );
}
