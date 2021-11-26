import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



export default function MessageListScreen ({ navigation, route }) {

    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState()
    const [userID1, setuserID1] = useState()
    const [barbershop, setBarbershop] = useState()
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        getMessageList()
        getBarbershop()
    }, [refreshing])

    async function getMessageList() {
        setLoading(true)
        const token = await AsyncStorage.getItem('token')
        const barbershopID = await AsyncStorage.getItem('barbershopID')
        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/${barbershopID}/messages_barber/`,
        }).then(async function(responsed) {
            setMessages(responsed.data)
            setLoading(false)
        }).catch(function(error) {
            console.log('ERROR ON GET APPOINTMENT:', error)
        })
    }

    async function getBarbershop() {
        const token = await AsyncStorage.getItem('token')
        const barbershopID = await AsyncStorage.getItem('barbershopID')
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/${barbershopID}/`
        }).then(async(response) => {
            
            setBarbershop(response.data)
        })
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        getMessageList()
        setRefreshing(false)
    }, [refreshing])


    if (loading) {
        return (
            <Loading size='large'/>
        )
    } else {
        return (
            <View style={{flex: 1}}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={{height: 80, backgroundColor: '#6200ee',}}>
                        <View style={{flex: 1, justifyContent: 'center', margin: 15}}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Icon name='arrow-left' color='white' size={35}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginTop: 10}}>
                        {messages && barbershop ? 
                            
                                Object.keys(messages).map((k, idx) => {
                                    return (
                                        <TouchableOpacity key={idx} onPress={() => navigation.navigate('Message Screen', {barbershop: barbershop, userID1: messages[k][0].user.id})}>
                                            <View key={idx} style={{ margin: 15, padding: 20, backgroundColor: '#6200ee', borderRadius: 5}}>
                                                <Text style={{fontSize: 22, color: 'white'}}>{k}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            
                         : (
                             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 22}}>
                                 <Text>No Messages Yet</Text>
                            </View>
                         )

                        }
                    </View>
                </ScrollView>
            </View>
            )
    }
}