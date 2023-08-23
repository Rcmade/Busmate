import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import React, {memo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';

const GoogleButton = ({
  title,
  isLoading,
  onPress,
  isLoadingText,
  imgUrl,
  ...event
}) => {
  const {colors} = useTheme();

  return (
    <>
      <TouchableRipple onPress={onPress} {...event} rippleColor="#6B7280">
        <View
          style={{
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.pBlackWhite,
            backgroundColor: colors.pGrayWhite,
            elevation: 5,
            padding: 10,
            gap: 10,
          }}>
          <Image
            source={imgUrl}
            alt={'Google'}
            style={{width: 40, height: 40, marginRight: 5}}
            resizeMethod="resize"
          />
          <Text style={{color: colors.pBlackWhite}}>{title}</Text>
        </View>
      </TouchableRipple>
    </>
  );
};

export default memo(GoogleButton);
