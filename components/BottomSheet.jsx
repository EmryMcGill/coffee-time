import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { hp, wp } from '../helpers/common';

const BottomSheet = () => {

    const [visible, setVisible] = useState(true);
    
    const onClose = () => {
        setVisible(false);
    }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalView}>
              {/* Handle bar */}
              <View style={styles.handle} />
              
              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.defaultText}>BottomSheet Component</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: hp(80),
    minHeight: hp(25),
    width: wp(100),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  defaultText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});