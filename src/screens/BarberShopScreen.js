import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/constants';
import CustomCard from '../components/CustomCard';
import Loading from '../components/Loading';

export default function BarberShopScreen({ navigation })  {

    const [barbershops, setBarbershops] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        getBarbershops()
    }, [])

    async function setAsFavorite(barberID) {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        await axios({
            method: 'POST',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/${barberID}/add_favorite_user/`
        }).then(async function (responsed) {
           console.log('SUCCESS DATA1', responsed.data);
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
        setLoading(false);
    }

    async function getBarbershops() {
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
            url: `${BASE_URL}/api/barbershop/`,
        }).then(async function (responsed) {
            for (var i = 0; i<responsed.data.length; i++) {
                for (var j = 0; j<responsed.data[i].favorites.length; j++) {
                    if (responsed.data[i].favorites[j].id === parseInt(userId)) {
                        responsed.data[i].favorite = true
                    }
                }
            }
            setBarbershops(responsed.data);
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
        setLoading(false);
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        getBarbershops()
        setRefreshing(false)
    }, [refreshing])

    if (loading) {
        return <Loading size='large'/>
    } else {
        return (
            <View style={styles.container}> 
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <Text style={styles.barbershops}>List of Barbershop</Text>
                    {
                        barbershops.map((barbershop) => {
                            return(
                                <TouchableOpacity
                                    key={barbershop.id}
                                        onPress={() => navigation.navigate('BarbershopDetails', {
                                            data: barbershop
                                        })}
                                    >
                                        <CustomCard
                                            navigation={navigation}
                                            key={barbershop.id}
                                            data={barbershop} 
                                            isLiked={barbershop.favorite}
                                            onLike={(id) =>
                                                setBarbershops(() => {
                                                    return barbershops.map((barber) => {
                                                        if (barber.id === id) {
                                                            setAsFavorite(barber.id)
                                                            return { ...barber, favorite: !barber.favorite };
                                                        }
                                                        return barber;
                                                    });
                                                })
                                            }
                                        />
                                </TouchableOpacity>
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