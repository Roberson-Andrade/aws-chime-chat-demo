import { Flex, IconButton } from '@chakra-ui/react';
import { SignOut } from 'phosphor-react';
import { useAuth } from '../../contexts/Auth/useAuthContext';
import { Channel } from './components/Channel';
import { List } from './components/List';
import { ChatProvider } from './context/Provider';

function ChatComponent() {
  const signOut = useAuth((state) => state?.signOut);
  return (
    <Flex
      justify="center"
      align="center"
      as="main"
      w="full"
      h="100vh"
      bg="teal.900"
      pos="relative"
    >
      <IconButton
        aria-label="Sign out button"
        colorScheme="teal"
        icon={<SignOut />}
        pos="absolute"
        top="8"
        right="8"
        onClick={signOut}
      />
      <Flex
        w="90%"
        maxW="1400px"
        h="full"
        maxH="80%"
        bg="white"
        borderRadius="8px"
        overflow="hidden"
      >
        <List />
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
