import { Flex } from '@chakra-ui/react';
import { Channel } from './components/Channel';
import { ChannelList } from './components/ChannelList';
import { ChatProvider } from './context/Provider';

function ChatComponent() {
  return (
    <Flex
      justify="center"
      align="center"
      as="main"
      w="full"
      h="100vh"
      bg="teal.900"
    >
      <Flex
        w="90%"
        maxW="1400px"
        h="full"
        maxH="80%"
        bg="white"
        borderRadius="8px"
        overflow="hidden"
      >
        <ChannelList />
        <Channel />
      </Flex>
    </Flex>
  );
}

export function Chat() {
  return (
    <ChatProvider>
      <ChatComponent />
    </ChatProvider>
  );
}
