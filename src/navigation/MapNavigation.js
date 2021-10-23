import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import BarbershopDetails from '../screens/BarberShopDetails';

const Stack = createStackNavigator()

export default function MapStack() {

    return (
        <Stack.Navigator initialRouteName='Map' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Map' component={MapScreen} />
            <Stack.Screen name='BarbershopDetails' component={BarbershopDetails} />
        </Stack.Navigator>
    );
}
