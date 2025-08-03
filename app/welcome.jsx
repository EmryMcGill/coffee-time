import { useRouter } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg='white'>
      {/* Welcome Image */}
      <View style={styles.container}>
        <Image 
          style={styles.welcomeImage} 
          resizeMode='contain'
          source={require('../assets/images/welcome.png')} 
        />

        {/* Title */}
        <View style={{gap: 20}}>
          <Text style={styles.title}>Hot Mud</Text>
          <Text style={styles.punchline}>a fun coffee app</Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title='Getting Started'
            onPress={() => router.push('signup')}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable 
              style={{paddingVertical: 10, paddingHorizontal: 5}}
              onPress={() => router.push('login')}  
            >
              <Text 
                style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}
              >Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp(4)
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    fontWeight: theme.fonts.extraBold,
    textAlign: 'center'
  },
  punchline: {
    textAlign: 'center',
    fontSize: hp(2.3),
    color: theme.colors.text
  },
  footer: {
    gap: 30,
    width: '100%'
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(2.2),
  }
})