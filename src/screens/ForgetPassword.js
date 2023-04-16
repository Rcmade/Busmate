import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';

import {
  Center,
  VStack,
  Text,
  View,
  Image,
  ScrollView,
  useToast,
} from 'native-base';
import Buttons from '../components/Buttons';
import {getStorage, removeStorage, setStorage} from '../utils/functions';
import Toast1 from '../components/Toast/Toast1';
import {forgotPassword, sendOtp, varifyOtp} from '../server';
import InputImage from '../components/InputImage';

const ForgetPassword = () => {
  const [isOtpSend, setisOtpSend] = useState(false);

  const [isEmailVarified, setisEmailVarified] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [inputValue, setInputValue] = useState({});

  const onChangeHandler = (filed, value) => {
    return setInputValue(pre => {
      return {
        ...pre,
        [filed]: value,
      };
    });
  };

  const varifyHandler = async () => {
    setIsLoading(true);
    try {
      const {name, email} = inputValue;
      if (!name || !email) {
        return toast.show({
          render: ({id}) => {
            return (
              <Toast1
                description="All Fields Are Required"
                title="Please Fill All The Fields"
                id={id}
                variant="left-accent"
                toast={toast}
              />
            );
          },
        });
      } else {
        const {data} = await sendOtp({name, email});
        if (data?.error) {
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={data.error}
                  title={data.error}
                  id={id}
                  variant="left-accent"
                  toast={toast}
                />
              );
            },
          });
        } else {
          await setStorage('otpHash', data?.hash);
          setisOtpSend(true);
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={''}
                  title={data.message}
                  id={id}
                  variant="left-accent"
                  toast={toast}
                />
              );
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const varifyOTPHandler = async () => {
    setIsLoading(true);
    const getOtp = await getStorage('otpHash');
    try {
      const {name, email, otp} = inputValue;
      if (!name || !email || !otp) {
        return toast.show({
          render: ({id}) => {
            return (
              <Toast1
                description="All Fields Are Required"
                title="Please Fill All The Fields"
                id={id}
                variant="left-accent"
                toast={toast}
              />
            );
          },
        });
      } else {
        const {data} = await varifyOtp({email, otp, hash: getOtp});
        if (data?.error) {
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={data.error}
                  title={data.error}
                  id={id}
                  variant="left-accent"
                  toast={toast}
                />
              );
            },
          });
        } else {
          await removeStorage('otpHash');
          setisOtpSend(false);
          setisEmailVarified(true);
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={''}
                  title={data.message}
                  id={id}
                  variant="left-accent"
                  toast={toast}
                />
              );
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formSubmitHandler = async () => {
    setIsLoading(true);
    const {name, password, email, otp} = inputValue;
    try {
      if (!name || !password || !email || !otp) {
        return toast.show({
          render: ({id}) => {
            return (
              <Toast1
                description="All Fields Are Required"
                title="Please Fill All The Fields"
                id={id}
                variant="left-accent"
                toast={toast}
              />
            );
          },
        });
      } else {
        const {data} = await forgotPassword({
          password,
          email,
        });
        if (data?.message) {
          navigation.navigate('Login');
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={data?.message}
                  title="Response"
                  id={id}
                  variant="left-accent"
                  toast={toast}
                />
              );
            },
          });
        } else if (data?.error) {
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={data.error}
                  title="Error"
                  id={id}
                  variant="left-accent"
                  toast={toast}
                />
              );
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View w="full" h="full" backgroundColor="white">
      <ScrollView>
        <VStack
          space={4}
          w="100%"
          maxW="100%"
          h="100%"
          mx="auto"
          p="5%"
          alignItems="center"
          backgroundColor={'#ffff'}>
          <Center>
            <Text fontSize="3xl" fontWeight={'bold'} color="darkBlue.800">
              Forget Password
            </Text>
          </Center>

          <InputImage
            imgUrl={require('../assets/name.png')}
            placeHolder={'Name'}
            alt="Name Img"
            name="name"
            readOnly={isEmailVarified}
            value={inputValue?.name}
            onChangeText={value => onChangeHandler('name', value)}
          />
          <InputImage
            imgUrl={require('../assets/email.png')}
            placeHolder={'Enter Registered Your Email'}
            alt="Email Img"
            readOnly={isEmailVarified}
            autoComplete="email"
            name="email"
            value={inputValue?.email}
            onChangeText={value => onChangeHandler('email', value)}
            autoCompleteType="email"
            textContentType="emailAddress"
          />

          {isOtpSend && (
            <>
              <InputImage
                imgUrl={require('../assets/lock.png')}
                placeHolder={'Enter Otp'}
                alt="Otp Img"
                keyboardType="numeric"
                name="otp"
                value={inputValue?.otp}
                onChangeText={value => onChangeHandler('otp', value)}
              />

              <Buttons
                // mb={40}
                title="Varify Otp"
                isLoading={isLoading}
                onPress={varifyOTPHandler}
                isLoadingText="Please wait..."
              />
            </>
          )}
          {isEmailVarified ? (
            <>
              <InputImage
                imgUrl={require('../assets/lock.png')}
                placeHolder={'Enter New Password'}
                alt="Password Img"
                name="password"
                // secureTextEntry={true}
                value={inputValue?.password}
                onChangeText={value => onChangeHandler('password', value)}
              />

              {inputValue?.profileImage && (
                <Image
                  size={300}
                  source={{
                    uri: inputValue.profileImage,
                  }}
                  alt="Your Image"
                />
              )}
              <Buttons
                // mb={40}
                title="Continue"
                isLoading={isLoading}
                onPress={formSubmitHandler}
                isLoadingText="Please wait..."
              />
            </>
          ) : (
            !isOtpSend && (
              <Buttons
                // mb={40}
                title="Varify"
                isLoading={isLoading}
                onPress={varifyHandler}
                isLoadingText="Please wait..."
              />
            )
          )}
        </VStack>
      </ScrollView>
    </View>
  );
};

export default ForgetPassword;
