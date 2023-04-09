import {
  SendChannelMessageCommand,
  ChannelMessagePersistenceType,
  ChannelMessageType,
  ListChannelMessagesCommand,
  SortOrder,
} from '@aws-sdk/client-chime-sdk-messaging';
import { Flex, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { PaperPlaneRight } from 'phosphor-react';
import { ChangeEvent, useCallback, useMemo, useState, FormEvent } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { UNDEFINED } from '../../../../constants';
import { useChatContext } from '../../context/useChatContext';
import { setMessagesFromSelectedChannelAction } from '../../reducers/messages/actions';
import { Bubble } from '../Bubble';

const START_INDEX = 100_000;

function Header() {
  return (
    <Flex w="full" justify="center" py="4">
      <Spinner color="teal" />
    </Flex>
  );
}

export function Channel() {
  const [text, setText] = useState('');
  const {
    messages,
    token,
    dispatch,
    selectedChannel,
    client,
    loggedUserArn,
    virtuosoReference,
  } = useChatContext();
  const [firstItemIndex, setFirstItemIndex] = useState(
    START_INDEX - messages.length
  );

  const prependItems = useCallback(async () => {
    if (token && client && selectedChannel?.channelArn) {
      const newMessages = await client.send(
        new ListChannelMessagesCommand({
          ChannelArn: selectedChannel.channelArn,
          ChimeBearer: loggedUserArn,
          MaxResults: 10,
          SortOrder: SortOrder.DESCENDING,
          NextToken: token,
        })
      );

      if (newMessages.ChannelMessages) {
        const { ChannelMessages, NextToken } = newMessages;

        dispatch(
          setMessagesFromSelectedChannelAction(
            [...ChannelMessages, ...messages],
            NextToken
          )
        );
      }
    }
  }, [
    client,
    dispatch,
    loggedUserArn,
    messages,
    selectedChannel?.channelArn,
    token,
  ]);

  function onChangeText(value: ChangeEvent<HTMLInputElement>) {
    setText(value.target.value);
  }

  async function onSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text) {
      return;
    }

    setText('');

    if (client) {
      await client.send(
        new SendChannelMessageCommand({
          ChannelArn: selectedChannel?.channelArn,
          ChimeBearer: loggedUserArn,
          Content: text,
          Persistence: ChannelMessagePersistenceType.PERSISTENT,
          Type: ChannelMessageType.STANDARD,
        })
      );
    }
  }

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = START_INDEX - messages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages]);

  return (
    <Flex bg="gray.100" w="full" direction="column">
      {selectedChannel ? (
        <>
          <Virtuoso
            ref={virtuosoReference}
            style={{ height: '100%' }}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={internalMessages.length - 1}
            data={internalMessages}
            startReached={prependItems}
            itemContent={(_, message) => (
              <div style={{ padding: '0.5rem 2rem' }}>
                <Bubble message={message} />
              </div>
            )}
            components={{ Header: token ? Header : UNDEFINED }}
            followOutput={(isAtBottom: boolean) => {
              if (isAtBottom) {
                return 'smooth';
              }

              return false;
            }}
          />
          <form onSubmit={onSendMessage}>
            <Flex p="4" w="full" mt="auto" bg="white" gap="4">
              <Input
                focusBorderColor="teal.500"
                value={text}
                onChange={onChangeText}
              />
              <IconButton
                aria-label="Send message"
                icon={<PaperPlaneRight />}
                colorScheme="teal"
                type="submit"
              />
            </Flex>
          </form>
        </>
      ) : (
        <Flex w="100%" h="100%" justify="center" align="center">
          <Text as="p" color="teal.900">
            No channel selected
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
