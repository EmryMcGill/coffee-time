import { Picker } from '@react-native-picker/picker'
import { ChevronDown, X } from 'lucide-react-native'
import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Button from './Button'

const PickerInput = ({icon, placeholder, value, setValue, options, title, type}) => {

    const [visible, setVisible] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isTimer, setIsTimer] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const range = (start, end) => Array.from({length: end - start + 1}, (_, i) => start + i);

    const timer = () => {
        if (isTimer) {
            console.log('timer stopped');
            setIsTimer(false);
            clearInterval(intervalId);
            return;
        }
    
        setIsTimer(true);
        console.log('timer started');
    
        const interval = setInterval(() => {
            setValue(prev => {
            const newValue = prev + 1;
            console.log('timer: ', newValue); // Log the actual new value
            
            if (newValue >= 1000) {
                clearInterval(interval);
                setIsTimer(false);
            }
            
            return newValue;
            });
        }, 1000);
    
        setIntervalId(interval);
    }

  return (
    <Pressable 
        style={[styles.container]} 
        onPress={() => setVisible(true)}>
        {icon}
        <Text style={[{fontSize: hp(2.2), flex: 1}, value ? {color: theme.colors.text} : {color: theme.colors.textLight} ]}>
            {value || placeholder}
        </Text>
        <ChevronDown size={24} color={theme.colors.text} />

        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.modalView, {maxHeight: isSearch ? hp(90) : hp(60)}]}>
                    {/* Handle bar */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <X size={24} color={theme.colors.text} onPress={() => setVisible(false)} />
                    </View>

                    
                    {/* Content */}
                    {type === 'options' ?
                    <ScrollView style={styles.content} keyboardShouldPersistTaps='always'>
                        <TextInput
                            style={[styles.option, {fontSize: hp(2.5), color: theme.colors.text}]}
                            placeholder="Search..."
                            onChangeText={text => {
                                // Handle search logic
                            }}
                            onFocus={() => setIsSearch(true)}
                            onBlur={() => setIsSearch(false)}
                            placeholderTextColor={theme.colors.textLight}
                        />
                        {options?.map((option, index) => (
                            <Pressable 
                                key={index} 
                                onPress={() => {
                                    setVisible(false);
                                    setValue(option);
                                }}
                                style={[styles.option, {borderBottomWidth: index === options.length - 1 ? 0 : 0.5, marginBottom: index === options.length - 1 ? 20 : 0}]}
                            >
                                <Text style={{fontSize: hp(2.5), color: theme.colors.text, fontWeight: theme.fonts.medium}}>
                                    {option}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                    :
                    <View>
                        <Picker
                            selectedValue={value || 1}
                            onValueChange={(itemValue, itemIndex) => {
                                setValue(itemValue);
                                console.log(itemValue);
                            }}
                            itemStyle={{ fontSize: 20, color: 'black' }}
                        >
                            {range(1, 1000).map((number) => (
                            <Picker.Item
                                key={number}
                                label={number.toString()}
                                value={number}
                            />
                            ))}
                        </Picker>
                        <Button 
                            title={isTimer ? 'Stop Timer' : 'Start Timer'} 
                            buttonStyle={{marginBottom: 30, marginHorizontal: 20}} 
                            onPress={timer}
                        />
                    </View>
                    }
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
        gap: 12,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalHeader: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: theme.colors.textLight,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },  
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    },
    
    defaultText: {
        fontSize: 16,
        marginTop: 20,
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: theme.colors.text,
        paddingHorizontal: 20,
    },
})