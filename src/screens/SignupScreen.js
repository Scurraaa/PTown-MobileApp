import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL, SCREEN_WIDTH, TOAST_TIMEOUT } from '../utils/constants';
import Toast from 'react-native-toast-message';
import Loading from '../components/Loading';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ route, navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  function register(userType) {
    if (username && email && password &&  confirmPassword && fname && lname && address) {
      setLoading(true);
      if (password === confirmPassword) {
        const userData = {
          user: {
            username: username,
            first_name: fname,
            last_name: lname,
            email: email,
            password: password
          },
          contact_number: contact,
          address: address,
          account_type: userType === 'customer' ? 'user' : 'owner'
        }
        const axiosReq = axios({
          method: 'POST',
          url: `${BASE_URL}/api/profile/`,
          data: userData
        }).then(async function(response) {
          console.log('RESPONSE DATA', response.data)
          const responseData = await response.data
          getToken(username, password)
          uploadPhoto(responseData.id)
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
              navigation.navigate('Home')
            }
          })
        }).catch(function(error){
          console.log('ERROR DATA1', error)
          console.log('ERROR DATA2', error.response.data)
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'INFO',
            text2: 'Unsuccessfully on registering',
            visibilityTime: TOAST_TIMEOUT,
            style: {
                backgroundColor: '#6200ee'
            },
            autoHide: true,
          })
        })
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'INFO',
          text2: 'Password mismatch!',
          visibilityTime: 5000,
          style: {
              backgroundColor: '#6200ee'
          },
        })
      }
    } else {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'INFO',
        text2: 'Missing Field maybe in the following: email, password, first name, last name and address',
        visibilityTime: 5000,
        style: {
            backgroundColor: '#6200ee'
        },
      })
    }
    setLoading(false);
  }

  function getToken(username, password) {
    axios({
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      url: `${BASE_URL}/api/token/`
    }).then(async (response) => {
      await AsyncStorage.setItem('token', response.data.access)
      await AsyncStorage.setItem('loggedin', "true")
    })
  }

  function uploadPhoto(id) {
    if (image) {
      const formData = new FormData()
      formData.append('photo', {
        uri: image,
        type: 'image/jpeg',
        name: 'name.jpg'
      })
      axios({
        headers: {
          'content-type': 'multipart/form-data'
        },
        method: 'PATCH',
        url: `${BASE_URL}/api/profile/${id}/`,
        data: formData
      }).then(async function(response) {
        console.log('RESPONSE FROM PATCH', response.data)
      }).catch(function(error) {
        console.log('ERROR FROM PATCH1', error)
        console.log('ERROR FROM PATCH2', error.response)
      })
    }
  }


  const data = route.params;

  return (
    <View style={styles.container}>
      <ScrollView>
      <Title style={styles.titleText}>{
        data.registerAs === 'customer' ? 'Register as Customer' : 'Register as Barbershop'
      }</Title>
      {
        data.registerAs === 'customer' ? (
          <View style={styles.containerForm}>
            <View style={imageUploaderStyles.container}>
                {
                    image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                }
                    
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                            <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
              

            </View>
            <FormInput
              labelName='Username'
              value={username}
              onChangeText={userName => setUsername(userName)}
            />
            <FormInput
              labelName='First Name'
              value={fname}
              onChangeText={firstName => setFname(firstName)}
            />
            <FormInput
              labelName='Last Name'
              value={lname}
              onChangeText={lastName => setLname(lastName)}
            />
            <FormInput
              labelName='Contact Number'
              value={contact}
              autoCapitalize='none'
              onChangeText={userContact => setContact(userContact)}
            />
            <FormInput
              labelName='Address'
              value={address}
              autoCapitalize='none'
              onChangeText={userAddress => setAddress(userAddress)}
            />
            <FormInput
              labelName='Email'
              value={email}
              autoCapitalize='none'
              onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
              labelName='Password'
              value={password}
              secureTextEntry={true}
              onChangeText={userPassword => setPassword(userPassword)}
            />
            <FormInput
              labelName='Confirm Password'
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={userConfirmPassword => setConfirmPassword(userConfirmPassword)}
            />
            <FormButton
              title='Signup'
              loading={loading}
              modeValue='contained'
              buttonStyle={styles.signupButtonContainer}
              labelStyle={styles.signupButtonLabel}
              onPress={() => register(data.registerAs)}
            />
            <IconButton
              icon='keyboard-backspace'
              size={30}
              style={styles.navButton}
              color='#6646ee'
              onPress={() => navigation.goBack()}
            />
          </View>
        ) : (
          <>
            <FormInput
              labelName='Email'
              value={email}
              autoCapitalize='none'
              onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
              labelName='Password'
              value={password}
              secureTextEntry={true}
              onChangeText={userPassword => setPassword(userPassword)}
            />
            <FormButton
              title='Signup'
              modeValue='contained'
              loading={loading}
              buttonStyle={styles.signupButtonContainer}
              labelStyle={styles.signupButtonLabel}
            />
            <IconButton
              icon='keyboard-backspace'
              size={30}
              style={styles.navButton}
              color='#6646ee'
              onPress={() => navigation.goBack()}
            />
          </>
        )
      }
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    marginTop: 40,
    marginLeft: 10
  },
  containerForm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  signupButtonContainer: {
    width: SCREEN_WIDTH / 1.5
  },
  signupButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 18
  },
  navButton: {
    marginTop: 10
  }
});

const imageUploaderStyles=StyleSheet.create({
  container:{
      elevation:2,
      height:150,
      width:150, 
      backgroundColor:'#efefef',
      position:'relative',
      borderRadius:999,
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