import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

const ScreenWraper = ({children}) => {
  const {colors} = useTheme();

  return (
    <View flex={1} backgroundColor={colors.pGrayWhite}>
      {children}
    </View>
  );
};

export default ScreenWraper;

const styles = StyleSheet.create({});
