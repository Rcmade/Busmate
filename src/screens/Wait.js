import React, {useEffect, useState} from 'react';
import {Center, Image, Text, VStack} from 'native-base';
import {useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/native';

const Wait = () => {
  const getUserData = useSelector(state => state.authUser);
  const navigation = useNavigation();

  useEffect(() => {
    if (getUserData?.user) {
      if (getUserData?.user?.isAuthenticated === true) {
        navigation.dispatch(StackActions.replace('Home'));
      }
    }
    return () => {};
  }, [getUserData]);

  return (
    <>
      <VStack h="100%" w="100%" backgroundColor={'info.100'}>
        <Center w="100%" p={3} pt={10}>
          <Image
            size={'2xl'}
            resizeMethod="auto"
            alt="fallback text"
            // borderRadius={100}
            source={require('../assets/wait.png')}
            fallbackSource={{
              uri: 'https://www.w3schools.com/css/img_lights.jpg',
            }}
          />

          <Text fontSize="2xl">Please Wait For</Text>
          <Text fontSize="2xl"> 24 Hours </Text>
          <Text fontSize="2xl">We Are verifying Your Profile.</Text>
        </Center>
      </VStack>
    </>
  );
};

export default Wait;
