import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/constants';
import CustomCard from '../components/CustomCard';
import Loading from '../components/Loading';

export default function BarberShopScreen({ navigation })  {

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
                <ScrollView>
                    <Text style={styles.barbershops}>List of Barbershop</Text>
                    {
                        barbershops.map((barbershop) => {
                            return(
                                <CustomCard
                                    key={barbershop.id}
                                    data={barbershop} 
                                    isLiked={barbershop.favorite}
                                    onLike={(id) =>
                                        setBarbershops(() => {
                                            return barbershops.map((barber) => {
                                                if (barber.id === id) {
                                                return { ...barber, favorite: !barber.favorite };
                                                }
                                                return barber;
                                            });
                                        })
                                    }
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        margin: 15
    },
    barbershops: {
        fontSize: 20
    }
})