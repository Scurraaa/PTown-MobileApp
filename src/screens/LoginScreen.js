import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    return (
        <View style={styles.container}>
            <Title style={style.titleText}>Welcome to PTown</Title>
            <FormInput
                labelEmai='Email'
                value={email}
                placeholder='ENTER EMAIL HERE'
                autoCapitalize='none'
                onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
                labelEmai='Password'
                placeholder='ENTER PASSWORD HERE'
                value={password}
                secureText={true}
                autoCapitalize='none'
                onChangeText={password => setPassword(password)}
            />
            <FormButton
                title='Login'
                modeValue='contained'
                labelStyle={styles.loginButtonLabel}
            />
            <FormButton
                title='New User? Join Here'
                modeValue='text'
                uppercase={true}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('Signup')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgrounColor: '#F5F5F5',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 24,
        marginBottom: 20
    },
    loginButtonLabel: {
        fontSize: 22
    },
    navButtonText: {
        fontSize: 16
    }
});