import { Flex, IconButton, Input } from '@chakra-ui/react';
import { PaperPlaneRight } from 'phosphor-react';
import { useCallback, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useChatContext } from '../../context/useChatContext';
import { Bubble } from '../Bubble';

export function Channel() {
  const messages = useChatContext((state) => state?.messages);
  const [firstItemIndex] = useState(100_000);

  const prependItems = useCallback(() => {
    console.log(messages);

    return false;
  }, [firstItemIndex]);
  return (
    <Flex bg="gray.100" w="full" direction="column">
      <Virtuoso
        style={{ height: '100%' }}
        totalCount={messages.length}
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={messages.length - 1}
        data={messages}
        startReached={prependItems}
        itemContent={(index, message) => {
          const isSent = true;
          return (
            <div style={{ padding: '0.5rem 2rem' }}>
              <Bubble
                content={message.Content as string}
                variant={isSent ? 'sent' : 'received'}
              />
            </div>
          );
        }}
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
