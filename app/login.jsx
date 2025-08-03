import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { supabase } from '../lib/supabase';

const Login = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef(null);

    const onSubmit = async () => {
        if (!email || !password){
            Alert.alert('Login', 'Please fill all the fields');
            return;
        }

        // supabase login user
        setLoading(true)
        const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        })
        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    return (
        <ScreenWrapper bg='white' >
                <ScrollView
                    style={{flex: 1}}
                    automaticallyAdjustKeyboardInsets={true}
                    contentContainerStyle={styles.container}
                >
                    <BackButton router={router} />
                    {/* welcome text */}
                    <View>
                        <Text style={styles.welcomeText}>Hey,</Text>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                    </View>

                    {/* form text */}
                    <View style={{gap: 20}}>
                        <Text style={{color: theme.colors.text, fontSize: hp(2.2)}}>Please login to continue</Text>
                        <Input 
                            icon={<Ionicons name='mail-outline' size={26} color={theme.colors.text} />}
                            placeholder='Enter your email'
                            onChangeText={setEmail}
                            value={email}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input 
                            icon={<Ionicons name='lock-closed-outline' size={26} color={theme.colors.text} />}
                            placeholder='Enter your password'
                            onChangeText={setPassword}
                            secureTextEntry
                            value={password}
                            returnKeyType="done"
                            ref={passwordRef}
                        />
                        <Text style={{color: theme.colors.text, fontWeight: theme.fonts.semibold, textAlign: 'right', fontSize: hp(2.2)}}>Forgot Password?</Text>
                        <Button title='Login' loading={loading} onPress={onSubmit} />
                    </View>

                    {/* footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <Pressable 
                            onPress={() => router.push('signup')}
                            style={{paddingHorizontal: 5, paddingVertical: 10}}
                        >
                            <Text style={[styles.footerText, {fontWeight: theme.fonts.semibold, color: theme.colors.primaryDark}]}>Sign up</Text>
                        </Pressable>
                    </View>
                </ScrollView>
        </ScreenWrapper>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },  
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2.2)
    }
})