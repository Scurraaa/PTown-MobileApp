import React from 'react';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BarberShopScreen from "../screens/BarberShopScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AuthStack from '../navigation/AuthStack';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            activeColor='#fff'
            barStyle={{ backgroundColor: '#6200ee'}}
        >
            <Tab.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Icon name='home' color={color} size={26}/>
                    )
                }}
            />
             <Tab.Screen
                name='Barbers List'
                component={BarberShopScreen}
                options={{
                    tabBarLabel: 'Barber List',
                    tabBarIcon: ({ color }) => (
                        <Icon name='format-list-bulleted' color={color} size={26}/>
                    )
                }}
            />
             <Tab.Screen
                name='Map'
                component={MapScreen}
                options={{
                    tabBarLabel: 'Map',
                    tabBarIcon: ({ color }) => (
                        <Icon name='map-marker' color={color} size={26}/>
                    )
                }}
            />
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Icon name='face' color={color} size={26}/>
                    )
                }}
            />
            <Tab.Screen
                name='Login'
                component={LoginScreen}
                options={{
                    tabBarVisible: false,
                    tabBarLabel: 'Logout',
                    tabBarIcon: ({ color }) => (
                        <Icon name='logout' color={color} size={26}/>
                    )
                }}
            />
        </Tab.Navigator>
    )
}