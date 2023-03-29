import { Flex, IconButton, Input } from '@chakra-ui/react';
import { PaperPlaneRight } from 'phosphor-react';
import { useCallback, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { generateMessages } from '../../../../api/mockedChime';
import { useChatContext } from '../../context/useChatContext';
import { Bubble } from '../Bubble';

const UNDEFINED = undefined;

export function Channel() {
  const { messages, token, setMessages, setToken } = useChatContext(
    (state) => state
  );
  const [firstItemIndex, setFirstItemIndex] = useState(100_000);
  const [initial] = useState(() => messages.length);

  const prependItems = useCallback(() => {
    if (token) {
      const messagesToPrepend = 10;
      const nextFirstItemIndex = firstItemIndex - messagesToPrepend;
      setToken(UNDEFINED);

      setTimeout(() => {
        setFirstItemIndex(() => nextFirstItemIndex);
        setMessages(() => [
          ...generateMessages(messagesToPrepend),
          ...messages,
        ]);
      }, 500);
    }
  }, [firstItemIndex]);
  return (
    <Flex bg="gray.100" w="full" direction="column">
      <Virtuoso
        style={{ height: '100%' }}
        firstItemIndex={firstItemIndex}
        totalCount={messages.length}
        initialTopMostItemIndex={initial - 1}
        data={messages}
        startReached={prependItems}
        itemContent={(_, message) => (
          <div style={{ padding: '0.5rem 2rem' }}>
            <Bubble message={message} />
          </div>
        )}
      />
      <Flex p="4" w="full" mt="auto" bg="white" gap="4">
        <Input focusBorderColor="teal.500" />
        <IconButton
          aria-label="Send message"
          icon={<PaperPlaneRight />}
          colorScheme="teal"
        />
      </Flex>
    </Flex>
  );
}
