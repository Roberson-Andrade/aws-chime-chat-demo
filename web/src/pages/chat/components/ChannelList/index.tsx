import {
  UnorderedList,
  Button,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { MagnifyingGlass } from 'phosphor-react';
import { useChatContext } from '../../context/useChatContext';

export function ChannelList() {
  const channelList = useChatContext((state) => state?.channels);
  return (
    <Box
      h="full"
      w="full"
      maxW="400px"
      display="flex"
      flexDirection="column"
      py="2rem"
      gap="1rem"
      bg="white"
    >
      <Box px="1.5rem">
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
          />
        </InputGroup>
      </Box>
      <UnorderedList
        display="flex"
        flexDirection="column"
        h="full"
        w="full"
        margin="0"
      >
        {channelList.map(({ channelId, name }) => (
          <Button
            w="full"
            variant="ghost"
            colorScheme="teal"
            key={channelId}
            justifyContent="start"
            p="1rem 1.5rem"
            gap="1rem"
            h="auto"
            borderRadius="none"
          >
            <Avatar size="md" />
            {name}
            <Text
              ml="auto"
              fontSize="small"
              fontWeight="normal"
              color="gray.400"
            >
              11h40
            </Text>
          </Button>
        ))}
      </UnorderedList>
    </Box>
  );
}
