import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {throttle} from 'lodash';
import {useAppFeature} from '../Context/AppFeatureContext';
import {SHOW_TOAST} from '../Constant/AppConstant';

const CameraComponets = ({
  cameraType,
  cameraRef,
  setBarcodeData,
  takePicture,
  setShowModal,
  setisBarcode,
}) => {
  const [isNotVarifiy, setIsNotVarifiy] = useState(false);
  const {appFeatureDispatch} = useAppFeature();
  useEffect(() => {
    if (isNotVarifiy) {
      setTimeout(() => {
        setIsNotVarifiy(false);
      }, 5000);
    }
    return () => {};
  }, [isNotVarifiy]);

  const barcodeDetect = async ({barcodes}) => {
    try {
       if (barcodes[0]) {
        if (/^[a-zA-Z]{2,7}\d{3,8}$/.test(barcodes[0]?.data)) {
          return await saveBarcodeImage(barcodes[0]?.data);
        } else {
          if (!isNotVarifiy) {
            setIsNotVarifiy(true);
            appFeatureDispatch({
              type: SHOW_TOAST,
              payload: {
                visiblity: true,
                description:
                  'Oops! The scanned ID card format seems to be incorrect or not recognized. Please ensure that the scanned ID card follows the required format and try again. If you continue to experience issues, feel free to contact our support team for assistance',
                title: 'Scanned ID Card Format Issue',
                status: 'error',
              },
            });
            setShowModal(false);
            setisBarcode(false);
          }
        }
      }
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
    <>
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
      </View>
    </>
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
    height: 350,
  },
});

export default CameraComponets;
