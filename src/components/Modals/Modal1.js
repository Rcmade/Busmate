import {Button, FormControl, Input, Modal, Text} from 'native-base';
import CameraComponets from '../CameraComponets';

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
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setisBarcode(false);
          setisSelfie(false);
        }}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{title}</Modal.Header>
          <Modal.Body>
            <CameraComponets
              cameraType={cameraType}
              setBarcodeData={setBarcodeData}
              cameraRef={cameraRef}
              takePicture={takePicture}
              setShowModal={setShowModal}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              {barcodeData && (
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  //   onPress={() => {
                  //     setShowModal(false);
                  //   }}
                >
                  {barcodeData}
                </Button>
              )}
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                  setisBarcode(false);
                  setisSelfie(false);
                }}>
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                onPress={async () => {
                  setisBarcode(false);
                  isSelfie && (await takePicture('selfie', null));
                  setShowModal(false);
                  setisSelfie(false);
                }}>
                {/* {barcodeData ? 'Click' : 'Wait'} */}
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default Modal1;
