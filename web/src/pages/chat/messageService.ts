/* eslint-disable unicorn/no-null */
import { ChimeSDKMessagingClient } from '@aws-sdk/client-chime-sdk-messaging';
import {
  ConsoleLogger,
  LogLevel,
  MessagingSessionConfiguration,
  DefaultMessagingSession,
} from 'amazon-chime-sdk-js';
import { Auth } from 'aws-amplify';
import { UNDEFINED } from '../../constants';
import { User } from '../../types';
import { generateUserArn } from './utils';

const REGION = 'us-east-1';

export async function messageService(user: User) {
  const client = new ChimeSDKMessagingClient({
    region: REGION,
    credentials: async () => Auth.currentCredentials(),
  });

  const configuration = new MessagingSessionConfiguration(
    generateUserArn(user.id),
    null,
    UNDEFINED,
    client
  );
  const logger = new ConsoleLogger('SDK', LogLevel.ERROR);

  const session = new DefaultMessagingSession(configuration, logger);

  return {
    client,
    session,
  };
}
