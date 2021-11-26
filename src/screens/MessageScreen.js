import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import moment from 'moment';
import { set } from 'react-native-reanimated';

export default function MessageScreen({ navigation, route }) {

    const data = route.params.barbershop

    const [messages, setMessages] = useState([]);
    const [type, setType] = useState('')
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(false)

    const onSend = useCallback((messages = []) => {
        postMessages(data.id, messages, user)
        // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    useEffect(() => {
        setLoading(true)
        async function fetchMyID() {
          const user = await AsyncStorage.getItem('userId')
          const type = await AsyncStorage.getItem('account_type')
          setType(type);
          setUser(user)
          if (type === 'user') {
            await getMessages(data.id, user)
          } else if (type === 'owner') {
            await getMessages(data.id, route.params.userID1)
          }
        }
        fetchMyID()
        setLoading(false)
      }, [])

    async function getMessages(barbershopID, userID) {
        console.log('ENTER GET MESSAGE FUNCTION')
        const token = await AsyncStorage.getItem('token')
        await axios({
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/barbershop/${barbershopID}/messages_thread/`,
            data: {
                user: userID
            }
        }).then(async (response) => {
            console.log('RESPONSE FROM GET MESSAGE:', response.data)
            const messages = []
            for (let i = 0; i<response.data.length; i++) {
                const msg = {
                        _id: Math.floor(Math.random() * 10000000),
                        text: response.data[i].text,
                        createdAt: response.data[i].created,
                        user: {
                        _id: response.data[i].origin,
                        name: data.name,
                        avatar: data.photo
                    }
                }
                messages.push(msg)
            }
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        }).catch((er) => {
            console.log('ERROR FROM GET MESSAGE', er.response.data)
        })
    }

    async function postMessages(barbershopID, text) {
        console.log('ENTER SEND MESSAGE FUNCTION')
        setMessages(previousMessages => GiftedChat.append(previousMessages, text))
        const token = await AsyncStorage.getItem('token')
        const user = await AsyncStorage.getItem('userId')
        const type = await AsyncStorage.getItem('account_type')
        await axios({
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            url: `${BASE_URL}/api/barbershop/${barbershopID}/add_message/`,
            data: {
                origin: type,
                text: text[0].text,
                user: type === 'owner' ? route.params.userID1 : user
            }
        }).then(async(response) => {
            console.log('RESPONSE FROM SEND MESSAGE', response.data)
        }).catch((error) => {
            console.log('ERROR RESPONSE FROM SEND MESSAGE', error.response.data)
        })
    }

    return (
        <View style={{flex: 1}}>
            <View style={{height: 80, backgroundColor: '#6200ee',}}>
                <View style={{flex: 1, justifyContent: 'center', margin: 15}}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name='arrow-left' color='white' size={35}/>
                    </TouchableOpacity>
                </View>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: type,
                }}
            />
        </View>
    )
}