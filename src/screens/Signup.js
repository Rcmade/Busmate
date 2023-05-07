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
  HStack,
} from 'native-base';
import Buttons from '../components/Buttons';
import Modal1 from '../components/Modals/Modal1';
import {RNCamera} from 'react-native-camera';
import {
  ImageCompressor,
  getStorage,
  removeStorage,
  setStorage,
} from '../utils/functions';
import Toast1 from '../components/Toast/Toast1';
import {sendOtp, signUpRoute, varifyOtp} from '../server';
import InputImage from '../components/InputImage';
import {isLoggedIn, userData} from '../Store/Reducers/authUser';
import {useDispatch, useSelector} from 'react-redux';

const Signup = () => {
  const [isOtpSend, setisOtpSend] = useState(false);
  const [isBarcode, setisBarcode] = useState(false);
  const [isSelfie, setisSelfie] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [isEmailVarified, setisEmailVarified] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const userStateData = useSelector(state => state.authUser);

  // If User Exist then redirect to the Home Page
  useEffect(() => {
    if (userStateData?.user?.isAuthenticated === false) {
      navigation.dispatch(StackActions.replace('Wait'));
    } else if (userStateData?.user?.isAuthenticated === true) {
      navigation.dispatch(StackActions.replace('Home'));
    }
    return () => {};
  }, []);

  const [inputValue, setInputValue] = useState({});

  // it takes picture of user and id card image
  const takePicture = async (type, cameraData) => {
    if (cameraRef.current) {
      const options = {quality: 1, base64: true};
      // It is a direct refrence of camera
      const data = await cameraRef.current.takePictureAsync(options);
      // console.log({type, cameraData, data: data.uri});
      if (cameraData && type === 'barcode') {
        // console.log('inside click barcode');
        await setStorage(type, {barcodeData: cameraData, uri: data.uri});
        // console.log('save done');
        setInputValue(pre => {
          return {
            ...pre,
            idCard: cameraData,
          };
        });

        setisBarcode(false);
      } else if (type === 'selfie') {
        // console.log('inside click selfie');
        await setStorage(type, {uri: data.uri});
        // console.log('save done');
        setInputValue(pre => {
          return {
            ...pre,
            profileImage: data.uri,
          };
        });

        setisSelfie(false);
      }
      setShowModal(false);
    }
  };

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
    const getBarcodeData = await getStorage('barcode');
    const getProfileImage = await getStorage('selfie');
    const {name, password, email, busNumber, idCard, profileImage} = inputValue;
    try {
      if (
        !name ||
        !password ||
        !email ||
        // !otp ||
        +busNumber >= 21 ||
        !busNumber ||
        !profileImage ||
        !idCard ||
        !getBarcodeData.uri ||
        !getProfileImage
      ) {
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
        const formData = new FormData();
        formData.append('imgs', {
          name: 'profileImage',
          filename: name,
          uri: await ImageCompressor(profileImage),
          type: 'image/jpeg',
        });
        formData.append('imgs', {
          name: 'idImage',
          filename: idCard,
          uri: await ImageCompressor(getBarcodeData.uri),
          type: 'image/jpeg',
        });
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('idCard', idCard);
        formData.append('busNumber', busNumber);
        // console.log({formData});
        const {data} = await signUpRoute(formData);
        console.log({data: data.user});

        if (data?.user) {
          // console.log('Inside SignUp', data?.user.isAuthenticated);
          dispatch(isLoggedIn(true));
          dispatch(userData({user: data.user}));
          navigation.dispatch(StackActions.replace('Wait'));
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
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
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
      console.log({error});
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
            <Text fontSize="5xl" fontWeight={'bold'} color="darkBlue.800">
              Signup
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
            placeHolder={'Email'}
            alt="Email Img"
            readOnly={isEmailVarified}
            autoComplete="email"
            name="email"
            autoCapitalize="none"
            value={inputValue?.email}
            onChange={onChangeHandler}
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
                onChange={onChangeHandler}
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
                placeHolder={'Password'}
                alt="Password Img"
                name="password"
                // secureTextEntry={true}
                value={inputValue?.password}
                onChange={onChangeHandler}
                onChangeText={value => onChangeHandler('password', value)}
              />
              <InputImage
                imgUrl={require('../assets/bus.png')}
                placeHolder={'Enter Your Bus Number'}
                alt="Bus Img"
                keyboardType="numeric"
                name="busNumber"
                value={inputValue?.busNumber}
                onChange={onChangeHandler}
                onChangeText={value => onChangeHandler('busNumber', value)}
                maxLength={2}
              />
              <TouchableOpacity
                onPress={() => {
                  setisBarcode(true);
                  setShowModal(!showModal);
                }}>
                <InputImage
                  imgUrl={require('../assets/idCard.png')}
                  placeHolder={'Scan Your Id card'}
                  readOnly={true}
                  alt="Id Img"
                  name="idCard"
                  value={inputValue?.idCard}
                  onChange={onChangeHandler}
                  onChangeText={value => onChangeHandler('idCard', value)}
                />
                {isBarcode && (
                  <Modal1
                    title="Scan Your Id card"
                    showModal={showModal}
                    setShowModal={setShowModal}
                    cameraType={RNCamera.Constants.Type.back}
                    barcodeData={barcodeData?.barcodeId}
                    setBarcodeData={setBarcodeData}
                    cameraRef={cameraRef}
                    takePicture={takePicture}
                    setisBarcode={setisBarcode}
                    setisSelfie={setisSelfie}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setisSelfie(true);
                  setShowModal(!showModal);
                }}>
                <InputImage
                  imgUrl={require('../assets/profile.png')}
                  placeHolder={'Click Your Profile Image'}
                  alt="Id Img"
                  readOnly={true}
                  name="profileImage"
                  value={inputValue?.profileImage}
                  onChange={onChangeHandler}
                  onChangeText={value => onChangeHandler('profileImage', value)}
                />
                {isSelfie && (
                  <Modal1
                    title="Take Your Picture"
                    showModal={showModal}
                    setShowModal={setShowModal}
                    cameraType={RNCamera.Constants.Type.front}
                    barcodeData={barcodeData?.barcodeId}
                    setBarcodeData={setBarcodeData}
                    cameraRef={cameraRef}
                    takePicture={takePicture}
                    setisBarcode={setisBarcode}
                    isSelfie={isSelfie}
                    setisSelfie={setisSelfie}
                  />
                )}
              </TouchableOpacity>
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

          <HStack space={2} alignItems={'center'}>
            <Text color="gray.400" fontSize="lg" fontWeight="bold">
              Joined us before?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text color="blue.600" p={'2'} fontSize="lg" fontWeight="bold">
                Login
              </Text>
            </TouchableOpacity>
          </HStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default Signup;
