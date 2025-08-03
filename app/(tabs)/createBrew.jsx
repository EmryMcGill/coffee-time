import { useRouter } from 'expo-router';
import { Bean, ChevronLeft, Coffee, Scale } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
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
    const [brewTime, setBrewTime] = useState('');
    const [grindSize, setGrindSize] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState(null);

    onSubmit = async () => {
        if (!brewType) {
            Alert.alert('Error', 'Please enter a brew type');
            return;
        }
        console.log(brewType, beanType, doseWeight, yieldWeight, brewTime, grindSize, notes, image);
    }

    return (
        <ScreenWrapper bg='white'>
            <View style={{flex: 1}}>
            
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
                        onChangeText={setBrewType}
                    />

                    <PickerInput
                        icon={<Bean size={24} color={theme.colors.text} />}
                        placeholder='Bean Type'
                        value={beanType}
                        onChangeText={setBeanType}
                    />

                    <PickerInput
                        icon={<Scale size={24} color={theme.colors.text} />}
                        placeholder='Dose Weight (g)'
                        value={doseWeight}
                        onChangeText={setDoseWeight}
                    />

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


            </View>
        </ScreenWrapper>
    )
}

export default CreateBrew

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: wp(4),
    paddingTop: hp(8),
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    // Optional: Add blur effect
    backdropFilter: 'blur(10px)',
  },
  title: {
      fontSize: hp(3.3),
      fontWeight: theme.fonts.bold,
      color: theme.colors.text,
  },
});