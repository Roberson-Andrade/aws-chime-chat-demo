import { Flex, IconButton, Input } from '@chakra-ui/react';
import { PaperPlaneRight } from 'phosphor-react';
import { useChatContext } from '../../context/useChatContext';
import { Bubble } from '../Bubble';

export function Channel() {
  const messages = useChatContext((state) => state?.messages);
  return (
    <Flex bg="teal.50" w="full" direction="column">
      <Flex direction="column" px="4">
        {messages.map((message) => {
          const isSent = true;

          return (
            <Bubble
              key={message.MessageId}
              content={message.Content as string}
              variant={isSent ? 'sent' : 'received'}
            />
          );
        })}
      </Flex>
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
