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

const Signup = () => {

    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef();
    const passwordRef = useRef();
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
      // validation
      if (!name || !email || !password){
          Alert.alert('Sign up', 'Please fill all the fields');
          return;
      }

      // supabase create user
      setLoading(true)
      const {error} = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name
          }
        }
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
                    <Text style={styles.welcomeText}>Let's</Text>
                    <Text style={styles.welcomeText}>Get Started</Text>
                </View>

                {/* form text */}
                <View style={{gap: 20}}>
                    <Input 
                        icon={<Ionicons name='person-circle-outline' size={26} color={theme.colors.text} />}
                        placeholder='Enter your username'
                        onChangeText={setName}
                        value={name}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        autoCapitalize="none"
                    />
                    <Input 
                        icon={<Ionicons name='mail-outline' size={26} color={theme.colors.text} />}
                        placeholder='Enter your email'
                        onChangeText={setEmail}
                        value={email}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        ref={emailRef}
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
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Pressable 
                        onPress={() => router.push('login')}
                        style={{paddingHorizontal: 5, paddingVertical: 10}}
                    >
                        <Text style={[styles.footerText, {fontWeight: theme.fonts.semibold, color: theme.colors.primaryDark}]}>Login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenWrapper>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
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
    },  
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2.2)
    }
})