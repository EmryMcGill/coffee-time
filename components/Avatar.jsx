import { Image } from 'expo-image'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const Avatar = ({
    uri,
    size = hp(4.5),
    rounded = theme.radius.md,
    style={}
}) => {

  useEffect(()=>{
    // console.log('uri', uri)
  }, [uri]);

  return (
    <Image 
        source={uri}
        transition={100}
        style={[styles.avatar, style, {height: size, width: size, borderRadius: rounded}]}
    />
  )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        borderCurve: 'continuous',
        borderColor: theme.colors.darkLight,
        borderWidth: 2
    }
})