import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, TextInput, Modal, Portal } from 'react-native-paper';



export default function AppointmentScreen ({ navigation }) {

    const [loading, setLoading] = useState(false)
    const [appointment, setAppointment] = useState([])
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
        const userID = await AsyncStorage.getItem('userId')
        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/appointment_user/`,
        }).then(async function(responsed) {
            for (let i = 0; i < responsed.data.length; i++) {
                console.log(responsed.data[i].appointments)
            }
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
            console.log('RESPONSE FROM CANCEL APPOINTMENT', responsed.data)
            getAppointment()
            setModal(!modal);
        }).catch(function(error) {
            console.log('ERROR ON CANCEL APPOINTMENT:', error)
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
                        {appointment.length > 0 ? (
                            appointment.map((element) => {
                                if (element.appointments.length > 0) {
                                    return element.appointments.map((element1) => {
                                        return (
                                            <>
                                            <TouchableOpacity onPress={() => setModal(!modal)}>
                                                <View key={element1.id} style={{margin: 15, padding: 10, backgroundColor: '#6200ee', borderRadius: 5}}>
                                                    <Text style={{fontSize: 25, color: 'white'}}>Barbershop: {element.name}</Text>
                                                    <Text style={{fontSize: 22, color: 'white'}}>Date: {element1.date}</Text>
                                                    <Text style={{fontSize: 22, color: 'white'}}>Time: {element1.time}</Text>
                                                    <Text style={{fontSize: 18, color: 'white'}}>Status: {capitalizeFirstLetter(element1.status)}</Text>
                                                    <View style={{flexDirection: 'row-reverse', marginTop: 10}}>
                                                        <Text style={{color: 'white'}}>CLICK TO CANCEL APPOINTMENT</Text>
                                                    </View>
                                                </View> 
                                            </TouchableOpacity> 
                                            <Portal>
                                                <Modal visible={modal} onDismiss={() => setVisible(!modal)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                                                <Text style={{textAlign: 'center'}}> Are you sure you want to cancel this appointment?</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                                                    <Button style={{margin: 10}} mode="contained" onPress={() => deleteAppointment('cancel', element1.id)}>
                                                        Yes
                                                    </Button>
                                                    <Button style={{margin: 10, backgroundColor: 'red'}} mode="contained" onPress={() => setModal(!modal)}>
                                                        No
                                                    </Button>
                                                </View>
                                                </Modal>
                                            </Portal>
                                            </>
                                        )
                                    })
                                } else {
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text>NO APPOINTMENT</Text>
                                    </View>
                                }
                            })
                        ) : (
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text>NO APPOINTMENT</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
            )
    }
}