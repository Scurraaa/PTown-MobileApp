import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfile'
import AppointmentScreen from '../screens/AppointmentScreen';
import MessageListScreen from '../screens/MessageList';
import MessageScreen from '../screens/MessageScreen';

const Stack = createStackNavigator()

export default function MessageNavigation() {

    return (
        <Stack.Navigator initialRouteName='Message List' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Message List' component={MessageListScreen} />
            <Stack.Screen name='Message Screen' component={MessageScreen} />
        </Stack.Navigator>
    );
}
