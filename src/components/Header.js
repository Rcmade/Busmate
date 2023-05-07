import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  HStack,
  Text,
  Box,
  Image,
  Menu,
  Select,
  CheckIcon,
  AlertDialog,
  Button,
  Alert,
  useToast,
} from 'native-base';
import {logout, updateUser} from '../server';
import {useDispatch} from 'react-redux';
import {isLoggedIn, userData} from '../Store/Reducers/authUser';
import {useNavigation, StackActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Alerts1 from './Alerts/Alerts1';
const Header = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.authUser?.user);
  const [busNumber, setBusNumber] = useState(null);
  const sevenDayToUpdate = 1000 * 60 * 60 * 24 * 7;
  const [updateConfirm, setUpdateConfirm] = useState(false);
  const toast = useToast();

  const [isOpen, setIsOpen] = React.useState(false);

  const cancelRef = React.useRef(null);

  const timeSinceLastUpdate = Date.now() - new Date(user?.updatedAt).getTime();
  const isUpdate = sevenDayToUpdate > timeSinceLastUpdate;

  const remainDayToUpdate = Math.floor(
    (Date.now() - new Date(user?.updatedAt)) / (1000 * 60 * 60 * 24),
  );

  const totalNumOfBus = 25;
  const arrOfBus = Array.from({length: totalNumOfBus}, (_, i) => i + 1);

  const logOutHandler = async () => {
    const logOut = await logout();
    dispatch(isLoggedIn(false));
    dispatch(userData({assigned: false, previous: null, wait: null}));
    navigation.dispatch(StackActions.replace('Signup'));
  };

  const busOnChangeHander = async busNum => {
    setBusNumber(busNum);
    setIsOpen(true);
  };

  const onUpdate = async () => {
    console.log({busNumber});
    const {data} = await updateUser({
      busNumber: +busNumber,
    });
    dispatch(userData({user: data.user}));
    return setIsOpen(false);
  };

  return (
    <SafeAreaView>
      <Box safeAreaTop bg="violet.600" />
      <HStack
        bg="white"
        px="5"
        // py="-3"
        justifyContent="space-between"
        alignItems="center"
        w="100%">
        <HStack w="100%" alignItems="center" justifyContent={'space-between'}>
          <Image
            size={'12'}
            rounded={'full'}
            source={require('../assets/logo.png')}
            alt="BusMets"
          />
          {user?.busNumber && (
            <Menu
              trigger={triggerProps => {
                return (
                  <TouchableOpacity
                    accessibilityLabel="More options menu"
                    {...triggerProps}>
                    <Text fontWeight={'bold'} p="2" fontSize="2xl">
                      ☰
                    </Text>
                  </TouchableOpacity>
                );
              }}>
              {/* <Menu.Item onPress={() => navigation.navigate('ErrorLogs')}>
                <Text>Error logs</Text>
              </Menu.Item> */}

              <Menu.Item
                onPress={() => {
                  isUpdate &&
                    toast.show({
                      description: `you will not be able to update your bus number for ${
                        7 - +remainDayToUpdate || 7
                      }  days`,
                      placement: 'top',
                    });
                }}>
                <Select
                  isDisabled={isUpdate}
                  selectedValue={busNumber || String(user?.busNumber)}
                  minWidth="150"
                  defaultValue={String(user?.busNumber)}
                  accessibilityLabel="Choose Service"
                  placeholder="Choose BusNumber"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size="2" />,
                  }}
                  onValueChange={busOnChangeHander}>
                  {arrOfBus.map(a => {
                    return (
                      <Select.Item
                        key={a}
                        label={String(a)}
                        value={String(a)}
                      />
                    );
                  })}
                </Select>
              </Menu.Item>

              <Menu.Item onPress={logOutHandler}>
                <Image
                  size={'7'}
                  source={require('../assets/logout.png')}
                  alt="BusMets"
                />
                <Text>Logout</Text>
              </Menu.Item>
            </Menu>
          )}
        </HStack>
      </HStack>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <Alert w="100%" status="warning">
              <HStack space={2} w="full" alignItems="center" flexShrink={1}>
                <Alert.Icon mt="1" />
                <Text fontSize="md" color="coolGray.800">
                  Warning
                </Text>
              </HStack>
            </Alert>
          </AlertDialog.Header>
          <AlertDialog.Body>
            After update, you will not be able to update your bus number for 7
            days
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsOpen(false)}
                ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={onUpdate}>
                Update
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </SafeAreaView>
  );
};

export default Header;
