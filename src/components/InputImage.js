import React, {memo} from 'react';
import {HStack, Input, Image, Icon, Pressable} from 'native-base';

const InputImage = ({
  imgUrl,
  placeHolder,
  alt,
  name,
  value,
  onChange,
  ...inp
}) => {
  //

  const [show, setShow] = React.useState(false);

  return (
    <>
      <HStack space={3} my={2} justifyContent="center">
        {imgUrl && (
          <Image
            // w="10%"
            size={12}
            source={imgUrl}
            alt={alt}
            resizeMethod="resize"
          />
        )}
        <Input
          placeholderTextColor="trueGray.400"
          variant="underlined"
          w="90%"
          fontSize={20}
          fontWeight={'bold'}
          placeholder={placeHolder}
          // color="darkBlue.800"
          name={name}
          value={value}
          onChange={onChange}
          minLength={3}
          type={name === 'password' ? (show ? 'text' : 'password') : 'text'}
          InputRightElement={
            name === 'password' ? (
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={
                    // <MaterialIcons
                    //   name={show ? 'visibility' : 'visibility-off'}
                    // />
                    <Image
                      source={
                        show
                          ? require('../assets/visibility.png')
                          : require('../assets/not-visible.png')
                      }
                      alt="Show"
                    />
                  }
                  size={'7'}
                  // color="black"
                  // mr="2"
                />
              </Pressable>
            ) : null
          }
          {...inp}
        />
      </HStack>
    </>
  );
};

export default memo(InputImage);
