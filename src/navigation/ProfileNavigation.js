import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfile'
import AppointmentScreen from '../screens/AppointmentScreen';

const Stack = createStackNavigator()

export default function ProfileStack() {

    return (
        <Stack.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='Edit Profile' component={EditProfileScreen} />
            <Stack.Screen name='Appoinment Screen' component={AppointmentScreen}/>
        </Stack.Navigator>
    );
}
