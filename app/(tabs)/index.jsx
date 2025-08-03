import { supabase } from '@/lib/supabase';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/Avatar';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { getAvatar } from '../../services/imageService';

const Index = () => {

    const {user, setAuth} = useAuth();

    const onLogout = async () => {
        setAuth(null);
        const {error} = await supabase.auth.signOut();
    }


    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Hot Mud</Text>
                    <Avatar 
                        size={hp(4.3)}
                        rounded={theme.radius.sm}
                        uri={getAvatar(user?.image)}
                    />
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        marginHorizontal: wp(4),
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: hp(3.3),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    }
})