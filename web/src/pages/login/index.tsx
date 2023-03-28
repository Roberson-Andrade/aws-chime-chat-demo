import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import chimeLogoUrl from '../../assets/chime-logo.png';

export function Login() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword(!showPassword);
  function onToggleMode() {
    setMode((previousState) =>
      previousState === 'signIn' ? 'signUp' : 'signIn'
    );
  }

  const isSignInMode = mode === 'signIn';

  return (
    <Flex h="100vh" w="100vw" align="center" justify="center">
      <Flex w="full" maxW="25rem" direction="column" gap="6" px="4">
        <Flex align="center" direction="column" gap="4" mb="8">
          <Image
            boxSize="100px"
            objectFit="cover"
            src={chimeLogoUrl}
            alt="Dan Abramov"
          />
          <Heading>AWS Chime Demo</Heading>
        </Flex>
        <Flex gap="2" direction="column">
          <Heading as="h1" size="md">
            {isSignInMode ? 'Sign in' : 'Sign out'}
          </Heading>
        </Flex>

        <Flex as="form" direction="column" gap="4">
          {!isSignInMode && (
            <FormControl>
              <FormLabel fontWeight="semibold">Email</FormLabel>

              <Input
                type="email"
                focusBorderColor="teal.400"
                placeholder="user@email.com"
              />
            </FormControl>
          )}
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
                type={showPassword ? 'text' : 'password'}
                focusBorderColor="teal.400"
                placeholder="*********"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button colorScheme="teal">
            {isSignInMode ? 'Login' : 'Create an account'}
          </Button>
        </Flex>

        <Flex alignItems="center" gap="2">
          <Divider opacity="1" />{' '}
          <Text color="gray.400" fontSize="sm">
            or
          </Text>{' '}
          <Divider opacity="1" />
        </Flex>

        <Button colorScheme="teal" variant="outline" onClick={onToggleMode}>
          {isSignInMode ? 'Create an account' : 'Login'}
        </Button>
      </Flex>
    </Flex>
  );
}
