import { Box, SystemStyleObject } from '@chakra-ui/react';

interface BubbleProperties {
  content: string;
  variant: 'sent' | 'received';
}

const defaultArrowStyle = {
  content: '""',
  width: 0,
  height: 0,
  top: '0',
  position: 'absolute',
};

export function Bubble({ content, variant }: BubbleProperties) {
  const arrowStyle: Record<BubbleProperties['variant'], SystemStyleObject> = {
    sent: {
      right: '-16px',
      borderRight: '16px solid transparent',
      borderBottom: '16px solid transparent',
      borderTop: '16px solid #81E6d9',
    },
    received: {
      right: '-16px',
      borderRight: '16px solid transparent',
      borderBottom: '16px solid transparent',
      borderTop: '16px solid #81E6d9',
    },
  };

  return (
    <Box
      w="fit-content"
      p="4"
      bg="teal.200"
      position="relative"
      borderRadius="8px"
      borderTopRightRadius="0"
      ml={variant === 'sent' ? 'auto' : '0'}
      mr={variant === 'received' ? 'auto' : '0'}
      _after={{
        ...defaultArrowStyle,
        ...arrowStyle[variant],
      }}
    >
      {content}
    </Box>
  );
}
