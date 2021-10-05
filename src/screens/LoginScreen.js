import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function logginIn(email, password) {
        console.log(email, password);
        if (email === 'joshua.bacani12@gmail.com' && password === '123@123') {
            console.log('here');
            navigation.navigate('Home');
        }
        else return false
    }
    
    return (
        <View style={styles.container}>
            <Title style={styles.titleText}>Welcome to PTown</Title>
            <FormInput
                labelName='Email'
                value={email}
                autoCapitalize='none'
                onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
                labelName='Password'
                value={password}
                secureTextEntry={true}
                autoCapitalize='none'
                onChangeText={password => setPassword(password)}
            />
            <FormButton
                title='Login'
                modeValue='contained'
                labelStyle={styles.loginButtonLabel}
                onPress={() => logginIn(email, password)}
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
        backgroundColor: '#F5F5F5',
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
        fontSize: 12
    }
});