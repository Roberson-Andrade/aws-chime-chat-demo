import {
  ChimeSDKIdentityClient,
  CreateAppInstanceUserCommand,
} from '@aws-sdk/client-chime-sdk-identity';
import { Handler } from 'aws-lambda';

interface Event {
  request: {
    userAttributes: {
      name: string;
      email: string;
      sub: string;
      email_verified: boolean;
      'cognito:user_status': string;
      'cognito:email_alias': string;
    };
  };
}

const client = new ChimeSDKIdentityClient({ region: 'us-east-1' });

export const handler: Handler<Event> = async (event) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));

  if (!process.env.app_instance_arn) {
    throw new Error('Missing app_instance_arn environment variable');
  }

  const { name, sub } = event.request.userAttributes;

  const createUserResponse = await client.send(
    new CreateAppInstanceUserCommand({
      Name: name,
      AppInstanceUserId: sub,
      AppInstanceArn: process.env.app_instance_arn,
    })
  );

  console.log('createUserResponse', createUserResponse);

  return event;
};
