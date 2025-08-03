import { Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const IconButton = ({onPress, icon, style}) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [styles.button, style, pressed && { transform: [{ scale: 0.95 }] }]}
    >
      {icon}
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.07)'
    }
})