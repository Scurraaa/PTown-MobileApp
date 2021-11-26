import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen';
import BottomTabs from './BottomNavigation';
import RegisterAs from '../screens/RegisterAsScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarberShopSignup from '../screens/BarberShopSignup';
import BarberBottomTabs from './BarberBottomNavigation';
import SignupBarbershopList from '../screens/SignupBarbershopList'
import SignupBarbershopDetails from '../screens/SignupBarbershopDetails';
import SignUpMapScreen from '../screens/SignupMapScreen';

const Stack = createStackNavigator()

export const NetworkContext = React.createContext();

export default function AuthStack() {
    const [loggedIn, setLoggedIn] = useState('')
    const [type, setType] = useState('')

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        setLoggedIn(await AsyncStorage.getItem("loggedin"))
        setType(await AsyncStorage.getItem('account_type'))
    }

    return (
        <NetworkContext.Provider>
        <Stack.Navigator initialRouteName={loggedIn !== 'true' ? 'Login' : 'Home'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen name='Home' component={BottomTabs} />
            <Stack.Screen name='Home2' component={BarberBottomTabs} />
            <Stack.Screen name='RegisterAs' component={RegisterAs} />
            <Stack.Screen name='BarberSignup' component={BarberShopSignup}/>
            <Stack.Screen name='SignupBarberList' component={SignupBarbershopList}/>
            <Stack.Screen name='SignupBarberDetails' component={SignupBarbershopDetails} />
            <Stack.Screen name='MapSignupScreen' component={SignUpMapScreen}/>
        </Stack.Navigator>
        </NetworkContext.Provider>
    )
}