import React from 'react';
import { createMaterialBottomTabNavigator, createStackNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BarberStack from './BarberShopNavigation';
import HomeStack from './HomeScreenNavigation';
import MapStack from './MapNavigation';
import ProfileStack from './ProfileNavigation';

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
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Icon name='home' color={color} size={26}/>
                    )
                }}
            />
             <Tab.Screen
                name='Barbers List'
                component={BarberStack}
                options={{
                    tabBarLabel: 'Barbershop List',
                    tabBarIcon: ({ color }) => (
                        <Icon name='format-list-bulleted' color={color} size={26}/>
                    )
                }}
            />
             <Tab.Screen
                name='Map Screen'
                component={MapStack}
                options={{
                    tabBarLabel: 'Map',
                    tabBarIcon: ({ color }) => (
                        <Icon name='map-marker' color={color} size={26}/>
                    )
                }}
            />
            <Tab.Screen
                name='Profile Stack'
                component={ProfileStack}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Icon name='face' color={color} size={26}/>
                    )
                }}
            />
        </Tab.Navigator>
    )
}