import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';


const BackButton = ({router}) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
        <Ionicons 
            name='chevron-back-outline' 
            size={24} 
            color={theme.colors.text} 
        />
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.07)'
    }
})