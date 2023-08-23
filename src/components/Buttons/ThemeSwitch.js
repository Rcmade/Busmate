import {Image, StyleSheet, TouchableOpacity, View, Switch} from 'react-native';
import React, {useState} from 'react';
import {Text, useTheme} from 'react-native-paper';
import {useAppFeature} from '../../Context/AppFeatureContext';
import {TOGGLE_THEME} from '../../Constant/AppConstant';

const ThemeSwitch = ({single}) => {
  const {appFeatureState, appFeatureDispatch} = useAppFeature();
  const isEnabled = appFeatureState.theme === 'dark' ? true : false;
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <Text
        variant="labelLarge"
        style={{
          color: colors.pBlackWhite,
        }}>
        {single && (isEnabled ? 'On' : 'Off')}
      </Text>
      <Switch
        trackColor={{false: 'black', true: 'black'}}
        thumbColor={colors.sYellow}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          appFeatureDispatch({
            type: TOGGLE_THEME,
            payload: appFeatureState.theme === 'light' ? 'dark' : 'light',
          });
        }}
        value={isEnabled}
        style={{
          shadowColor: 'red',
          elevation: 100,
        }}
      />
    </View>
  );
};

export default ThemeSwitch;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  onOff: {
    // color: theme.colors.primaryWhite,
  },
});
