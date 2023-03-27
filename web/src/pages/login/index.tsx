/* eslint-disable react/no-children-prop */
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

export function Login() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Flex h="100vh" w="100vw">
      <Flex flexGrow={1} align="center" justify="center">
        <Flex w="full" maxW="25rem" direction="column" gap="6" px="4">
          <Flex gap="2" direction="column">
            <Heading as="h1" size="md">
              Sign in
            </Heading>
          </Flex>

          <Flex as="form" direction="column" gap="4">
            <FormControl>
              <FormLabel fontWeight="semibold">Email</FormLabel>

              <Input
                type="email"
                focusBorderColor="teal.400"
                placeholder="user@email.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="semibold">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? 'text' : 'password'}
                  focusBorderColor="teal.400"
                  placeholder="*********"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button colorScheme="teal">Login</Button>
          </Flex>

          <Flex alignItems="center" gap="2">
            <Divider opacity="1" />{' '}
            <Text color="gray.400" fontSize="sm">
              or
            </Text>{' '}
            <Divider opacity="1" />
          </Flex>

          <Button colorScheme="teal" variant="outline">
            Create an account
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
