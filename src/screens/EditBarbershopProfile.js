import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Pressable, Picker } from 'react-native';
import { Title, TextInput } from 'react-native-paper';
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { DayPicker } from 'react-native-picker-weekday'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { BASE_URL, TOAST_TIMEOUT, MAP_QUEST, MAP_QUEST_BASE_URL, POLOMOLOK_BARANGAYS } from '../utils/constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


export default function EditProfileBarbershop( {route, navigation} ) {
    const data = route.params;
    const days = route.params.profile.barbershop[0].hours[0].day.split(' - ')
    const weekdayArray = []
    if (days[0] === 'Monday' && days[1] === 'Friday') {
        weekdayArray.push(2, 3, 4, 5, 6)
    } else if (days[0] === 'Tuesday' && days[1] === 'Friday') {
        weekdayArray.push(3, 4, 5, 6)
    } else if (days[0] === 'Wednesday' && days[1] === 'Friday') {
        weekdayArray.push(4, 5, 6)
    } else if (days[0] === 'Thursday' && days[1] === 'Friday') {
        weekdayArray.push(4, 5)
    } else if (days[0] === 'Monday' && days[1] === 'Saturday') {
        weekdayArray.push(2, 3, 4, 5, 6, 7)
    } else if (days[0] === 'Tuesday' && days[1] === 'Saturday') {
        weekdayArray.push(3, 4, 5, 6, 7)
    } else if (days[0] === 'Wednesday' && days[1] === 'Saturday') {
        weekdayArray.push(4, 5, 6, 7)
    } else if (days[0] === 'Thursday' && days[1] === 'Saturday') {
        weekdayArray.push(5, 6, 7)
    } else if (days[0] === 'Friday' && days[1] === 'Sunday') {
        weekdayArray.push(6, 7)
    }
    const [username, setUsername] = useState(route.params.profile.user.username);
    const [email, setEmail] = useState(route.params.profile.user.email);
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState(route.params.profile.user.first_name);
    const [lname, setLname] = useState(route.params.profile.user.last_name);
    const [barbershopContact, setbarbershopContact] = useState(route.params.profile.contact_number);
    const [barbershopAddress, setbarbershopAddress] = useState(route.params.profile.address);
    const [barbershopName, setbarbershopName] = useState(route.params.profile.barbershop[0].name);
    const [barbershopDescription, setbarbershopDescription] = useState(route.params.profile.barbershop[0].description);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(route.params.profile.barbershop[0].photo);
    const [image1, setImage1] = useState(route.params.profile.barbershop[0].document);
    const [weekdays, setWeekdays] = React.useState(weekdayArray)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [opening, setOpening] = useState(route.params.profile.barbershop[0].hours[0].opening_time);
    const [closing, setClosing] = useState(route.params.profile.barbershop[0].hours[0].closing_time);
    const [textValueService, setTextValueService] = useState(''); 
    const [textValueServicePrice, setTextValueServicePrice] = useState(''); 
    const [numInputsService, setNumInputsService] = useState(route.params.profile.barbershop[0].services.length);
    const servicesRefInputs = useRef([textValueService]);
    const priceServicesRefInputs = useRef([textValueServicePrice]);
    const [textValueAmenities, setTextValueAmenities] = useState('');
    const [numInputsAmenities, setNumInputsAmenities] = useState(route.params.profile.barbershop[0].amenities.length);
    const amenitiesRefInputs = useRef([textValueAmenities]);
    const [loading, setLoading] = useState(false)
    const [street, setStreet] = useState(route.params.profile.barbershop[0].street)
    const [city, setCity] = useState(route.params.profile.barbershop[0].city)
    const [barangay, setBarangay] = useState(route.params.profile.barbershop[0].barangay)
    const [zipCode, setZipCode] = useState(route.params.profile.barbershop[0].postal_code)

    const inputs = [];

    const inputs1 = [];

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const showDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };
    
    const hideDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };

    const handleConfirmOpening = (date) => {
        const format1 = 'HH:mm A'
        let date1 = new Date(date)
        const formattedDate = moment(date1).format(format1);
        setOpening(formattedDate);
        hideDatePicker();
    };

    const handleConfirmClosing = (date) => {
        const format1 = 'HH:mm A'
        let date1 = new Date(date)
        const formattedDate = moment(date1).format(format1);
        setClosing(formattedDate);
        hideDatePicker();
    };

    async function  addImage()  {
        let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
          });
        if (!_image.cancelled) {
            setImage(_image.uri);
        }
      };

      async function  addImage1()  {
        let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
          });
        if (!_image.cancelled) {
            setImage1(_image.uri);
        }
      };

    for (let i = 0; i < numInputsService; i ++) {
        servicesRefInputs.current[i] = route.params.profile.barbershop[0].services[i].name
        priceServicesRefInputs.current[i] = route.params.profile.barbershop[0].services[i].price.toString()
        inputs.push(
            <View key={i} style={{flexDirection: 'row'}}>
                <FormInput
                    style={{width: 150, margin: 5}}
                    onChangeText={value => setInputValue(i, value)}
                    value={servicesRefInputs.current[i]}
                    labelName={`Service ${i + 1}`}
                />
                <FormInput
                    style={{width: 150, margin: 5}}
                    onChangeText={value => setInputValuePrice(i, value)}
                    value={priceServicesRefInputs.current[i]}
                    labelName={`Price Service ${i + 1}`}
                />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Pressable onPress={() => removeInput(i)}>
                        <AntDesign name="minuscircleo" size={20} color="red"/>
                    </Pressable>
                </View>
            </View>
        )
    }

    for (let i = 0; i < numInputsAmenities; i++) {
        amenitiesRefInputs.current[i] = route.params.profile.barbershop[0].amenities[i].name
        inputs1.push(
            <View key={i} style={{flexDirection: 'row'}}>
                <FormInput
                    style={{width: 300, margin: 5}}
                    onChangeText={value => setAmenitiesInputValue(i, value)}
                    value={amenitiesRefInputs.current[i]}
                    labelName={`Amenities ${i + 1}`}
                />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Pressable onPress={() => removeInput1(i)}>
                        <AntDesign name="minuscircleo" size={20} color="red"/>
                    </Pressable>
                </View>
            </View>
        )
    }

    const setInputValue = (index, value) => {
        const inputs = servicesRefInputs.current;
        const inputs1 = route.params.profile.barbershop[0].services
        inputs[index] = value;
        inputs1[index].name = value;
        setTextValueService(value)
    }

    const setInputValuePrice = (index, value) => {
        const inputs = priceServicesRefInputs.current;
        const inputs1 = route.params.profile.barbershop[0].services
        inputs[index] = value;
        inputs1[index].price = value;
        setTextValueServicePrice(value)
    }

    const addInput = () => {
        servicesRefInputs.current.push('')
        priceServicesRefInputs.current.push('')
        route.params.profile.barbershop[0].services.push({name: '', price: ''})
        setNumInputsService(value => value + 1)
    }

    const removeInput = (i) => {
        servicesRefInputs.current.splice(i, 1)[0];
        priceServicesRefInputs.current.splice(i, 1)[0];
        route.params.profile.barbershop[0].services.splice(i, 1)[0];
        setNumInputsService(value => value - 1);
    }

    const setAmenitiesInputValue = (index, value) => {
        const inputs = amenitiesRefInputs.current;
        const inputs1 = route.params.profile.barbershop[0].amenities
        inputs[index] = value
        inputs1[index].name = value
        setTextValueAmenities(value)
    }

    const addInput1 = () => {
        amenitiesRefInputs.current.push('')
        route.params.profile.barbershop[0].amenities.push({name: ''})
        setNumInputsAmenities(value => value + 1)
    }

    const removeInput1 = (i) => {
        amenitiesRefInputs.current.splice(i, 1)[0];
        route.params.profile.barbershop[0].amenities.splice(i, 1)[0];
        setNumInputsAmenities(value => value - 1);
    }

    async function patchProfile() {
        setLoading(true)
        console.log('PATCH PROFILE')
        const token = await AsyncStorage.getItem('token')
        console.log(route.params.profile.id)
        await axios({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/profile/${route.params.profile.id}/`,
            data: {
                user: {
                    username: username,
                    password: password,
                    first_name: fname,
                    last_name: lname,
                    email: email
                },
                contact_number: barbershopContact,
                address: barbershopAddress
            }
        }).then(async(response) => {
            console.log('DONE PATCH PROFILE')
            console.log(response.data)
            setbarbershopAddress(`${street} Brgy. ${barangay} ${city}`)
            patchBarbershopPhoto()

        }).catch((e) => {
            console.log('ERROR ON PATCH PROFILE', e.response)
        })
    }

    async function patchBarbershopPhoto() {
        console.log('PATCH BARBERSHOP PHOTO')
        const token = await AsyncStorage.getItem('token')
        const formData = new FormData()
        formData.append('photo', {
            uri: image,
            type: 'image/jpeg',
            name: '22232323.jpg'
        })
        formData.append('document', {
            uri: image1,
            type: 'image/jpeg',
            name: '2323213.jpg'
        })
        await axios({
            method: 'PATCH',
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/barbershop/${route.params.profile.barbershop[0].id}/`,
            data: formData
        }).then(async(response) => {
            console.log('DONE PATCH BARBERSHOP PHOTO')
            console.log(response.data)
            patchBarberShop()
        }).catch((e) => {
            console.log('ERROR ON PATCH BARBERSHOP PHOTO', e)
        })
    }

    // async function getCoordinates(address) {
    //     console.log('GET COORDINATES')
    //     await axios({
    //         method: 'GET',
    //         url: `${MAP_QUEST_BASE_URL}/geocoding/v1/address?key=${MAP_QUEST}&location=${address}`
    //       }).then(async(response) => {
    //         console.log(response.data)
    //         const lat = response.data.results[0].locations[0].latLng.lat
    //         const lng = response.data.results[0].locations[0].latLng.lng
    //         console.log('DONE GET COORDINATES')
    //         patchBarberShop(lat, lng)
    //       }).catch((e) => {
    //         console.log(e)
    //       })
    // }

    async function patchBarberShop() {
        console.log('PATCH BARBERSHOP FUNCTION')
        const token = await AsyncStorage.getItem('token')
        const amenitiesData = []
        const hoursData = []
        const servicesData = []
        amenitiesRefInputs.current.forEach((element) => {
            amenitiesData.push({
                name: element
            })
        })
        for (let i = 0; i < servicesRefInputs.current.length; i++) {
            servicesData.push({
                name: servicesRefInputs.current[i],
                price: priceServicesRefInputs.current[i]
            })
        }
        let day = ''
        if (weekdays) {
            const sortedWeekdays = weekdays.sort()
            if (sortedWeekdays[0] == 1) day += 'Sunday - '
            else if (sortedWeekdays[0] == 2) day += 'Monday - '
            else if (sortedWeekdays[0] == 3) day += 'Tuesday - '
            else if (sortedWeekdays[0] == 4) day += 'Wednesday - '
            else if (sortedWeekdays[0] == 5) day += 'Thursday - '
            else if (sortedWeekdays[0] == 6) day += 'Friday - '
            else if (sortedWeekdays[0] == 7) day += 'Saturday - '
            if (sortedWeekdays[sortedWeekdays.length - 1] == 1) day += 'Sunday'
            else if (sortedWeekdays[sortedWeekdays.length - 1] == 2) day += 'Monday'
            else if (sortedWeekdays[sortedWeekdays.length - 1] == 3) day += 'Tuesday'
            else if (sortedWeekdays[sortedWeekdays.length - 1] == 4) day += 'Wednesday'
            else if (sortedWeekdays[sortedWeekdays.length - 1] == 5) day += 'Thursday'
            else if (sortedWeekdays[sortedWeekdays.length - 1] == 6) day += 'Friday'
            else if (sortedWeekdays[sortedWeekdays.length - 1] == 7) day += 'Saturday'
            hoursData.push({
                day: day,
                opening_time: opening,
                closing_time: closing
            })
        }
        axios({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/barbershop/${route.params.profile.barbershop[0].id}/`,
            data: {
                amenities: amenitiesData,
                services: servicesData,
                hours: hoursData,
                name: barbershopName,
                description: barbershopDescription,
                street: street,
                barangay: barangay,
                city: city,
                postal_code: zipCode,
                address: `${street} ${barangay} ${city} ${zipCode}`,
                contact_number: barbershopContact,
                latitude: 0.00,
                longitude: 0.00
            }
        }).then(async function(responsed) {
            setLoading(false)
            console.log(responsed.data)
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'INFO',
                text2: 'Edit Successful!',
                visibilityTime: TOAST_TIMEOUT,
                style: {
                    backgroundColor: '#6200ee'
                },
                autoHide: true,
                onHide: () => {
                  navigation.pop()
                }
              })
        }).catch(function (e) {
            console.log('ERROR FROM PATCH', e.response.data)
        })
        console.log('DONE PATCH BARBERSHOP FUNCTION')
    }

    return (
        <View style={styles.container}>
            <ScrollView>
            <Title style={styles.titleText}>Edit Barbershop Profile</Title>
            <Text>User Credentials</Text>
            <FormInput
              labelName='Username'
              value={username}
              onChangeText={userName => setUsername(userName)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='First Name'
              value={fname}
              onChangeText={firstName => setFname(firstName)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='Last Name'
              value={lname}
              onChangeText={lastName => setLname(lastName)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='Email'
              value={email}
              autoCapitalize='none'
              onChangeText={userEmail => setEmail(userEmail)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='Password'
              value={password}
              secureTextEntry={true}
              onChangeText={userPassword => setPassword(userPassword)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='Confirm Password'
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={userConfirmPassword => setConfirmPassword(userConfirmPassword)}
              style={{width: '95%', marginTop: 10}}
            />
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: 20
                }}
            />
            <Text>Barbershop Details</Text>
            <View style={imageUploaderStyles.container}>
                {
                    image  && <Image source={{ uri: image }} style={{ width: "100%", height: 200 }} />
                }
                    
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                            <Text>{image ? 'Edit' : 'Upload'} Banner</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
            </View>
            <View style={imageUploaderStyles.container}>
                {
                    image1  && <Image source={{ uri: image1 }} style={{ width: "100%", height: 200 }} />
                }
                    
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage1} style={imageUploaderStyles.uploadBtn} >
                            <Text>{image1 ? 'Edit' : 'Upload'} Business Permit</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
            </View>
            <FormInput
              labelName='Barbershop Name'
              value={barbershopName}
              onChangeText={barbershopName => setbarbershopName(barbershopName)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='Barbershop Description'
              value={barbershopDescription}
              onChangeText={barbershopDescription => setbarbershopDescription(barbershopDescription)}
              style={{width: '95%', marginTop: 10}}
            />
            <FormInput
              labelName='Barbershop Street and Bldg. No.'
              value={street}
              numberOfLines={3}
              onChangeText={street1 => {
                setStreet(street1)
              }}
              style={{width: '95%', marginTop: 10}}
            />

            <View style={{
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 10,
                width: '95%',
            }}>
                <Picker
                    selectedValue={barangay}
                    onValueChange={(itemValue, itemIndex) => setBarangay(itemValue)}
                >
                    {POLOMOLOK_BARANGAYS.map((el, idx) => (
                        <Picker.Item key={idx} label={el} value={el}/>
                    ))}
                </Picker>
            </View>

            <FormInput
              labelName='Barbershop Postal Code'
              value={zipCode}
              onChangeText={zipCode1 => {
                setZipCode(zipCode1)
              }}
              numberOfLines={3}
              style={{width: '95%', marginTop: 10}}
            />

            <FormInput
              labelName='Barbershop Contact Number'
              value={barbershopContact}
              onChangeText={barbershopContact => setbarbershopContact(barbershopContact)}
              style={{width: '95%', marginTop: 10, marginBottom: 10}}
            />
            <Text>Opening Hours</Text>
            <DayPicker
                weekdays={weekdays}
                setWeekdays={setWeekdays}
                activeColor='#6200ee'
                textColor='white'
                inactiveColor='grey'
            />
            <View style={{flexDirection: 'row'}}>
                <FormInput
                    labelName='Opening Time'
                    value={opening}
                    onChangeText={userConfirmPassword => setConfirmPassword(userConfirmPassword)}
                    style={{width: '45%', marginTop: 10, marginBottom: 10, marginRight: 20}}
                    disabled={true}
                    right={
                        <TextInput.Icon name={'clock'} size={28} onPress={() => showDatePicker()}/>
                    }
                />
                <FormInput
                    labelName='Closing Time'
                    value={closing}
                    onChangeText={userConfirmPassword => setConfirmPassword(userConfirmPassword)}
                    style={{width: '45%', marginTop: 10, marginBottom: 10}}
                    disabled={true}
                    right={
                        <TextInput.Icon name={'clock'} size={28} onPress={() => showDatePicker1()}/>
                    }
                />

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirmOpening}
                    onCancel={hideDatePicker}
                />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible1}
                    mode="time"
                    onConfirm={handleConfirmClosing}
                    onCancel={hideDatePicker1}
                />
            </View>
            <Text>Services Available</Text>
            {inputs}
            <FormButton
              onPress={addInput}
              buttonStyle={{margin: 15}}
              title='Add a new Service input'
              modeValue='contained'
            />
            <Text>Amenities Available</Text>
            {inputs1}
            <FormButton
              onPress={addInput1}
              buttonStyle={{margin: 15}}
              title='Add a new Amenities input'
              modeValue='contained'
            />
            {username && email && password && fname && lname && confirmPassword && barbershopContact && barbershopDescription && barbershopName && image
            && opening && closing && weekdays.length != 0 ? (
            <FormButton
                onPress={patchProfile}
                buttonStyle={{marginTop: 15, marginRight: 10, marginBottom: 10}}
                title='Edit Barber Profile'
                modeValue='contained'
                loading={loading}
            />
            ) : (
                <View></View>
            )}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        marginTop: 40,
        marginLeft: 10
      },
      titleText: {
        fontSize: 24,
        marginBottom: 10
      }
})

const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height: 200,
        width: "95%", 
        backgroundColor:'#efefef',
        position:'relative',
        overflow:'hidden',
        margin: 5,
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'25%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    }
  })