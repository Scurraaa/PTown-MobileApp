import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import Toast from 'react-native-toast-message'
import { TOAST_TIMEOUT, SCREEN_WIDTH } from '../utils/constants';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    function logginIn(email, password) {
        console.log(email, password);
        // temp db
        if (email && password) {
            if (email === 'john.doe@gmail.com' && password === '123@123') {
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Successfully Logged in!',
                    visibilityTime: TOAST_TIMEOUT,
                    style: {
                        backgroundColor: '#6200ee'
                    },
                    autoHide: true,
                    onHide: () => {
                        navigation.navigate('Home')
                    }
                })
            } else {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Failed to Logged in!',
                    style: {
                        backgroundColor: '#6200ee'
                    },
                    visibilityTime: TOAST_TIMEOUT,
                    autoHide: true,
                })
            }
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
                buttonStyle={styles.loginButtonContainer}
                onPress={() => logginIn(email, password)}
            />
            <FormButton
                title='New User? Join Here'
                modeValue='text'
                uppercase={true}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('RegisterAs')}
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
    loginButtonContainer: {
        width: SCREEN_WIDTH / 1.5
    },
    loginButtonLabel: {
        fontSize: 18
    },
    navButtonText: {
        fontSize: 14
    }
});