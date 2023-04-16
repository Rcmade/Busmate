import React from 'react';
import {StyleSheet, View} from 'react-native';

import {RNCamera} from 'react-native-camera';

const CameraComponets = ({
  cameraType,
  cameraRef,
  setBarcodeData,
  takePicture,
}) => {
  const barcodeDetect = async ({barcodes}) => {
    try {
      // console.log({barcodes: barcodes[0]?.data});
      barcodes[0] &&
        /^[a-zA-Z]{2,3}\d{5,8}$/.test(barcodes[0]?.data) &&
        (await saveBarcodeImage(barcodes[0]?.data));
    } catch (error) {
      console.log({error});
    }
  };

  const saveBarcodeImage = async barcodeId => {
    setBarcodeData({barcodeId});
    await takePicture('barcode', barcodeId);
    // console.log({c: barcodeId});
    return;
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={cameraType}
        // flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        onFacesDetected={a => {
          // console.log(a);
        }}
        onGoogleVisionBarcodesDetected={barcodeDetect}
      />
      {/* <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          <Text style={{fontSize: 14}}> SNAP </Text>
        </TouchableOpacity>
      </View> */}

      {/* {base64Icon && (
        <Image
          style={{
            width: 300,
            height: 300,
            resizeMode: 'contain',
            borderWidth: 1,
            borderColor: 'red',
          }}
          source={{
            uri: base64Icon,
          }}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
  },
});

export default CameraComponets;
