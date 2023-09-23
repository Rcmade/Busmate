import React, {memo} from 'react';
import {Image, View} from 'react-native';
import {TextInput} from 'react-native-paper';
const InputImage = ({
  imgUrl,
  placeHolder,
  alt,
  name,
  value,
  onChange,
  colors,
  fontSize,
  ...inp
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <View
        flexDirection="row"
        padding={10}
        marginVertical={5}
        gap={5}
        justifyContent="center"
        alignItems="center">
        <View style={{width: '10%'}}>
          <Image
            size={12}
            style={{
              position: 'relative',
              zIndex: 10,
              width: 40,
              height: 40,
            }}
            source={imgUrl}
            alt={alt}
            resizeMethod="resize"
          />
        </View>
        <TextInput
          style={{
            width: '90%',
            fontWeight: 'bold',
            fontSize: fontSize || 20,
            overflowX: 'scroll',
          }}
          theme={{
            colors: {
              primary: colors.pWhiteBlue,
              onSurfaceVariant: colors.pWhiteBlue,
              surfaceVariant: 'transparent',
            },
            // backgroundColor: {},
          }}
          // secureTextEntry={!show}
          secureTextEntry={name === 'password' ? (show ? false : true) : false}
          right={
            name === 'password' && (
              <TextInput.Icon
                name="no-eye"
                icon={show ? 'eye' : 'eye-off'}
                color={colors.pWhiteBlue}
                style={{
                  color: 'red',
                  // backgroundColor: 'red',
                }}
                onPress={() => setShow(!show)}
              />
            )
          }
          value={value}
          onChange={onChange}
          underlineColor={colors.pWhiteBlue}
          textColor={colors.pBlackWhite}
          mode="mode"
          // placeholderTextColor="red"
          label={placeHolder}
          placeholder=""
          backgroundColor={colors.pGrayWhite}
          {...inp}
        />
      </View>
    </>
  );
};

export default memo(InputImage);
