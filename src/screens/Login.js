import React, {useEffect, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';

import {
  Center,
  VStack,
  Text,
  View,
  ScrollView,
  useToast,
  HStack,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Buttons from '../components/Buttons';
import Toast1 from '../components/Toast/Toast1';
import {loginRoute} from '../server';
import InputImage from '../components/InputImage';
import {isLoggedIn, userData} from '../Store/Reducers/authUser';
import {useDispatch, useSelector} from 'react-redux';
import TermsAndCondition from './TermsAndCondition';

const Login = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState({});

  const userStateData = useSelector(state => state.authUser);

  useEffect(() => {
    if (userStateData?.user?.isAuthenticated === false) {
      navigation.dispatch(StackActions.replace('Wait'));
    } else if (userStateData?.user?.isAuthenticated === true) {
      navigation.dispatch(StackActions.replace('Home'));
    }
    return () => {};
  }, []);

  const onChangeHandler = (filed, value) => {
    return setInputValue(pre => {
      return {
        ...pre,
        [filed]: value,
      };
    });
  };

  const formSubmitHandler = async () => {
    setIsLoading(true);
    const {password, email} = inputValue;

    if (!password || !email) {
      setIsLoading(false);
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
      try {
        const {data} = await loginRoute({email, password});
        // console.log({data});

        if (data?.user) {
          // console.log('Inside Login', data?.user.isAuthenticated);
          dispatch(isLoggedIn(true));
          dispatch(userData({user: data.user}));

          if (data?.user?.isAuthenticated === false) {
            navigation.dispatch(StackActions.replace('Wait'));
          } else if (data?.user?.isAuthenticated === true) {
            navigation.dispatch(StackActions.replace('Home'));
          }
        } else if (data?.error) {
          console.log({data});
          return toast.show({
            render: ({id}) => {
              return (
                <Toast1
                  description={data?.error}
                  title="Error"
                  id={id}
                  variant="left-accent"
                  toast={toast}
                  status="error"
                />
              );
            },
          });
        }
      } catch (error) {
        console.log('errorerror', error);
        return toast.show({
          render: ({id}) => {
            return (
              <Toast1
                description={error?.message}
                title="Current"
                id={id}
                variant="left-accent"
                toast={toast}
                status="error"
              />
            );
          },
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View h="full" backgroundColor={'white'}>
      <ScrollView h="100%">
        <VStack
          space={4}
          w="100%"
          maxW="100%"
          h="full"
          mx="auto"
          p="5%"
          alignItems="center"
          backgroundColor={'#ffff'}>
          <Center>
            <Text fontSize="5xl" fontWeight={'bold'} color="darkBlue.800">
              Login
            </Text>
          </Center>

          <InputImage
            imgUrl={require('../assets/email.png')}
            placeHolder={'Email or CardId'}
            alt="Email Img"
            autoComplete="email"
            name="email"
            value={inputValue?.email}
            onChangeText={value => onChangeHandler('email', value)}
            autoCompleteType="email"
            textContentType="emailAddress"
          />
          <InputImage
            imgUrl={require('../assets/lock.png')}
            placeHolder={'Password'}
            alt="Password Img"
            name="password"
            // secureTextEntry={true}
            value={inputValue?.password}
            onChangeText={value => onChangeHandler('password', value)}
          />

          <Buttons
            title="Login"
            isLoading={isLoading}
            onPress={formSubmitHandler}
            isLoadingText="Please wait..."
          />

          <HStack w="full" space={2}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text color="blue.600" p={'2'} fontSize="lg" fontWeight="bold">
                Forget Password
              </Text>
            </TouchableOpacity>
          </HStack>

          <HStack w="full" alignItems={'center'}>
            <Text color="black" pl={'2'} fontSize="sm" fontWeight="medium">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text color="blue.600" p={'2'} fontSize="lg" fontWeight="bold">
                SignUp
              </Text>
            </TouchableOpacity>
          </HStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default Login;
