import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/constants';
import CustomCard from '../components/CustomCard';
import Loading from '../components/Loading';
import { Searchbar, RadioButton, Portal, Modal } from 'react-native-paper';
import FormButton from '../components/FormButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { set } from 'react-native-reanimated';

export default function BarberShopScreen({ navigation })  {

    const [barbershops, setBarbershops] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = React.useState('');
    const [visible, setVisible] = useState(false)
    const [searchVia, setSearchVia] = React.useState('first');
    const [alphabeticalOrder, setAlphabeticalOrder] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [ratingOrder, setRatingOrder] = useState(false);

    const onChangeSearch = query => setSearchQuery(query);

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

    async function searchBarbershop() {
        setLoading(true);
        const token = await AsyncStorage.getItem('token')
        const userId = await AsyncStorage.getItem('userId')
        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        if (searchVia == 'rating') {
            setSearchQuery(parseFloat(searchQuery))
        }
        await axios({
            method: 'GET',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/?${searchVia}=${searchQuery}`
        }).then(async function(responsed) {
            for (var i = 0; i<responsed.data.length; i++) {
                for (var j = 0; j<responsed.data[i].favorites.length; j++) {
                    if (responsed.data[i].favorites[j].id === parseInt(userId)) {
                        responsed.data[i].favorite = true
                    }
                }
            }
            setVisible(!visible)
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

    function sortAplhabetically() {
        if (alphabeticalOrder) {
            setAlphabeticalOrder(!alphabeticalOrder)
            setBarbershops(barbershops.sort((a,b) => a.name.localeCompare(b.name)))
        } else {
            setAlphabeticalOrder(!alphabeticalOrder)
            setBarbershops(barbershops.sort((a,b) => b.name.localeCompare(a.name)))
        }
    }

    function sortbyRatings() {
        if (ratingOrder) {
            setRatingOrder(!ratingOrder)
            setBarbershops(barbershops.sort((a,b) => a.rating - b.rating))
        } else {
            setRatingOrder(!ratingOrder)
            setBarbershops(barbershops.sort((a,b) => b.rating - a.rating))
        }
    }

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
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            onIconPress={() => setVisible(true)}
                            style={{width: '87%'}}
                        />
                        <Icon onPress={() => setVisible1(!visible1)} style={{margin: 8}} name='filter' color='#6200ee' size={26}/>
                    </View>
                    <Portal>
                        <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                            <RadioButton.Group onValueChange={newValue => setSearchVia(newValue)} value={searchVia}>
                                <Text>Search Via: </Text>
                                <RadioButton.Item label="Barbershop Name" value="name" />
                                <RadioButton.Item label="Ratings" value="rating" />
                                <RadioButton.Item label="Address" value="address" />
                                <RadioButton.Item label="Services" value="services__name" />
                                <RadioButton.Item label="Amenities" value="amenities__name" />
                            </RadioButton.Group>
                            <FormButton
                                title='Search'
                                loading={loading}
                                modeValue='contained'
                                onPress={() => searchBarbershop()}
                            />
                        </Modal>
                    </Portal>
                    <Portal>
                        <Modal visible={visible1} onDismiss={() => setVisible1(!visible1)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                                <TouchableOpacity onPress={() => sortAplhabetically()}>
                                    <View style={{flexDirection: 'row'}}>
                                        {alphabeticalOrder ? <Icon style={{margin: 8}} name='order-alphabetical-ascending' size={26}/> : <Icon style={{margin: 8}} name='order-alphabetical-descending' size={26}/>}
                                        <Text style={{color: 'white', marginTop: 10}}>Alphabetical Order {alphabeticalOrder ? 'ASC' : 'DESC'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => sortbyRatings()}>
                                    <View style={{flexDirection: 'row'}} >
                                        {ratingOrder ? <Icon style={{margin: 8}} name='star' size={26}/> : <Icon style={{margin: 8}} name='star' size={26}/>}
                                        <Text style={{color: 'white', marginTop: 10}}>Ratings {ratingOrder ? <Icon style={{margin: 10}} name='arrow-up' size={26} /> : <Icon style={{margin: 10}} name='arrow-down' size={26}/>}</Text>
                                    </View>
                                </TouchableOpacity>
                        </Modal>
                    </Portal>
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
                                            isVerified={barbershop.verified}
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
        fontSize: 20,
        marginBottom: 10
    }
})