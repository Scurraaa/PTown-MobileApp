import React, { useState, useEffect } from 'react';
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
import Loading from '../components/Loading';


export default function RevampedBarbershopDetails({ navigation, route }) {
    const [data, setData] = useState();
    const [toggleButton, setToggleButton] = useState(false);
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading , setLoading] = useState(false)

    const animation = React.useRef(null);
    const isFirstRun = React.useRef(true);


    useEffect(() => {
        getBarbershop()
    }, [])

    async function getBarbershop() {
        setLoading(true)
        const token = await AsyncStorage.getItem('token')
        const barbershopID = await AsyncStorage.getItem('barbershopID')
        await axios({
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/barbershop/${barbershopID}/`
        }).then(async(response) => {
            setData(response.data)
            console.log(data)
            setLoading(false)
        })
    }
    // React.useEffect(() => {
    //     if (isFirstRun.current) {
    //       if (isLiked) {
    //         animation.current.play(66, 66);
    //       } else {
    //         animation.current.play(19, 19);
    //       }
    //       isFirstRun.current = false;
    //     } else if (isLiked) {
    //       animation.current.play(19, 50);
    //     } else {
    //       animation.current.play(0, 19);
    //     }
    //   }, [isLiked]);

    
      async function postComment(barberId, comment2) {
        const commentObj = {
            type: "positive",
            text: comment,
            rating: rating,
        }
        const token = await AsyncStorage.getItem('token')
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        const axiosReq = await axios({
            method: 'PATCH',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/${barberId}/`,
            data: {
                comments: [
                    ...comment2,
                    commentObj
                ]
            }
        }).then(async function (responsed) {
            setData(responsed.data)
            setVisible(!visible)
        }).catch(function(error){
            console.log('ERROR DATA1', error.response.data);
        })
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
    }

    async function setAppointment(date, time, barbershopID) {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        await axios({
            method: 'POST',
            headers: headers,
            url: `${BASE_URL}/api/barbershop/${barbershopID}/add_appointment/`,
            data: {
                date: date,
                time: time
            }
        }).then(async function(responsed) {
            console.log('RESPONSE FROM ADD APPOINTMENT', responsed.data)
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: "INFO",
                text2: 'Successfully set an appointment!',
                visibilityTime: TOAST_TIMEOUT,
                autoHide: true,
            })
        }).catch(function(error) {
            console.log('ERROR ON ADD APPOINTMENT:', error.response.data)
            if (error.response.status == 400) {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: "INFO",
                    text2: error.response.data.non_field_errors[0],
                    visibilityTime: TOAST_TIMEOUT,
                    autoHide: true,
                })
            }
        })
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date, id) => {
        console.log(date);
        const format1 = 'hh:mm'
        const format2 = 'YYYY-MM-DD'
        let date1 = new Date(date)
        let date2 = new Date(date)
        const formattedDate = moment(date1).format(format1);
        const formattedDate2 = moment(date2).format(format2)
        console.log(formattedDate, formattedDate2)
        hideDatePicker();
        setAppointment(formattedDate2, formattedDate, id);
    };

    if (loading || !data) {
        return (
            <Loading size='large'/>
        )
    } else {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Image source={{ uri: data.photo }} style={{ width: '100%', height: 250 }} />
                    <View style={styles.innerContainer}>
                        <View style={styles.nameAndFavoriteContainer}>
                            <View>
                                <Text style={styles.barberName}>{data.name} {data.verified ? <Icon name='check-decagram' color='#6200ee' size={18}/> : <View></View>}</Text>
                            </View>
                            {/* <View style={{ marginLeft: 'auto'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setisLiked(!isLiked)
                                        setAsFavorite(data.data.id)
                                    }}
                                >
                                    <LottieView
                                        ref={animation}
                                        style={styles.heartLottie}
                                        source={require("../../assets/like.json")}
                                        autoPlay={false}
                                        loop={false}
                                        resizeMode="cover"
                                />
                                </TouchableOpacity>
                            </View> */}
                        </View>
                        <View style={styles.addressContainer}>
                            <Icon name='map-marker' color='#000' size={18}/>
                            <Text style={styles.address}>
                                {data.address}
                            </Text>
                        </View>
                        <View>
                            {
                                data.hours.length > 0 ? (
                                    data.hours.map((opening) => {
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
                                    <Text style={styles.aboutTitle}>{data.description}</Text>
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
                                        {data.services.length > 0 ? (
                                            data.services.map((service) => {
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
                                        {data.amenities.length > 0 ? (
                                            data.amenities.map((amenities) => {
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
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="datetime"
                                        onConfirm={(date) => handleConfirm(date, data.id)}
                                        onCancel={hideDatePicker}
                                        minimumDate={new Date()}
                                    />
                                </View>
                        ) : (
                            <View>
                                <View style={styles.ratingContainer}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Overall Rating</Text>
                                    <Text style={styles.ratingText}>{data.rating}</Text>
                                    <Rating
                                        ratingCount={5}
                                        imageSize={25}
                                        startingValue={data.rating}
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
                                        data.comments.length > 0 ? (
                                            data.comments.map((comment) => {
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
                                    <Button icon="comment" mode="contained" onPress={() => setVisible(!visible)}>
                                        Add Comment
                                    </Button>
                                    <Portal>
                                        <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                                        <TextInput
                                            label="Comment"
                                            value={comment}
                                            multiline={true}
                                            numberOfLines={5}
                                            onChangeText={comment => setComment(comment)}
                                            style={{marginBottom: 10}}
                                        />
                                        <Rating
                                            ratingCount={5}
                                            imageSize={25}
                                            startingValue={rating}
                                            fractions={2}
                                            tintColor={'#efefef'}
                                            onFinishRating={(rtng) => setRating(rtng)}
                                            style={{marginBottom: 10}}
                                        />
                                        <Button icon="comment" mode="contained" onPress={() => postComment(data.id, data.comments)}>
                                            Submit Comment
                                        </Button>
                                        </Modal>
                                    </Portal>
                            
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                    </ScrollView>
            </View>
        )
    }
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