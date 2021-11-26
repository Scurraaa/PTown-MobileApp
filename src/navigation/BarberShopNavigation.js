import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BarberShopScreen from '../screens/BarberShopScreen';
import BarbershopDetails from '../screens/BarberShopDetails';
import Calc from '../screens/CalendarScreen'

const Stack = createStackNavigator()

export default function BarberStack() {

    return (
        <Stack.Navigator initialRouteName='Barber List' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Barber List' component={BarberShopScreen} />
            <Stack.Screen name='BarbershopDetails' component={BarbershopDetails} />
            <Stack.Screen name='Calendar Screen' component={Calc} />
        </Stack.Navigator>
     );
}
