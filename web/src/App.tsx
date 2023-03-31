import { Amplify } from 'aws-amplify';
import { Flex, Spinner } from '@chakra-ui/react';
import { Chat } from './pages/chat';
import awsconfig from './awsconfig.json';
import { useAuth } from './contexts/Auth/useAuthContext';
import { Login } from './pages/login';

Amplify.configure({
  Auth: {
    identityPoolId: awsconfig.identity_pool_id.value,
    region: 'us-west-2',
    userPoolId: awsconfig.user_pool_id.value,
    userPoolWebClientId: awsconfig.user_pool_client_id.value,
  },
});

function App() {
  const { isAuthenticated, isAuthenticating } = useAuth((state) => state);

  if (isAuthenticating) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner color="teal" size="xl" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Chat />;
}

export default App;
