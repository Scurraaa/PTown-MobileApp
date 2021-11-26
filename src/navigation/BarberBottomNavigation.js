import React from 'react';
import { createMaterialBottomTabNavigator, createStackNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RevampedBarbershopDetails from '../screens/RevampedBarbershopDetails';
import ProfileBarbershopScreen from '../screens/ProfileBarbershop'
import MessageNavigation from './MessageNavigation';
import ProfileBarbershopStack from './ProfileBarbershopNavigation'



const Tab = createMaterialBottomTabNavigator();


export default function BarberBottomTabs({ route, navigation }) {
    const data = route.params
    return (
        <Tab.Navigator
            initialRouteName='Profile Barbershop Stack'
            activeColor='#fff'
            barStyle={{ backgroundColor: '#6200ee'}}
        >
            <Tab.Screen
                name='Profile Barbershop Stack'
                component={ProfileBarbershopStack}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Icon name='face' color={color} size={26}/>
                    )
                }}
            />

            <Tab.Screen
                name='Messages'
                component={MessageNavigation}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color }) => (
                        <Icon name='message' color={color} size={26} />
                    )
                }}
            />

            <Tab.Screen
                name='My Barbershop'
                component={RevampedBarbershopDetails}
                initialParams={{data: data}}
                options={{
                    tabBarLabel: 'My Barbershop',
                    tabBarIcon: ({ color }) => (
                        <Icon name='home' color={color} size={26}/>
                    )
                }}
            />
        </Tab.Navigator>
    )
}