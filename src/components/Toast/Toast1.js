import React from 'react';
import {View} from 'react-native';
import {useTheme, Text, Button} from 'react-native-paper';

const Toast1 = ({
  id,
  status,
  variant,
  title,
  description,
  toast,
  onDismiss,
  ...rest
}) => {
  const {colors} = useTheme();

 
  return (
    <View
      style={{
        maxWidth: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
      }}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', maxWidth: '90%'}}>
            <Text
              variant="titleLarge"
              style={{
                fontWeight: 'bold',
                marginRight: 8,
                color: colors.toastInfo,
              }}>
              ⓘ
            </Text>
            <Text
              variant="titleLarge"
              style={{
                color: colors.toastBlack,
                fontWeight: 'bold',
              }}>
              {title}
            </Text>
          </View>

          <Button onPress={onDismiss} rippleColor="#6B7280">
            <Text
              variant="titleLarge"
              style={{
                color: '#353535',
              }}>
              X
            </Text>
          </Button>
        </View>
        <Text
          style={{
            marginTop: 5,
            color: colors.toastBlack,
          }}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default Toast1;
