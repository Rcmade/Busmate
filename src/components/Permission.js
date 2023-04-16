import React from 'react';
import {Image, ScrollView, Text, View} from 'native-base';
import Buttons from './Buttons';

const Permission = ({title, subtitle, details, img, onPress}) => {
  return (
    <View w="full" h="full" px="2" backgroundColor="muted.50">
      <View w="full" h="30%">
        <Image
          source={img}
          position={'relative'}
          bottom="16"
          w="full"
          alt="Location Image"
        />
      </View>
      <View
        // backgroundColor={'red.200'}
        position={'relative'}
        pt="9"
        w="full"
        mb="2"
        h="10%">
        <Text
          textAlign={'center'}
          fontWeight={'semibold'}
          color="teal.700"
          fontSize={'2xl'}>
          {title}
        </Text>
      </View>

      <ScrollView
        // backgroundColor={'red.100'}
        position={'relative'}
        w="full"
        px="2"
        h="50%">
        <Text
          textAlign={'center'}
          fontWeight={'semibold'}
          color="gray.600"
          fontSize={'lg'}>
          {subtitle}
        </Text>
        <Text
          mt="1"
          textAlign={'center'}
          w="full"
          fontWeight={'semibold'}
          color="gray.400"
          fontSize={'lg'}>
          {details}
        </Text>
      </ScrollView>

      <View w="full" h="10%">
        <Buttons title="Go To Setting" onPress={onPress} />
      </View>
    </View>
  );
};

export default React.memo(Permission);
