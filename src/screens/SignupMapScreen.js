import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Loading from '../components/Loading';
import * as Location from 'expo-location';
import FormButton from '../components/FormButton';

export default function SignUpMapScreen({ navigation })  {

    const [loading, setLoading] = useState(false)
    const [latitude, setLatitude] = useState(0.00)
    const [longitude, setLongitude] = useState(0.00)
    const [coords, setCoords] = useState({})

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          console.log(status);
          if (status !== 'granted') {
            return;
          }
          let location = await Location.getCurrentPositionAsync();
          setCoords(location.coords)
            if (location) {
                setLatitude(location.coords.latitude)
                setLongitude(location.coords.longitude)
                setLoading(false);
            }
            console.log(coords)
        })();
      }, []);


    if (loading) {
        return <Loading size='large'/>
    } else {
        return (
            <View style={styles.container}>
               <MapView
                    style={{...StyleSheet.absoluteFillObject}}
                    showsUserLocation={true}
                    >
                        <Marker
                            coordinate={{
                                latitude: 0,
                                longitude: 0
                            }}
                            draggable={true}
                            onDragEnd={(coords) => console.log(coords)}
                        />
                </MapView>
                <View style={{position: 'absolute', bottom: 0, marginBottom: 40}}>
                    <FormButton
                        onPress={() => console.log('address set!')}
                        buttonStyle={{margin: 15}}
                        title='Set as Location'
                        modeValue='contained'
                    />
                </View>
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