import {Button, Text} from 'native-base';
import React, {memo} from 'react';

const Buttons = ({title, isLoading, isLoadingText, ...event}) => {
  return (
    <>
      <Button
        isLoading={isLoading}
        bg={'darkBlue.500'}
        rounded="3xl"
        variant="subtle"
        w="100%"
        _loading={{
          bg: 'darkBlue.500',
          _text: {
            color: 'white',
            fontSize: 22,
            fontWeight: 'bold',
          },
        }}
        _spinner={{
          color: 'white',
        }}
        isLoadingText={isLoadingText}
        {...event}>
        <Text color={'white'} fontWeight={'bold'} fontSize={20}>
          {title}
        </Text>
      </Button>
    </>
  );
};

export default memo(Buttons);
