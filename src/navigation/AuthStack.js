import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen';
import BottomTabs from './BottomNavigation';
import RegisterAs from '../screens/RegisterAsScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator()

export default function AuthStack() {
    const [loggedIn, setLoggedIn] = useState('')

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        setLoggedIn(await AsyncStorage.getItem("loggedin"))
    }

    return (
        <Stack.Navigator initialRouteName={loggedIn !== 'true' ? 'Login' : 'Home'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen name='Home' component={BottomTabs} />
            <Stack.Screen name='RegisterAs' component={RegisterAs} />
        </Stack.Navigator>
    );
}