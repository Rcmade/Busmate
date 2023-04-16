import {
  Stack,
  Alert,
  IconButton,
  HStack,
  VStack,
  CloseIcon,
  Text,
} from 'native-base';
import React from 'react';

const Alerts1 = ({title, status}) => {
  return (
    <Alert w="100%" status={status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" />}
            _icon={{
              color: 'coolGray.600',
            }}
          />
        </HStack>
      </VStack>
    </Alert>
  );
};

export default Alerts1;
