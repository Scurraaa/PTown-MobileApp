import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import Toast from 'react-native-toast-message'
import { TOAST_TIMEOUT, SCREEN_WIDTH, BASE_URL } from '../utils/constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [visible1, setVisible1] = useState(true)


    async function logginIn(username, password) {
        console.log(username, password);
        // temp db
        if (username && password) {
            setLoading(true);
            const headers = {
                "accept": "application/json",
                "content-type": "application/json"
            };
            const axiosReq = await axios({
                method: 'POST',
                headers: headers,
                url: `${BASE_URL}/api/token/`,
                data: {
                    "username": username,
                    "password": password
                },
            }).then(async function (responsed) {
                console.log("RESPONSED DATA", responsed.data);
                if (responsed.status === 200) {
                    await AsyncStorage.setItem('token', responsed.data.access)
                    await AsyncStorage.setItem('loggedin', "true")
                    await AsyncStorage.setItem('userId', responsed.data.id.toString())
                    await AsyncStorage.setItem('account_type', responsed.data.type)
                    if (responsed.data.type === 'user') {
                        Toast.show({
                            type: 'success',
                            position: 'bottom',
                            text1: "INFO",
                            text2: 'Successfully Logged in!',
                            visibilityTime: TOAST_TIMEOUT,
                            style: {
                                backgroundColor: '#6200ee'
                            },
                            autoHide: true,
                            onHide: () => {
                                navigation.navigate('Home')
                            }
                        })
                    } else if (responsed.data.type === 'owner') {
                        await axios({
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${responsed.data.access}`
                            },
                            url: `${BASE_URL}/api/profile/?user=${responsed.data.id}`,
                        }).then(async(response) => {
                            await AsyncStorage.setItem('barbershopID', response.data[0].barbershop[0].id.toString())
                            Toast.show({
                                type: 'success',
                                position: 'bottom',
                                text1: "INFO",
                                text2: 'Successfully Logged in!',
                                visibilityTime: TOAST_TIMEOUT,
                                style: {
                                    backgroundColor: '#6200ee'
                                },
                                autoHide: true,
                                onHide: () => {
                                    navigation.navigate('Home2', response.data[0].barbershop[0])
                                }
                            })
                        }).catch((e) => {
                            console.log('ERRROR FROM GET PROFILE', e)
                        })
                    }
                    setUsername("")
                    setPassword("")
                }
            }).catch(function(error){
                console.log("ERROR DATA1", error)
                console.log("ERROR DATA2", error.response.status)
                if (error.response.status === 401) {
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: "INFO",
                        text2: 'Failed to Logged in, Invalid Credentails!',
                        visibilityTime: TOAST_TIMEOUT,
                        autoHide: true,
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: "INFO",
                        text1: 'System Error',
                        style: {
                            backgroundColor: '#6200ee'
                        },
                        visibilityTime: TOAST_TIMEOUT,
                        autoHide: true,
                    })
                }
            })
            setLoading(false);
        }
        else return false
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo1.png')} style={{width: 250, height: 250}}/>
            <FormInput
                labelName='Username'
                value={username}
                autoCapitalize='none'
                onChangeText={userName => setUsername(userName)}
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
                loading={loading}
                labelStyle={styles.loginButtonLabel}
                buttonStyle={styles.loginButtonContainer}
                onPress={() => logginIn(username, password)}
            />
            <FormButton
                title='New User? Join Here'
                modeValue='text'
                uppercase={true}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('RegisterAs')}
            />

            <Portal>
                <Modal visible={visible1} onDismiss={() => setVisible1(!visible1)} contentContainerStyle={{backgroundColor: 'white', padding: 25, margin: 20}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                            <Text style={{fontSize: 18}}>Do you want to cut your hair?</Text>
                        </View>
                        <FormButton
                            title="Let's Go!"
                            loading={loading}
                            modeValue='contained'
                            onPress={() => {
                                setVisible1(!visible1)
                                navigation.navigate('SignupBarberList')
                            }}
                        />
                </Modal>
            </Portal>
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