import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "../screens/HomeScreen";
import BarbershopDetails from '../screens/BarberShopDetails';
import Calc from '../screens/CalendarScreen'
import MessageScreen from '../screens/MessageScreen'

const Stack = createStackNavigator()

export default function HomeStack() {

    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='BarbershopDetails' component={BarbershopDetails} />
            <Stack.Screen name='Calendar Screen' component={Calc} />
            <Stack.Screen name='Message Screen' component={MessageScreen} />
        </Stack.Navigator>
    );
}
