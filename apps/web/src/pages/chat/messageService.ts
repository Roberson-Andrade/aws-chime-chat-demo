/* eslint-disable unicorn/no-null */
import { ChimeSDKIdentityClient } from '@aws-sdk/client-chime-sdk-identity';
import { ChimeSDKMessagingClient } from '@aws-sdk/client-chime-sdk-messaging';
import {
  ConsoleLogger,
  LogLevel,
  MessagingSessionConfiguration,
  DefaultMessagingSession,
} from 'amazon-chime-sdk-js';
import { Auth } from 'aws-amplify';
import { UNDEFINED } from '../../constants';

const REGION = 'us-east-1';

export async function messageService(userArn: string) {
  const client = new ChimeSDKMessagingClient({
    region: REGION,
    credentials: async () => Auth.currentCredentials(),
  });

  const identityClient = new ChimeSDKIdentityClient({
    region: REGION,
    credentials: async () => Auth.currentCredentials(),
  });

  const configuration = new MessagingSessionConfiguration(
    userArn,
    null,
    UNDEFINED,
    client
  );
  const logger = new ConsoleLogger('SDK', LogLevel.ERROR);

  const session = new DefaultMessagingSession(configuration, logger);

  return {
    client,
    identityClient,
    session,
  };
}
