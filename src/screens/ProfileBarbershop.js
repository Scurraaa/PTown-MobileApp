import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/constants'
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper'

export default function ProfileBarbershopScreen({ navigation })  {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null);

    useEffect(() => {
        getProfile()
    }, [])


    async function getProfile() {
        setLoading(true);
        const token = await AsyncStorage.getItem('token')
        const userId = await AsyncStorage.getItem('userId')
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        const axiosReq = await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/profile/?user=${userId}`,
        }).then(async function (responsed) {
            setProfile(responsed.data[0])
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
        setLoading(false);
    }

    const logout = async () => {
        AsyncStorage.clear();
        navigation.navigate('Login')
    }

    if (loading) {
        return (
            <Loading size='large'/>
        )
    }
    else {
        return (
            <View style={styles.container}>
                <View style={{height: 200}}>
                    <Button style={{width: 300, margin: 5}} icon="emoticon" mode="contained" onPress={() => navigation.navigate('Edit Profile', {
                        profile: profile
                    })}>
                        Edit Barbershop Profile
                    </Button>
                    <Button style={{width: 300, margin: 5}} icon="book" mode="contained" onPress={() => navigation.navigate('Appoinment Screen')}>
                        Bookings
                    </Button>
                    <Button style={{width: 300, margin: 5}} icon="logout" mode="contained" onPress={() => navigation.navigate('Login')}>
                        Log Out
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    }
})
