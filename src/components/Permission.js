import React from 'react';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import LgButton from './Buttons/LgButton';

const Permission = ({title, subtitle, details, img, instruction, onPress}) => {
  const {colors} = useTheme();
  return (
    <ScrollView style={{paddingHorizontal: 4}}>
      <View justifyContent="center" alignItems="center">
        <Image style={styles.image} source={img} alt="Show" />
      </View>

      <View alignItems="center">
        <Text
          // style={[styles.title, {color: colors.pGrayWhite}]}
          style={[
            styles.title,
            {
              color: colors.sGrayYellow,
            },
          ]}
          variant="titleLarge">
          {title}
        </Text>
      </View>

      <View alignItems="center">
        <Text
          // style={[styles.title, {color: colors.pGrayWhite}]}
          style={[
            styles.subtitle,
            {
              color: colors.pWhiteBlue,
              // fontSize: 16,
            },
          ]}
          variant="titleLarge">
          {instruction}
        </Text>
      </View>

      <View alignItems="center">
        <Text
          // style={[styles.title, {color: colors.pGrayWhite}]}
          style={[
            styles.subtitle,
            {
              color: colors.lightDarkGray,
              // fontSize: 16,
            },
          ]}
          variant="titleLarge">
          {subtitle}
        </Text>
      </View>

      {/* <View alignItems="center">
        <Text
          // style={[styles.title, {color: colors.pGrayWhite}]}
          style={[
            styles.subtitle,
            {
              color: colors.pBlackWhite,
              // fontSize: 16,
            },
          ]}
          variant="titleLarge">
          {details}
        </Text>
      </View> */}

      <View marginVertical={50} paddingHorizontal={10} style={styles.getWrap}>
        <LgButton title="Go To Setting" onPress={onPress} />
      </View>
    </ScrollView>
  );
};

export default React.memo(Permission);

const styles = StyleSheet.create({
  // image: {
  //   width: 180,
  //   height: 180,
  // },

  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },

  title: {
    fontWeight: 'bold',
  },
});
