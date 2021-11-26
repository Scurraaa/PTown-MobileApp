import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from 'react-native';
import LottieView from "lottie-react-native";
import { Button, TextInput, Modal, Portal } from 'react-native-paper';
import { SCREEN_WIDTH } from '../utils/constants';
import { Rating } from 'react-native-ratings';
import Comment from '../components/Comment';
import axios from 'axios';
import { BASE_URL, TOAST_TIMEOUT } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Toast from 'react-native-toast-message'


export default function SignupBarbershopDetails({ navigation, route }) {
    const [data, setData] = useState(route.params);
    const [isLiked, setisLiked] = useState(route.params.data.favorite);
    const [toggleButton, setToggleButton] = useState(false);
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    
    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{ uri: data.data.photo }} style={{ width: '100%', height: 250 }} />
                <View style={styles.innerContainer}>
                    <View style={styles.nameAndFavoriteContainer}>
                        <View>
                            <Text style={styles.barberName}>{data.data.name} {data.data.verified ? <Icon name='check-decagram' color='#6200ee' size={18}/> : <View></View>}</Text>
                        </View>
                    </View>
                    <View style={styles.addressContainer}>
                        <Icon name='map-marker' color='#000' size={18}/>
                        <Text style={styles.address}>
                            {data.data.address}
                        </Text>
                    </View>
                    <View>
                        {
                            data.data.hours.length > 0 ? (
                                data.data.hours.map((opening) => {
                                    return(
                                        <View style={styles.hoursContainer} key={opening.id}>
                                            <Icon name='clock-time-five-outline' color='#000' size={18}/>
                                            <Text style={styles.address}>
                                                {opening.opening_time} - {opening.closing_time} ({opening.day})
                                            </Text>
                                        </View>
                                    )
                                })
                            ) : (
                                <View style={styles.hoursContainer}>
                                    <Icon name='close-octagon-outline' color='#000' size={18}/>
                                    <Text style={styles.address}>
                                        Closed
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginTop: 10,
                            marginBottom: 10
                        }}
                    />
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={toggleButton ? styles.nonaboutButton : styles.aboutButton}
                        onPress={() => setToggleButton(false)}
                    >
                        <Text>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={toggleButton ? styles.feedBackButton : styles.nonfeedBackButton}
                        onPress={() => setToggleButton(true)}
                    >
                        <Text>Feed Back</Text>
                    </TouchableOpacity>
                    </View>
                    {!toggleButton ? (
                            <View style={styles.aboutContainer}>
                                <Text style={styles.aboutTitle}>{data.data.description}</Text>
                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                />
                                <Text style={styles.aboutTitle}>Services</Text>
                                <View style={styles.servicesContainer}>
                                    {data.data.services.length > 0 ? (
                                        data.data.services.map((service) => {
                                            return (
                                                <View style={styles.serviceContainer} key={service.id}>
                                                    <Text style={styles.address}>
                                                        {service.name} - {'\u20B1'} {service.price}
                                                    </Text>
                                                </View>
                                            )
                                        })
                                    ) : (
                                        <View style={styles.servicesContainer}>
                                            <Text>No Available Services</Text>
                                        </View>
                                    )}
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                />
                                <Text style={styles.aboutTitle}>Amenities</Text>
                                <View style={{marginBottom: 10}}>
                                    {data.data.amenities.length > 0 ? (
                                        data.data.amenities.map((amenities) => {
                                            return (
                                                <View style={styles.serviceContainer} key={amenities.id}>
                                                    <Text style={styles.address}>
                                                        {amenities.name}
                                                    </Text>
                                                </View>
                                            )
                                        })
                                    ) : (
                                        <View style={styles.servicesContainer}>
                                            <Text>No Available Amenities</Text>
                                        </View>
                                    )}
                                </View>
                                <Button icon="book" mode="contained" onPress={() => navigation.navigate('RegisterAs')}>
                                    Book an Appointment!
                                </Button>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={(date) => handleConfirm(date, data.data.id)}
                                    onCancel={hideDatePicker}
                                    minimumDate={new Date()}
                                />
                            </View>
                    ) : (
                        <View>
                            <View style={styles.ratingContainer}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Overall Rating</Text>
                                <Text style={styles.ratingText}>{data.data.rating}</Text>
                                <Rating
                                    ratingCount={5}
                                    imageSize={25}
                                    startingValue={data.data.rating}
                                    fractions={2}
                                    tintColor={'#efefef'}
                                    readonly={true}
                                />
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                    marginTop: 10,
                                    marginBottom: 10
                                }}
                            />
                            <View>
                                {
                                    data.data.comments.length > 0 ? (
                                        data.data.comments.map((comment) => {
                                            return(
                                                <View key={comment.id}>
                                                    <Comment data={comment} user={comment.user}/>
                                                    <View
                                                        style={{
                                                            borderBottomColor: 'black',
                                                            borderBottomWidth: 1,
                                                            marginTop: 10,
                                                            marginBottom: 10
                                                        }}
                                                    />
                                                </View>
                                            )
                                        })
                                    ) : (
                                        <View>
                                            <Text style={{fontWeight: 'bold'}}>No Comments Available</Text>
                                        </View>
                                    )
                                }
                                <View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
    },
    innerContainer: {
        margin: 15
    },
    barberName: {
        fontSize: 20,
        fontWeight: '700'
    },
    address: {
        fontSize: 13,
        fontWeight: '100',
        marginLeft: 5
    },
    addressContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    hoursContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    barbershops: {
        fontSize: 20
    },
    backgroundImage: {
        width: '50%',
        height: '50%',
        display: 'flex'
    },
    nameAndFavoriteContainer: {
        flexDirection: "row",
    },
    heartLottie: {
        width: 40,
        height: 40,
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    aboutButton: {
        alignItems:'center',
        justifyContent:'center',
        width: SCREEN_WIDTH / 2 - 20,
        borderBottomWidth:2,
        borderBottomColor: "#6200ee",
        padding: 10,
    },
    feedBackButton: {
        alignItems:'center',
        justifyContent:'center',
        width: SCREEN_WIDTH / 2 - 10,
        borderBottomWidth:2,
        borderBottomColor: "#6200ee",
        padding: 10,
    },
    nonaboutButton: {
        alignItems:'center',
        justifyContent:'center',
        width: SCREEN_WIDTH / 2 - 20,
        padding: 10,
    },
    nonfeedBackButton: {
        alignItems:'center',
        justifyContent:'center',
        width: SCREEN_WIDTH / 2 - 10,
        padding: 10,
    },
    aboutContainer: {
        marginTop: 10,
    },
    aboutTitle: {
        fontSize: 15,
    },
    ratingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    ratingText: {
        fontSize: 20
    },
})