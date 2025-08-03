import { useRouter } from 'expo-router';
import { Bean, ChevronLeft, Coffee, NotebookPen, Scale, Timer } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Input from '../../components/Input';
import PickerInput from '../../components/PickerInput';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const CreateBrew = () => {

    const router = useRouter();

    const [brewType, setBrewType] = useState('');
    const [beanType, setBeanType] = useState('');
    const [doseWeight, setDoseWeight] = useState('');
    const [yieldWeight, setYieldWeight] = useState('');
    const [brewTime, setBrewTime] = useState(null);
    const [grindSize, setGrindSize] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState(null);

    const onSubmit = async () => {
        if (brewType === '') {
            Alert.alert('Error', 'Please enter a brew type');
            return;
        }
        console.log(brewType, beanType, doseWeight, yieldWeight, brewTime, grindSize, notes, image);
    }

    return (
        <ScreenWrapper bg='white'>
            <SafeAreaView style={{flex: 1}}>
            
                {/* ScrollView with content */}
                <ScrollView
                    style={{flex: 1}}
                    automaticallyAdjustKeyboardInsets={true}
                    contentContainerStyle={styles.container}
                >

                    <PickerInput
                        icon={<Coffee size={24} color={theme.colors.text} />}
                        placeholder='Brew Type'
                        value={brewType}
                        setValue={setBrewType}
                        title='Select Brew Type'
                        type='options'
                        options={['Espresso', 'Pour Over', 'French Press', 'Aeropress', 'Cold Brew', 'Siphon', 'Moka Pot', 'Turkish Coffee', 'Nitro Cold Brew', 'Chemex', 'V60', 'Kalita Wave', 'Clever Dripper', 'Percolator', 'Steampunk', 'Syphon', 'Drip Coffee', 'Single Serve Pod', 'Nitro Coffee', 'Coffee Bag']}
                    />

                    <PickerInput
                        icon={<Bean size={24} color={theme.colors.text} />}
                        placeholder='Bean Type'
                        value={beanType}
                        type='options'
                        options={['Arabica', 'Robusta', 'Liberica', 'Excelsa', 'Blend']}
                        title='Select Bean Type'
                        setValue={setBeanType}
                    />

                    <Input
                        icon={<Scale size={24} color={theme.colors.text} />}
                        placeholder='Dose Weight (g)'
                        value={doseWeight}
                        onChangeText={setDoseWeight}
                        keyboardType='numeric'
                        returnKeyType="done"
                    />

                    <PickerInput
                        icon={<Timer size={24} color={theme.colors.text} />}
                        placeholder='Brew Time (s)'
                        title='Select Brew Time (s)'
                        value={brewTime}
                        setValue={setBrewTime}
                        type='timer'
                    />

                    <Input
                        icon={<Scale size={24} color={theme.colors.text} />}
                        placeholder='Yield Weight (g)'
                        value={yieldWeight}
                        onChangeText={setYieldWeight}
                        keyboardType='numeric'
                        returnKeyType="done"
                    />

                    <Input
                        icon={<NotebookPen size={24} color={theme.colors.text} />}
                        placeholder='Notes'
                        value={notes}
                        onChangeText={setNotes}
                        returnKeyType="done"
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Enter') {
                            Keyboard.dismiss();
                            }
                        }}
                        multiline
                        containerStyles={{height: hp(20), alignItems: 'flex-start', paddingTop: 18}}
                    />

                    <View style={{width: '100%'}}>
                        <Button title='Create Brew' onPress={onSubmit} />
                    </View>

                </ScrollView>

                {/* Header overlay - positioned absolutely */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Brew</Text>
                    <IconButton
                        icon={<ChevronLeft size={30} />}
                        onPress={() => router.back()}
                        style={{ position: 'absolute', left: wp(4), alignSelf: 'center' }}
                    />
                </View>
            </SafeAreaView>
        </ScreenWrapper>
    )
}

export default CreateBrew

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: wp(4),
    paddingTop: hp(8),
    paddingBottom: hp(4),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(1),
    paddingBottom: hp(1),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  title: {
      fontSize: hp(3.3),
      fontWeight: theme.fonts.bold,
      color: theme.colors.text,
  },
});