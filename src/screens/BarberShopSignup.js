import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Pressable, CheckBox, Picker } from 'react-native';
import { Title, TextInput, Modal, Portal, Paragraph, Button } from 'react-native-paper';
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { DayPicker } from 'react-native-picker-weekday'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { BASE_URL, TOAST_TIMEOUT, MAP_QUEST, MAP_QUEST_BASE_URL, POLOMOLOK_BARANGAYS } from '../utils/constants';
import Toast from 'react-native-toast-message';
import axios from 'axios';


export default function BarberShopSignup( {route, navigation} ) {
    const data = route.params;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [barbershopContact, setbarbershopContact] = useState('');
    const [barbershopAddress, setbarbershopAddress] = useState('');
    const [barbershopName, setbarbershopName] = useState('');
    const [barbershopDescription, setbarbershopDescription] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [image1, setImage1] = useState(null);
    const [weekdays, setWeekdays] = React.useState([])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [opening, setOpening] = useState(null);
    const [closing, setClosing] = useState(null);
    const [textValueService, setTextValueService] = useState(''); 
    const [textValueServicePrice, setTextValueServicePrice] = useState(''); 
    const [numInputsService, setNumInputsService] = useState(1);
    const servicesRefInputs = useRef([textValueService]);
    const priceServicesRefInputs = useRef([textValueServicePrice]);
    const [textValueAmenities, setTextValueAmenities] = useState('');
    const [numInputsAmenities, setNumInputsAmenities] = useState(1);
    const amenitiesRefInputs = useRef([textValueAmenities]);
    const [loading, setLoading] = useState(false)
    const [isSelected, setSelection] = useState(false)
    const [visible, setVisible] = useState(false);
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('Polomolok, South Cotabato')
    const [barangay, setBarangay] = useState('')
    const [zipCode, setZipCode] = useState('')



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
        inputs[index] = value;
        setTextValueService(value)
    }

    const setInputValuePrice = (index, value) => {
        const inputs = priceServicesRefInputs.current;
        inputs[index] = value;
        setTextValueServicePrice(value)
    }

    const addInput = () => {
        servicesRefInputs.current.push('')
        priceServicesRefInputs.current.push('')
        setNumInputsService(value => value + 1)
    }

    const removeInput = (i) => {
        servicesRefInputs.current.splice(i, 1)[0];
        priceServicesRefInputs.current.splice(i, 1)[0];
        setNumInputsService(value => value - 1);
    }

    const setAmenitiesInputValue = (index, value) => {
        const inputs = amenitiesRefInputs.current;
        inputs[index] = value
        setTextValueAmenities(value)
    }

    const addInput1 = () => {
        amenitiesRefInputs.current.push('')
        setNumInputsAmenities(value => value + 1)
    }

    const removeInput1 = (i) => {
        amenitiesRefInputs.current.splice(i, 1)[0];
        setNumInputsAmenities(value => value - 1);
    }

    async function createUser() {
        console.log('CREATE USER FUNCTION')
        setLoading(true)
        const userData = {
            user: {
              username: username,
              first_name: fname,
              last_name: lname,
              email: email,
              password: password
            },
            contact_number: barbershopContact,
            address: barbershopAddress,
            account_type: 'owner'
          }
        axios({
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            url: `${BASE_URL}/api/profile/`,
            data: userData
        }).then(async function(responsed) {
            setbarbershopAddress(`${street} Brgy. ${barangay} ${city}`)
            getToken(responsed.data.id)
        }).catch(async function(e) {
            console.log(e);
        })
        console.log('DONE CREATE USER FUNCTION')
    }

    async function getToken(profileID) {
        console.log('GET TOKEN FUNCTION')
        axios({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            url: `${BASE_URL}/api/token/`,
            data: {
                username: username,
                password: password
            }
        }).then(async function(responsed) {
            await postBarbershop(responsed.data.access, profileID)
        })
        console.log('DONE GET TOKEN FUNCTION')
    }

    // async function getCoordinates(token, profileID, address) {
    //     console.log('GET COORDINATES')
    //     console.log(barbershopAddress);
    //     await axios({
    //         method: 'GET',
    //         url: `${MAP_QUEST_BASE_URL}/geocoding/v1/address?key=${MAP_QUEST}&location=${address}`
    //       }).then(async(response) => {
    //         const lat = response.data.results[0].locations[0].latLng.lat
    //         const lng = response.data.results[0].locations[0].latLng.lng
    //         await postBarbershop(token, profileID, lat, lng)
    //         console.log('DONE GET COORDINATES')
    //       }).catch((e) => {
    //         console.log(e)
    //         Toast.show({
    //             type: 'error',
    //             position: 'bottom',
    //             text1: "INFO",
    //             text2: 'Invalid Address',
    //             visibilityTime: TOAST_TIMEOUT,
    //             autoHide: true,
    //         })
    //         setLoading(false)
    //       })
    // }

    async function postBarbershop(token, profileID) {
        console.log('POST BARBERSHOP FUNCTION')
        const formData = new FormData()
        formData.append('name', barbershopName)
        formData.append('description', barbershopDescription)
        formData.append('street', street)
        formData.append('barangay', barangay)
        formData.append('city', city)
        formData.append('postal_code', zipCode)
        formData.append('address', `${street} ${barangay} ${city} ${zipCode}`)
        formData.append('contact_number', barbershopContact)
        formData.append('latitude', 0.00)
        formData.append('longitude', 0.00)
        formData.append('verified', false)
        formData.append('rating', 0)
        formData.append('photo', {
            uri: image,
            type: 'image/jpeg',
            name: 'name.jpg'
        })
        formData.append('document', {
            uri: image1,
            type: 'image/jpeg',
            name: 'document.jpg'
        })
        await axios({
          method: 'POST',
          headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          url: `${BASE_URL}/api/barbershop/`,
          data: formData
        }).then(async function(responsed) {
            console.log("RESPONSE FROM POST BARBERSHOP", responsed.data)
            await patchBarberShop(responsed.data.id, token, profileID)
        }).catch(function(e) {
            console.log('ERROR FROM POST BARBERSHOP', e.response.data)
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: "INFO",
                text2: 'Error Listing Barbershop',
                visibilityTime: TOAST_TIMEOUT,
                autoHide: true,
            })
        })
        setLoading(false)
        console.log('DONE POST BARBERSHOP FUNCTION')
    }

    async function patchBarberShop(id, token, profileID) {
        console.log('PATCH BARBERSHOP FUNCTION ID:', id)
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
        await axios({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/barbershop/${id}/`,
            data: {
                amenities: amenitiesData,
                services: servicesData,
                hours: hoursData
            }
        }).then(async function(responsed) {
            await attachBarbershop(profileID, responsed.data, token)
        }).catch(function (e) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: "INFO",
                text2: 'Error Listing Barbershop',
                visibilityTime: TOAST_TIMEOUT,
                autoHide: true,
            })
            setLoading(false)
            console.log('ERROR FROM PATCH', e.response.data)
        })
        console.log('DONE PATCH BARBERSHOP FUNCTION')
    }

    async function attachBarbershop(profileID, barbershopData, token) {
        console.log('ATTACH BARBERSHOP FUNCTION')
        axios({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            url: `${BASE_URL}/api/profile/${profileID}/`,
            data: {
                barbershop: [
                    barbershopData
                ]
            }
        }).then(async function(responsed) {
            console.log('RESPONSE FROM PATCH PROFILE', responsed.data)
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'INFO',
                text2: 'Successfully Registered!',
                visibilityTime: TOAST_TIMEOUT,
                style: {
                    backgroundColor: '#6200ee'
                },
                autoHide: true,
                onHide: () => {
                  navigation.navigate('Login')
                }
              })
            setLoading(false)
        }).catch(function (e) {
            console.log('ERROR FROM PATCH PROFILE', e.response.data)
        })
        console.log('DONE ATTACH BARBERSHOP FUNCTION')
    }

    return (
        <View style={styles.container}>
            <ScrollView>
            <Title style={styles.titleText}>{
                data.registerAs === 'customer' ? 'Register as Customer' : 'Register as Barbershop'
            }</Title>
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
              labelName='Barbershop Street and Bldg No.'
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
            <View style={{flexDirection: 'row', marginBottom: 20, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <CheckBox
                value={isSelected}
                tintColors={{ true: '#6200ee'}}
                onValueChange={setSelection}
                style={{alignSelf: 'center'}}
              />
              <TouchableOpacity style={{margin: 8}} onPress={() => setVisible(!visible)}>
                <Text style={{margin: 8}}>I agree to the <Text style={{color:'#6200ee', }}>Privacy Policy</Text></Text>
              </TouchableOpacity>
              <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20}}>
                  <Paragraph>
                    In 2012, the Philippines passed Republic Act No. 10173 or the Data Privacy Act of 2012 (DPA) “to protect the fundamental human right to privacy of communication while ensuring free flow of information to promote innovation and growth [and] the [State’s] inherent obligation to ensure that personal information in information and communications systems in government and in the private sector are secured and protected”. 
                    The DPA was passed in accordance with the Philippines agreements under ASEAN Vision 2020 and at the urging of the growing business process outsourcing industry. The law was modeled after the Data Protection Directive (95/46/EC) with many of its terminologies and provisions similar to privacy laws in other jurisdictions.

                    The DPA and its Implementing Rules and Regulations (IRR) apply to all acts done or practices engaged in and outside of the Philippines if:

                    If the person, either an individual or an institution, involved in the processing of personal data is located in the Philippines;
                    The act or practice involves personal data of a Philippine citizen or Philippine resident;
                    The processing of personal data is done in the Philippines; or
                    The act, practice or processing of personal data is done by an entity with links to the Philippines, subject to international law and comity.
                    “Personal data” refers to all types of personal information.

                    “Processing” is any operation/s performed upon personal data. These operations include, but are not limited to the collection, recording, organization, storage, updating or modification, retrieval, consultation, use, consolidation, blocking, erasure, or destruction of data.
                  </Paragraph>
                </Modal>
            </Portal>
            </View>
            {username && email && password && fname && lname && confirmPassword && barbershopContact && barbershopDescription && barbershopName && image
            && opening && closing && weekdays.length != 0 ? (
            <FormButton
                onPress={createUser}
                buttonStyle={{marginRight: 10, marginBottom: 10}}
                title='Apply for Listing'
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