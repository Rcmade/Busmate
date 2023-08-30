import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';

// import Buttons from '../../components/Buttons/Buttons';
import Modal1 from '../../components/Modals/Modal1';
import {RNCamera} from 'react-native-camera';
import {
  ImageCompressor,
  getStorage,
  removeStorage,
  setStorage,
} from '../../Utils/storage.js';
import Toast1, {useCustomToast} from '../../components/Toast/Toast1';
import {sendOtp, signUpRoute, varifyOtp} from '../../Server';
import InputImage from '../../components/InputImage';
import {useAuthUser} from '../../Context/AuthUserContext';
import {SET_IS_LOGGED_IN, SET_USER_DATA} from '../../Constant/UserConstant';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '../../Config/ClientConfig';
import GoogleButton from '../../components/GoogleButton';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import {Text, useTheme} from 'react-native-paper';

import LgButton from '../../components/Buttons/LgButton';
import {SHOW_TOAST} from '../../Constant/AppConstant';
import {useAppFeature} from '../../Context/AppFeatureContext';

const Signup = () => {
  const [isBarcode, setisBarcode] = useState(false);
  const [isSelfie, setisSelfie] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const {authUserState, authUserDispatch} = useAuthUser();
  const {appFeatureDispatch, appFeatureState} = useAppFeature();

  const [inputValue, setInputValue] = useState({
    name: null,
    photo: null,
    password: null,
    email: null,
    busNumber: null,
    idCard: null,
    profileImage: null,
  });

  // If User Exist then redirect to the Home Page
  useEffect(() => {
    setShowModal(true);
    if (authUserState?.user?.isAuthenticated === false) {
      navigation.dispatch(StackActions.replace('Wait'));
    } else if (authUserState?.user?.isAuthenticated === true) {
      navigation.dispatch(StackActions.replace('Home'));
    }
    return () => {};
  }, []);

  //  Get Email Address , User Name , User Image from user
  const googleSignSubmit = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        setInputValue(pre => ({
          ...pre,
          ...userInfo?.user,
          idToken: userInfo.idToken,
        }));

        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.log('Error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // console.log('Operation is in progress already');

        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description: 'Operation is in progress already',
            title: 'Google Authenticator',
            status: 'error',
          },
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description:
              'Yout play services not available or outdated, try to update your play services',
            title: 'Google Play Services',
            status: 'error',
          },
        });
        // console.log('Play services not available or outdated');
      } else {
        // console.log('Some other error happened');
      }
    }
  };

  // it takes picture of user and id card image
  const takePicture = async (type, cameraData) => {
    if (cameraRef.current) {
      const options = {quality: 1, base64: true};
      // It is a direct refrence of camera
      const data = await cameraRef.current.takePictureAsync(options);
      // console.log({type, cameraData, data: data.uri})
      if (cameraData && type === 'barcode') {
        // console.log('inside click barcode')
        await setStorage(type, {barcodeData: cameraData, uri: data.uri});
        // console.log('save done')
        setInputValue(pre => {
          return {
            ...pre,
            idCard: cameraData,
          };
        });

        setisBarcode(false);
      } else if (type === 'selfie') {
        // console.log('inside click selfie')
        await setStorage(type, {uri: data.uri});
        // console.log('save done')
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

  // send the data to the server
  const formSubmitHandler = async () => {
    setIsLoading(true);
    const getBarcodeData = !appFeatureState.isServiceAvailable.temprary
      ? await getStorage('barcode')
      : getProfileImage;
    const getProfileImage = await getStorage('selfie');
    const {name, password, email, busNumber, profileImage, photo} = inputValue;

    const idCard = !appFeatureState.isServiceAvailable.temprary
      ? inputValue.idCard
      : inputValue.email;
    try {
      if (
        !name ||
        !email ||
        +busNumber >= 21 ||
        !busNumber ||
        !profileImage ||
        !idCard ||
        !getBarcodeData.uri ||
        !getProfileImage
      ) {
        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description: 'All Fields Are Required',
            title: 'Please Fill All The Fields',
            status: 'error',
          },
        });

        return;
      } else {
        const formData = new FormData();
        formData.append('imgs', {
          name: 'profileImage',
          filename: name,
          uri: await ImageCompressor(profileImage),
          type: 'image/jpeg',
        });

        if (!appFeatureState.isServiceAvailable.temprary) {
          formData.append('imgs', {
            name: 'idImage',
            filename: idCard,
            uri: await ImageCompressor(getBarcodeData.uri),
            type: 'image/jpeg',
          });
        }
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('idCard', idCard);
        formData.append('busNumber', busNumber);
        formData.append('photo', photo);
        const {data} = await signUpRoute(formData);

        if (data?.user) {
          // console.log('Inside SignUp', data?.user.isAuthenticated);
          authUserDispatch({type: SET_IS_LOGGED_IN, payload: true});
          authUserDispatch({type: SET_USER_DATA, payload: data.user});
          navigation.dispatch(StackActions.replace('Wait'));
        } else if (data?.error) {
          appFeatureDispatch({
            type: SHOW_TOAST,
            payload: {
              visiblity: true,
              description: data?.error,
              title: 'Error',
              status: 'error',
            },
          });

          return;
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  // const varifyHandler = async () => {
  //   setIsLoading(true);
  //   try {
  //     const {name, email} = inputValue;
  //     if (!name || !email) {
  //       showToast({
  //         description: 'All Fields Are Required',
  //         title: 'Please Fill All The Fields',
  //         variant: 'left-accent',
  //       });
  //       return;
  //     } else {
  //       const {data} = await sendOtp({name, email});
  //       if (data?.error) {
  //         showToast({
  //           description: data?.error,
  //           title: 'Error',
  //           variant: 'left-accent',
  //         });
  //         return;
  //       } else {
  //         await setStorage('otpHash', data?.hash);
  //         setisOtpSend(true);

  //         showToast({
  //           description: '',
  //           title: data.message,
  //           variant: 'left-accent',
  //         });
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.log({error});
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const varifyOTPHandler = async () => {
  //   setIsLoading(true);
  //   const getOtp = await getStorage('otpHash');
  //   try {
  //     const {name, email, otp} = inputValue;
  //     if (!name || !email || !otp) {
  //       showToast({
  //         description: 'All Fields Are Required',
  //         title: 'Please Fill All The Fields',
  //         variant: 'left-accent',
  //       });
  //       return;
  //     } else {
  //       const {data} = await varifyOtp({email, otp, hash: getOtp});
  //       if (data?.error) {
  //         showToast({
  //           description: data.error,
  //           title: data.error,
  //           variant: 'left-accent',
  //         });
  //         return;
  //       } else {
  //         await removeStorage('otpHash');
  //         setisOtpSend(false);
  //         setisEmailVarified(true);

  //         showToast({
  //           description: '',
  //           title: data.message,
  //           variant: 'left-accent',
  //         });
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const {colors} = useTheme();

  return (
    <ScreenWraper>
      <ScrollView height="100%">
        <View paddingBottom={30}>
          <Text
            variant="displaySmall"
            style={{
              color: colors.darkBlueGray,
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 40,
            }}>
            Sign Up
          </Text>

          {inputValue?.email ? (
            <>
              {/* User name Input */}
              <InputImage
                imgUrl={require('../../assets/name.png')}
                colors={colors}
                placeHolder={'Name'}
                alt="Name Img"
                readOnly={true}
                name="name"
                value={inputValue?.name}
              />
              {/* User email Input */}
              <InputImage
                imgUrl={require('../../assets/email.png')}
                colors={colors}
                placeHolder={'Email'}
                alt="Email Img"
                readOnly={true}
                name="email"
                value={inputValue?.email}
              />
              {/* User BusNumber Input */}
              <InputImage
                imgUrl={require('../../assets/bus.png')}
                colors={colors}
                placeHolder={'Enter Your Bus Number'}
                alt="Bus Img"
                keyboardType="numeric"
                name="busNumber"
                value={inputValue?.busNumber}
                // onChange={onChangeHandler}
                onChangeText={value => onChangeHandler('busNumber', value)}
                maxLength={2}
              />
              {/* User IdCard Input */}
              {!appFeatureState.isServiceAvailable.temprary && (
                <TouchableOpacity
                  onPress={() => {
                    setisBarcode(true);
                    setShowModal(!showModal);
                  }}>
                  <InputImage
                    imgUrl={require('../../assets/email.png')}
                    colors={colors}
                    placeHolder={'Scan Your Id card'}
                    readOnly={true}
                    alt="Id Img"
                    name="idCard"
                    value={inputValue?.idCard}
                    // onChange={onChangeHandler}
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
              )}
              {/* User Profile Input */}
              <TouchableOpacity
                onPress={() => {
                  setisSelfie(true);
                  setShowModal(!showModal);
                }}>
                <InputImage
                  imgUrl={require('../../assets/profile.png')}
                  colors={colors}
                  placeHolder={'Click Your Profile Image'}
                  alt="Id Img"
                  readOnly={true}
                  name="profileImage"
                  value={inputValue?.profileImage}
                  // onChange={onChangeHandler}
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
              {/* User Profile Image */}
              {inputValue?.profileImage && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                  <Image
                    width={300}
                    height={300}
                    source={{
                      uri: inputValue.profileImage,
                    }}
                    alt="Your Image"
                  />
                </View>
              )}
              <View paddingHorizontal={20}>
                <LgButton
                  // mb={40}
                  title="Continue"
                  loading={isLoading}
                  onPress={formSubmitHandler}
                />
              </View>
            </>
          ) : (
            <View w="full">
              <GoogleButton
                onPress={googleSignSubmit}
                title="SignUp With Google"
                imgUrl={require('../../assets/google.png')}
                colors={colors}
              />
            </View>
          )}
          <View
            alignItems={'center'}
            justifyContent="center"
            marginTop={10}
            gap={8}
            flexDirection="row">
            <Text style={{color: colors.pBlackWhite}}>Joined us before?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                variant="bodyLarge"
                style={{color: colors.pWhiteBlue, fontWeight: 'bold'}}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWraper>
  );
};

export default Signup;
