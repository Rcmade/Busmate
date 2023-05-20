import React from 'react';
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Radio,
  Center,
  FlatList,
  ScrollView,
} from 'native-base';
import {useState} from 'react';

const TermsAndCondition = () => {
  const [showModal, setShowModal] = useState(false);
  const data = [
    {
      id: '1',
      condition:
        'By downloading and using the bus tracking app, you agree to these terms and conditions.',
    },
    {
      id: '2',
      condition:
        'The bus tracking app is designed to allow users to track the location of their college bus in real time.',
    },

    {
      id: '3',
      condition:
        'To use the app, you must allow the app to access your location data.',
    },

    {
      id: '4',
      condition:
        'Your location data will be stored on our server and will be shared with other users who are also using the app to track the location of their college bus.',
    },
    {
      id: '5',
      condition:
        'We will only store your location data for a maximum of five days, after which it will be deleted from our server.',
    },
    {
      id: '6',
      condition:
        'We do not share any of your personal data, including your email address, with any third parties at any cost. We respect your privacy and take data protection seriously. Our commitment to keeping your personal information confidential is in compliance with all applicable laws and regulations.',
    },
    {
      id: '7',
      condition:
        'The app may use data from your device, including your location data and other information, to provide you with a better user experience and to improve the app.',
    },
    {
      id: '8',
      condition:
        'We reserve the right to modify, update, or discontinue the app at any time, without prior notice.',
    },
    {
      id: '9',
      condition:
        'The app is provided "as is" and we make no warranties or representations of any kind, express or implied, including but not limited to warranties of merchantability or fitness for a particular purpose.',
    },
    {
      id: '10',
      condition:
        'We will not be liable for any damages, including but not limited to direct, indirect, incidental, or consequential damages, arising from your use of the app',
    },
    {
      id: '11',
      condition:
        'You agree to indemnify and hold us harmless from any claims, damages, or other liabilities arising from your use of the app.',
    },
    {
      id: '12',
      condition:
        'These terms and conditions constitute the entire agreement between you and us regarding the use of the bus tracking app.',
    },
    {
      id: '13',
      condition:
        'If any provision of these terms and conditions is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.',
    },
    {
      id: '14',
      condition:
        'These terms and conditions are governed by the laws of [insert location] and any disputes arising from your use of the app will be resolved in accordance with those laws.',
    },
    {
      id: '15',
      condition:
        'We may update these terms and conditions from time to time, and your continued use of the app after any such updates constitutes your acceptance of the updated terms and conditions.',
    },
    {
      id: '16',
      condition:
        'If you have any questions or concerns about these terms and conditions, please contact us at support@busmate.com.',
    },
  ];

  return (
    <Center w="full" h="full">
      {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        w="full"
        h="full"
        size="full">
        <Modal.Content h="full">
          <Modal.Header>How does this app work</Modal.Header>
          <Modal.Body h="full">
            {data.map(d => {
              return (
                <HStack key={d.id} alignItems="center">
                  <Text color="coolGray.800" pr="1" bold>
                    {d.id}
                  </Text>
                  <Text fontSize="xs" color="coolGray.800">
                    {d.condition}
                  </Text>
                </HStack>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal(true);
              }}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default TermsAndCondition;
