import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from '../components/CustomCard';

export default function HomeScreen({ navigation })  {


    const [topBarber, setTopBarber] = useState([
        {
            id: "1",
            name: 'BarberoKo',
            address: 'Dama de Noche St. Polomolok, Public Market',
            description: "Owned by Ms. Jodil Sibala\nNot Available for Home Service",
            photo: "https://drive.google.com/uc?id=1AV1xFuAcHnsvdonLQfipHzq7b1VI7Pje&export=download",
            contact: "09486882402",
            favorite: false
        }
    ])

    const [myFavorite, setMyFavorite] = useState([
        {
            id: "3",
            name: "Omeng's Barbershop",
            address: 'French Street, Polomolok South Cotabato 9504 Polomolok, Philippines',
            description: "French Street, Polomolok South Cotabato 9504 Polomolok, Philippines",
            photo: "https://drive.google.com/uc?id=1OuQEiw7byP_sV5dzCHayK6RMhL0lRmHf&export=download",
            contact: "09486882402",
            favorite: true
        },
        {
            id: "4",
            name: "Juan Barbero",
            address: 'Pioneer Ave., Poblacion Pomolok, Philippines',
            description: "Owned by Ms. Glenda Altamera,\nand it was established in year 2017.\nAvailable for home services.",
            photo: "null",
            contact: "09486882402",
            favorite: true
        }
    ])

    useEffect(() => {
        getData();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])

    async function getData() {
        const token = await AsyncStorage.getItem('token')
        const loggedIn = await AsyncStorage.getItem('loggedin')
        console.log(token, loggedIn)
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.top}>Top Barbershop of the Month</Text>
                <View style={styles.topContainer}>
                    <CustomCard
                        data={topBarber[0]} 
                        isLiked={topBarber[0].favorite}
                        onLike={(id) =>
                            setTopBarber(() => {
                            return topBarber.map((barber) => {
                                if (barber.id === id) {
                                return { ...barber, favorite: !barber.favorite };
                                }
                                return barber;
                            });
                            })
                        }
                    />
                </View>
                <Text style={styles.top}>My Favorite Barbershop</Text>
                <View style={styles.myContainer}>
                        {
                            myFavorite.map((favorites) => {
                                return(
                                    <CustomCard
                                        key={favorites.id}
                                        data={favorites} 
                                        isLiked={favorites.favorite}
                                        onLike={(id) =>
                                            setMyFavorite(() => {
                                                return myFavorite.map((barber) => {
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
                </View>
            </ScrollView>
        </View>
    )
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
    }
})