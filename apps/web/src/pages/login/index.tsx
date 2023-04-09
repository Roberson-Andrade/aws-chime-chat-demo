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
import { useForm } from 'react-hook-form';
import chimeLogoUrl from '../../assets/chime-logo.png';
import { useAuth } from '../../contexts/Auth/useAuthContext';
import { Mode } from '../../types';
import {
  renderHeader,
  renderSubmitButtonText,
  renderBackButtonText,
} from './utils';

interface LoginFormFields {
  code: string;
  name: string;
  email: string;
  password: string;
}

export function Login() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormFields>();
  const { signIn, signUp, confirmAccount } = useAuth((state) => state);

  const handleClick = () => setShowPassword(!showPassword);

  function onToggleMode() {
    setMode((previousState) =>
      previousState === 'signIn' ? 'signUp' : 'signIn'
    );
  }

  async function onSubmit({ email, password, name, code }: LoginFormFields) {
    setIsLoading(true);

    if (mode === 'confirmAccount') {
      await confirmAccount({ code });

      setIsLoading(false);

      return;
    }

    if (mode === 'signIn') {
      await signIn({ email, password });
      setIsLoading(false);

      return;
    }

    await signUp({ email, name, password });
    setMode('confirmAccount');
    setIsLoading(false);
  }

  return (
    <Flex h="100vh" w="100vw" align="center" justify="center">
      <Flex w="full" maxW="25rem" direction="column" gap="6" px="4">
        <Flex align="center" direction="column" gap="4" mb="8">
          <Image
            boxSize="100px"
            objectFit="cover"
            src={chimeLogoUrl}
            alt="Chime logo"
          />
          <Heading>AWS Chime Demo</Heading>
        </Flex>
        <Flex gap="2" direction="column">
          <Heading as="h1" size="md">
            {renderHeader(mode)}
          </Heading>
        </Flex>

        <Flex
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          direction="column"
          gap="4"
        >
          {mode === 'confirmAccount' ? (
            <>
              <Input
                type="text"
                focusBorderColor="teal.400"
                placeholder="********"
                {...register('code', { required: true })}
                disabled={isLoading}
              />
            </>
          ) : (
            <>
              {mode === 'signUp' && (
                <FormControl>
                  <FormLabel fontWeight="semibold">Name</FormLabel>

                  <Input
                    type="text"
                    focusBorderColor="teal.400"
                    placeholder="John Doe"
                    {...register('name', { required: true })}
                    disabled={isLoading}
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel fontWeight="semibold">Email</FormLabel>

                <Input
                  type="email"
                  focusBorderColor="teal.400"
                  placeholder="user@email.com"
                  {...register('email', { required: true })}
                  disabled={isLoading}
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
                    {...register('password', { required: true })}
                    disabled={isLoading}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClick}
                      isDisabled={isLoading}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </>
          )}

          <Button colorScheme="teal" type="submit" isLoading={isLoading}>
            {renderSubmitButtonText(mode)}
          </Button>
        </Flex>

        <Flex alignItems="center" gap="2">
          <Divider opacity="1" />{' '}
          <Text color="gray.400" fontSize="sm">
            or
          </Text>{' '}
          <Divider opacity="1" />
        </Flex>

        <Button
          colorScheme="teal"
          variant="outline"
          onClick={onToggleMode}
          isDisabled={isLoading}
        >
          {renderBackButtonText(mode)}
        </Button>
      </Flex>
    </Flex>
  );
}
