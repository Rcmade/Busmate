import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';
import dataModifyService from '../Utils/services/dataModifyService';

const AppUpdateComponent = ({
  colors,
  updateTitle,
  updateLink,
  updateDescription,
  setNewAppUpdate,
  hardUpdate,
}) => {
  const openURL = () => {
    Linking.openURL(updateLink).catch(err =>
      appFeatureDispatch({
        type: SHOW_TOAST,
        payload: {
          visiblity: true,
          description: JSON.stringify(err),
          title: 'Error',
          status: 'error',
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.box,
          {
            backgroundColor: colors.darkBlueLightGray,
            borderColor: colors.pWhiteBlue,
          },
        ]}>
        <View>
          <Image
            source={require('../assets/logoTransparent.png')}
            style={[styles.logo]}
            alt="Your Bus Is Here"
          />
        </View>
        <View style={{padding: 1}}>
          <Text
            style={[
              styles.title,
              {
                color: colors.darkBlueGray,
              },
            ]}>
            {updateTitle}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: colors.grayBlack, // '#C0DFE1',
              },
            ]}>
            {dataModifyService.removeBackSlashN(updateDescription)}
          </Text>

          <View style={styles.btns}>
            {!hardUpdate && (
              <Button
                mode="outlined"
                onPress={() =>
                  setNewAppUpdate({
                    isUpdateAvailable: false,
                  })
                }>
                Later
              </Button>
            )}
            <Button icon="download" mode="contained" onPress={openURL}>
              Update
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AppUpdateComponent;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 4,
    top: 64,
    minHeight: '15%',
    margin: 'auto',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 35,
  },

  box: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: 10,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
  },

  logo: {
    width: 50,
    height: 50,
    marginTop: 10,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },

  description: {
    color: 'red',
    maxWidth: '95%',
    fontSize: 13,
  },

  btns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
});
