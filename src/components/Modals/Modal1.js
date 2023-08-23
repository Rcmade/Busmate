import {View} from 'react-native';
import CameraComponets from '../CameraComponets';
import {Modal, Portal} from 'react-native-paper';
import {Button, Card, Text} from 'react-native-paper';

const Modal1 = ({
  showModal,
  setShowModal,
  title,
  barcodeData,
  cameraType,
  setBarcodeData,
  cameraRef,
  isLoading,
  takePicture,
  setisBarcode,
  setisSelfie,
  isSelfie,
}) => {
  return (
    <>
      <Portal
        style={{
          zIndex: 1,
        }}>
        <Modal
          visible={showModal}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onDismiss={() => {
            setShowModal(false);
            setisBarcode(false);
            setisSelfie(false);
          }}>
          <View>
            <Card style={{paddingHorizontal: 34}}>
              <Card.Content>
                <Text variant="titleLarge">{title}</Text>
                <View
                  style={{
                    height: 350,
                  }}>
                  <CameraComponets
                    cameraType={cameraType}
                    setBarcodeData={setBarcodeData}
                    cameraRef={cameraRef}
                    takePicture={takePicture}
                    setShowModal={setShowModal}
                    setisBarcode={setisBarcode}
                  />
                </View>
              </Card.Content>
              <Card.Actions>
                {barcodeData && <Text>{barcodeData}</Text>}
                <Button onPress={() => setShowModal(false)}>Cancel</Button>
                <Button
                  loading={isLoading}
                  onPress={async () => {
                    setisBarcode(false);
                    if (isSelfie) {
                      await takePicture('selfie', null);
                    }
                    setShowModal(false);
                    setisSelfie(false);
                  }}>
                  Save
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default Modal1;
