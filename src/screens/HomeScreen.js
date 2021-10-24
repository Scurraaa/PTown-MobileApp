import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from '../components/CustomCard';
import Loading from '../components/Loading';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export default function HomeScreen({ navigation })  {


    const [topBarber, setTopBarber] = useState()
    const [myFavorite, setMyFavorite] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    async function getTopMonthBarbershops() {
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
            url: `${BASE_URL}/api/barbershop/barbershop_of_the_month/`, 
        }).then(async function (responsed) {
            for (var i = 0; i<responsed.data.favorites.length; i++) {
                console.log(responsed.data.favorites[i]);
                if (responsed.data.favorites[i].id === parseInt(userId)) {
                    responsed.data.favorite = true
                }
            }
            setTopBarber(responsed.data);
            getMyFavoriteBarbershops();
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        getTopMonthBarbershops()
        getMyFavoriteBarbershops()
        setRefreshing(false)
    }, [refreshing])

    async function getMyFavoriteBarbershops() {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        const axiosReq = await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/favorite_user/`,
        }).then(async function (responsed) {
            for (var i = 0; i<responsed.data.length; i++) {
                responsed.data[i].favorite = true
            }
            setMyFavorite(responsed.data);
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
        setLoading(false);
    }

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

    useEffect(() => {
        getTopMonthBarbershops();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])


    if (loading) {
        return (
            <Loading size="large"/>
        )
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
                    <Text style={styles.top}>Top Barbershop of the Month</Text>
                    <View style={styles.topContainer}>
                        {topBarber ? (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('BarbershopDetails', {
                                    data: topBarber
                                })}
                            >
                                <CustomCard
                                    navigation={navigation}
                                    data={topBarber} 
                                    isLiked={topBarber.favorite}
                                    onLike={(id) => {
                                        topBarber.favorite = !topBarber.favorite;
                                        setAsFavorite(id)
                                        setTopBarber(topBarber)
                                    }
                                    }
                                />
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.noTopBarber}>No Top Barber for this Month</Text>
                        )}
                    </View>
                    <Text style={styles.top}>My Favorite Barbershop</Text>
                    <View style={styles.myContainer}>
                            {
                                myFavorite.length > 0 ? (
                                    myFavorite.map((favorites) => {
                                        return(
                                            <TouchableOpacity
                                            key={favorites.id}
                                                onPress={() => navigation.navigate('BarbershopDetails', {
                                                    data: favorites
                                                })}
                                            >
                                                <CustomCard
                                                    navigation={navigation}
                                                    key={favorites.id}
                                                    data={favorites} 
                                                    isLiked={favorites.favorite}
                                                    onLike={(id) =>
                                                        setMyFavorite(() => {
                                                            return myFavorite.map((barber) => {
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
                                ) : (
                                    <Text style={styles.noFavorite}>No Favorites</Text>
                                )
                            }
                    </View>
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
    top: {
        fontSize: 20
    },
    topContainer: {
        margin: 10
    },
    myContainer: {
        margin: 10
    },
    noTopBarber: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    noFavorite: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
})