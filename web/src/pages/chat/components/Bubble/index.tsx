import { Box, Text } from '@chakra-ui/react';

interface BubbleProperties {
  content: string;
  variant: 'sent' | 'received';
}

// const defaultArrowStyle = {
//   content: '""',
//   width: 0,
//   height: 0,
//   top: '0',
//   position: 'absolute',
// };

// const arrowStyle: Record<BubbleProperties['variant'], SystemStyleObject> = {
//   sent: {
//     right: '-16px',
//     borderRight: '16px solid transparent',
//     borderBottom: '16px solid transparent',
//     borderTop: '16px solid #FFF',
//   },
//   received: {
//     right: '-16px',
//     borderRight: '16px solid transparent',
//     borderBottom: '16px solid transparent',
//     borderTop: '16px solid #FFF',
//   },
// };

export function Bubble({ content, variant }: BubbleProperties) {
  return (
    <Box
      w="fit-content"
      p="4"
      bg={variant === 'sent' ? 'teal.100' : 'white'}
      position="relative"
      borderRadius="8px"
      borderBottomRightRadius="0"
      ml={variant === 'sent' ? 'auto' : '0'}
      mr={variant === 'received' ? 'auto' : '0'}
      maxW="300px"
    >
      {content}
      <Text
        pos="absolute"
        bottom="0.5"
        left="2"
        fontSize="10px"
        color="gray.400"
      >
        11h40
      </Text>
    </Box>
  );
}
