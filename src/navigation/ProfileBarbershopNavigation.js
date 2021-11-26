import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileBarbershopScreen from '../screens/ProfileBarbershop';
import EditProfileScreen from '../screens/EditProfile'
import EditProfileBarbershop from '../screens/EditBarbershopProfile';
import AppointmentBarbershopScreen from '../screens/AppointmentBarbershopScreen';

const Stack = createStackNavigator()

export default function ProfileBarbershopStack() {

    return (
        <Stack.Navigator initialRouteName='Profile Barbershop' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Profile Barbershop' component={ProfileBarbershopScreen} />
            <Stack.Screen name='Edit Profile' component={EditProfileBarbershop} />
            <Stack.Screen name='Appoinment Screen' component={AppointmentBarbershopScreen}/>
        </Stack.Navigator>
    );
}
