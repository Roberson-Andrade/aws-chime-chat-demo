import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { Box, Text } from '@chakra-ui/react';
import { useChatContextSelector } from '../../context/useChatContextSelector';

interface BubbleProperties {
  message: ChannelMessage;
}

export function Bubble({ message }: BubbleProperties) {
  const loggedUserArn = useChatContextSelector((state) => state?.loggedUserArn);

  const variant = message.Sender?.Arn === loggedUserArn ? 'sent' : 'received';
  const isMessageSent = variant === 'sent';

  const borderRadiusStyle = isMessageSent
    ? { borderBottomRightRadius: 0 }
    : { borderBottomLeftRadius: 0 };

  const timestampPlacement = isMessageSent ? { left: 8 } : { right: 8 };

  return (
    <Box
      w="fit-content"
      p="4"
      bg={isMessageSent ? 'teal.100' : 'white'}
      position="relative"
      borderRadius="8px"
      ml={isMessageSent ? 'auto' : '0'}
      mr={isMessageSent ? '0' : 'auto'}
      maxW="300px"
      style={borderRadiusStyle}
    >
      {message.Content}
      <Text
        pos="absolute"
        bottom="0.5"
        fontSize="10px"
        color="gray.400"
        style={timestampPlacement}
      >
        {message.CreatedTimestamp
          ? new Intl.DateTimeFormat('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(message.CreatedTimestamp)
          : ''}
      </Text>
    </Box>
  );
}
