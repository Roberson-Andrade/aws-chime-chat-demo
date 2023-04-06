import { Flex, IconButton, Input } from '@chakra-ui/react';
import { PaperPlaneRight } from 'phosphor-react';
import { ChangeEvent, useCallback, useMemo, useState, FormEvent } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { generateMessages } from '../../../../api/mockedChime';
import { useChatContext } from '../../context/useChatContext';
import { Bubble } from '../Bubble';

const UNDEFINED = undefined;
const START_INDEX = 100_000;

export function Channel() {
  const { messages, token, setMessages, setToken } = useChatContext();
  const [firstItemIndex, setFirstItemIndex] = useState(
    START_INDEX - messages.length
  );
  const [text, setText] = useState('');

  const prependItems = useCallback(() => {
    if (token) {
      const messagesToPrepend = 10;
      setToken(UNDEFINED);

      setTimeout(() => {
        setMessages(() => [
          ...generateMessages(messagesToPrepend),
          ...messages,
        ]);
      }, 500);
    }
  }, [messages, setMessages, setToken, token]);

  function onChangeText(value: ChangeEvent<HTMLInputElement>) {
    setText(value.target.value);
  }

  function onSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        Content: text,
        Sender: {
          Arn: 'arn1',
        },
        CreatedTimestamp: new Date(),
      },
    ]);
    setText('');
  }

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = START_INDEX - messages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages]);

  return (
    <Flex bg="gray.100" w="full" direction="column">
      <Virtuoso
        style={{ height: '100%' }}
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={internalMessages.length - 1}
        data={internalMessages}
        startReached={prependItems}
        followOutput={(isAtBottom: boolean) => {
          if (isAtBottom) {
            return 'smooth';
          }

          return false;
        }}
        itemContent={(_, message) => (
          <div style={{ padding: '0.5rem 2rem' }}>
            <Bubble message={message} />
          </div>
        )}
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
    </Flex>
  );
}
