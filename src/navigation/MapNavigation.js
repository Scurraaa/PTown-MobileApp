import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import BarbershopDetails from '../screens/BarberShopDetails';
import Calc from '../screens/CalendarScreen'

const Stack = createStackNavigator()

export default function MapStack() {

    return (
        <Stack.Navigator initialRouteName='Map' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Map' component={MapScreen} />
            <Stack.Screen name='BarbershopDetails' component={BarbershopDetails} />
            <Stack.Screen name='Calendar Screen' component={Calc}/>
        </Stack.Navigator>
    );
}
