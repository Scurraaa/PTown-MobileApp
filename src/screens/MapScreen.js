import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export default function MapScreen({ navigation })  {

    const [barbershops, setBarbershops] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getBarbershops()
    }, [])

    async function getBarbershops() {
        setLoading(true);
        const token = await AsyncStorage.getItem('token')
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        const axiosReq = await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/`,
        }).then(async function (responsed) {
            console.log("RESPONSED DATA", responsed.data);
            setBarbershops(responsed.data);
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
        setLoading(false);
    }

    if (loading) {
        return <Loading size='large'/>
    } else {
        return (
            <View style={styles.container}>
                <MapView 
                    style={styles.map}
                    initialRegion={{
                        latitude: 6.2245,
                        longitude: 125.0608,
                        latitudeDelta: 0.0822,
                        longitudeDelta: 0.0921
                    }}>
                        {
                            barbershops.map((barber, index) => (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: barber.latitude,
                                        longitude: barber.longitude
                                    }}
                                    title={barber.name}
                                    description={barber.description}
                                />
                            ))
                        }
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})