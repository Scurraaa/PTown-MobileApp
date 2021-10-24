import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { Paragraph, Button } from 'react-native-paper';
import MapView, { Marker, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import axios from 'axios';
import { BASE_URL, SCREEN_WIDTH } from '../utils/constants';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel';
import { Rating } from 'react-native-ratings';

export default function MapScreen({ navigation })  {

    const [barbershops, setBarbershops] = useState([])
    const [loading, setLoading] = useState(false)
    const [latitude, setLatitude] = useState(0.00)
    const [longitude, setLongitude] = useState(0.00)
    const ref = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }
          setTimeout( async() => {
            let location = await Location.getCurrentPositionAsync();
            if (location) {
                setLatitude(location.coords.latitude)
                setLongitude(location.coords.longitude)
                setLoading(false);
            }
          }, 2000)
          await getBarbershops()
        })();
      }, []);

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
            console.log(responsed.data[0].photo)
            setBarbershops(responsed.data);
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
    }

    const renderItem = useCallback(({ item, index }) => (
        <View style={styles.cardContainer}>
            <View>
                <Text style={styles.titleStyle}>{item.name}</Text>
                <Rating
                    ratingCount={5}
                    imageSize={25}
                    startingValue={item.rating}
                    fractions={2}
                    tintColor={'rgba(0, 0, 0, 0.6)'}
                    ratingBackgroundColor={'rgba(0, 0, 0, 0.6)'}
                    readonly={true}
                />
            </View>
          <Image style={styles.cardImage} source={{ uri: item.photo }}/>
          <Button icon="details" mode="contained"  onPress={() => navigation.navigate('BarbershopDetails', {
                                            data: item
                                        })}>
             See Full Details
          </Button>
        </View>
      ), []);
    

    const onCarouselChange = (index) => {
        let location = barbershops[index]
        if (map.current) {
            map.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.005
            })
        }
    }

    if (loading) {
        return <Loading size='large'/>
    } else {
        return (
            <View style={styles.container}>
                <MapView 
                    ref={map}
                    style={styles.map}
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.005
                    }}>
                        {
                            barbershops.length > 0 ? (
                                barbershops.map((barber, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{
                                            latitude: barber.latitude,
                                            longitude: barber.longitude
                                        }}
                                    >
                                        <Callout onPress={() => navigation.navigate('BarbershopDetails', {
                                            data: barber
                                        })}>
                                            <View style={{width: 250, padding: 10}}>
                                                <Text style={{fontWeight: 'bold', fontSize: 25}}>
                                                    {barber.name}
                                                </Text>
                                                <Paragraph>
                                                    {barber.description}
                                                </Paragraph>
                                                <TouchableHighlight onPress= {()=> navigation.navigate('BarbershopDetails', {
                                                        data: barber
                                                    })} underlayColor='#dddddd'>
                                                    <View>
                                                        <Text>See Full Details</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </Callout>
                                    </Marker>
                                ))
                            ) : (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text>No Fetched Data</Text>
                                </View>
                            )
                        }
                </MapView>
                <Carousel
                    ref={ref}
                    containerCustomStyle={styles.carousel}
                    data={barbershops}
                    renderItem={renderItem}
                    sliderWidth={SCREEN_WIDTH}
                    itemWidth={300}
                    onSnapToItem={(index) => onCarouselChange(index)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 48
    },
    cardContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: 250,
        width: 300,
        padding: 24,
        borderRadius: 24
    },
    cardImage: {
        height: 120,
        width: 300,
        bottom: 0,
        position: 'absolute',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    titleStyle: {
        color: 'white',
        fontSize: 24,
        alignSelf: 'center'
    }
})