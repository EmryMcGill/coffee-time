import { ChevronDown } from 'lucide-react-native'
import { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'

const PickerInput = ({icon, placeholder, value, options}) => {

    const [visible, setVisible] = useState(false);

    const onClose = () => {
        setVisible(false);
    }

  return (
    <Pressable 
        style={[styles.container]} 
        onPress={() => setVisible(true)}>
        {icon}
        <Text style={{color: theme.colors.text, fontSize: hp(2.2), flex: 1}}>
            {value || placeholder}
        </Text>
        <ChevronDown size={24} color={theme.colors.text} />

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
    </Pressable>
  )
}

export default PickerInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    },
    welcomeText: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold
    },
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
})