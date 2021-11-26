import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/constants';
import CustomCard2 from '../components/CustomCard2';
import Loading from '../components/Loading';

export default function SignupBarbershopList({ navigation })  {

    const [barbershops, setBarbershops] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        getBarbershops()
    }, [])

    async function getBarbershops() {
        setLoading(true);
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
        };
        const axiosReq = await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/`,
        }).then(async function (responsed) {
            setBarbershops(responsed.data);
        }).catch(function(error){
            console.log("ERROR DATA1", error.response.data)
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
                                        onPress={() => navigation.navigate('SignupBarberDetails', {
                                            data: barbershop
                                        })}
                                    >
                                        <CustomCard2
                                            navigation={navigation}
                                            key={barbershop.id}
                                            data={barbershop}
                                            isVerified={barbershop.verified}
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