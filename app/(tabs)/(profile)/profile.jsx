import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../../components/Avatar';
import IconButton from '../../../components/IconButton';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { theme } from '../../../constants/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { hp, wp } from '../../../helpers/common';
import { logout } from '../../../services/authService';
import { getAvatar } from '../../../services/imageService';

const Profile = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    const res = await logout();

    if (res.success) setAuth(null);
    else console.log(res.msg);
  }

  return (
    <ScreenWrapper bg='white'>
          <View style={styles.container}>
            {/* header */}
              <View style={styles.header}>
                      <Text style={styles.title}>Profile</Text>
                      <IconButton 
                        icon={<Settings size={30} />}
                        onPress={onLogout} 
                        style={{position: 'absolute', right: 0, alignSelf: 'center'}}
                      />
              </View>

            {/* profile image */}
            <View style={{alignItems: 'center'}}>
                <View>
                  <Avatar 
                    uri={getAvatar(user?.image).uri}
                    size={hp(12)}
                    rounded={theme.radius.xxl*1.4}
                  />
                  <Pressable style={styles.editButton} onPress={() => router.push('/editProfile')}>
                    <Ionicons name='create-outline' size={15} />
                  </Pressable>
                </View>
              <Text style={styles.username}>{user?.name}</Text>
            </View>

            {/* info */}
            <View style={styles.info}>
              <View style={styles.infoLine}>
                <Image source={require('../../../assets/images/machine.png')} style={styles.infoImg} />
                <Text style={styles.infoText}>{user?.machine}</Text>
              </View>
              <View style={styles.infoLine}>
                <Image source={require('../../../assets/images/grinder.png')} style={styles.infoImg} />
                <Text style={styles.infoText}>{user?.grinder}</Text>
              </View>
            </View>
          </View>
      </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 20,
        paddingHorizontal: wp(4)
    },
    header: {
        marginHorizontal: wp(4),
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        width: '100%'
    },
    title: {
      fontSize: hp(3.3),
      fontWeight: theme.fonts.bold,
      color: theme.colors.text,
    },
    editButton: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    username: {
      color: theme.colors.text,
      fontSize: hp(3),
      fontWeight: theme.fonts.semibold,
      marginTop: 7
    },
    info: {
      paddingHorizontal: wp(4),
      gap: 5
    },
    infoLine: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center'
    },  
    infoImg: {
      width: hp(4),
      height: hp(4)
    },
    infoText: {
      color: theme.colors.text,
      fontSize: hp(2.2),
      fontWeight: theme.fonts.medium,
    }
})