import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, Text, useTheme} from 'react-native-paper';
import {useAuthUser} from '../../Context/AuthUserContext';
import {useNavigation} from '@react-navigation/native';
import InputImage from '../../components/InputImage';
import LgButton from '../../components/Buttons/LgButton';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import {updateUser} from '../../Server';
import {useAppFeature} from '../../Context/AppFeatureContext';
import {SET_USER_DATA} from '../../Constant/UserConstant';
import {SHOW_TOAST} from '../../Constant/AppConstant';

const Profile = () => {
  const navigation = useNavigation();
  const {authUserState, authUserDispatch} = useAuthUser();
  const [isUpdate, setIsUpdate] = useState(false);

  const [inputValue, setInputValue] = useState({
    name: null,
    photo: null,
    password: null,
    email: null,
    busNumber: null,
    idCard: null,
    profileImage: null,
  });
  const {appFeatureDispatch} = useAppFeature();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authUserState?.user?.idCard) {
      navigation.dispatch(StackActions.replace('Login'));
    } else {
      setInputValue(pre => ({...pre, ...authUserState?.user}));
    }
    return () => {};
  }, [authUserState]);

  const {colors} = useTheme();

  const onChangeHandler = (filed, value) => {
    if (!isUpdate) {
      setIsUpdate(true);
    }
    return setInputValue(pre => {
      return {
        ...pre,
        [filed]: value,
      };
    });
  };
  // send the data to the server
  const formSubmitHandler = async () => {
    try {
      setIsLoading(true);
      const {data} = await updateUser({
        name: inputValue.name,
        busNumber: inputValue.busNumber,
        _id: authUserState?.user?._id,
      });
      if (data?.user) {
        setIsUpdate(false);
        authUserDispatch({type: SET_USER_DATA, payload: data.user});
        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description: data?.message,
            title: 'Notification',
            status: 'error',
          },
        });
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
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

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
              marginVertical: 20,
            }}>
            Profile
          </Text>
          <View alignItems="center">
            {authUserState?.user?.photo && (
              <Avatar.Image
                size={100}
                source={{uri: authUserState?.user?.photo}}
              />
            )}
          </View>
          <InputImage
            imgUrl={require('../../assets/name.png')}
            colors={colors}
            placeHolder={'Update Your Name'}
            alt="Name Img"
            onChangeText={value => onChangeHandler('name', value)}
            name="name"
            value={inputValue?.name}
          />
          <InputImage
            imgUrl={require('../../assets/email.png')}
            colors={colors}
            placeHolder={'Email'}
            alt="Email Img"
            readOnly={true}
            name="email"
            fontSize={15}
            value={inputValue?.email}
          />
          <InputImage
            imgUrl={require('../../assets/bus.png')}
            colors={colors}
            placeHolder={'Update Your Bus Number'}
            alt="Bus Img"
            keyboardType="numeric"
            name="busNumber"
            value={inputValue?.busNumber}
            onChangeText={value => onChangeHandler('busNumber', value)}
            maxLength={2}
          />
          <InputImage
            imgUrl={require('../../assets/idCard.png')}
            colors={colors}
            placeHolder={'Id card'}
            readOnly={true}
            alt="Id Img"
            fontSize={15}
            name="idCard"
            value={inputValue?.idCard}
          />
          {isUpdate && (
            <View paddingHorizontal={20}>
              <LgButton
                // mb={40}
                title="Update"
                loading={isLoading}
                onPress={formSubmitHandler}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWraper>
  );
};

export default Profile;

const styles = StyleSheet.create({});
