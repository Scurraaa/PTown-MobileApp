import React, { useState, useEffect, useReducer } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Touchable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, TextInput, Modal, Portal } from 'react-native-paper';



export default function AppointmentBarbershopScreen ({ navigation }) {

    const [loading, setLoading] = useState(false)
    const [appointment, setAppointment] = useState()
    const [modal, setModal] = useState(false)

    useEffect(() => {
        getAppointment()
    }, [])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function getAppointment() {
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
            url: `${BASE_URL}/api/barbershop/${barbershopID}/`,
        }).then(async function(responsed) {
            console.log(responsed.data)
            setAppointment(responsed.data)
            setLoading(false)
        }).catch(function(error) {
            console.log('ERROR ON GET APPOINTMENT:', error)
        })
    }

    async function deleteAppointment(statuss, id) {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        await axios({
            method: 'PATCH',
            headers: headers,
            url: `${BASE_URL}/api/appointment/${id}/`,
            data: {
                status: statuss
            }
        }).then(async function(responsed) {
            console.log('RESPONSE PATCH CANCEL APPOINTMENT', responsed.data)
            getAppointment()
            setModal(!modal);
        }).catch(function(error) {
            console.log('ERROR ON PATCH APPOINTMENT:', error.response.data)
        })
    }

    if (loading) {
        return (
            <Loading size='large'/>
        )
    } else {
        return (
            <View style={{flex: 1}}>
                <ScrollView>
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
                        {appointment ? appointment.appointments.map((element) => {   
                            console.log(element)
                            return (
                                <View key={element.id}>
                                    <TouchableOpacity onPress={() => setModal(!modal)}>
                                    <View key={element.id} style={{margin: 15, padding: 10, backgroundColor: '#6200ee', borderRadius: 5}}>
                                        <Text style={{fontSize: 25, color: 'white'}}>Customer: {element.user.first_name} {element.user.last_name}</Text>
                                        <Text style={{fontSize: 22, color: 'white'}}>Date: {element.date}</Text>
                                        <Text style={{fontSize: 22, color: 'white'}}>Time: {element.time}</Text>
                                        <Text style={{fontSize: 18, color: 'white'}}>Status: {capitalizeFirstLetter(element.status)}</Text>
                                        <View style={{flexDirection: 'row-reverse', marginTop: 10}}>
                                            <Text style={{color: 'white'}}>CLICK TO Confirm/Reject Appointment</Text>
                                        </View>
                                    </View> 
                                </TouchableOpacity> 
                                <Portal>
                                <Modal visible={modal} onDismiss={() => setModal(!modal)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                                <Text style={{textAlign: 'center'}}>Choose what todo with appointment </Text>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                                    <Button style={{margin: 10}} mode="contained" onPress={() => deleteAppointment('confirm', element.id)}>
                                        Confirm
                                    </Button>
                                    <Button style={{margin: 10, backgroundColor: 'red'}} mode="contained" onPress={() => deleteAppointment('reject', element.id)}>
                                        Reject
                                    </Button>
                                </View>
                                </Modal>
                                </Portal>
                                </View>
                            )
                        })
                         : 
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text>NO APPOINTMENT</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
            )
    }
}