import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "../screens/HomeScreen";
import BarbershopDetails from '../screens/BarberShopDetails';

const Stack = createStackNavigator()

export default function HomeStack() {

    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='BarbershopDetails' component={BarbershopDetails} />
        </Stack.Navigator>
    );
}
