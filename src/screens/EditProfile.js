import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL, SCREEN_WIDTH, TOAST_TIMEOUT } from '../utils/constants';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen({ route, navigation }) {

  console.log(route.params);

  const [username, setUsername] = useState(route.params.profile.user.username);
  const [profileID, setProfileID] = useState(route.params.profile.id);
  const [email, setEmail] = useState(route.params.profile.user.email);
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState(route.params.profile.user.first_name);
  const [lname, setLname] = useState(route.params.profile.user.last_name);
  const [contact, setContact] = useState(route.params.profile.contact_number);
  const [address, setAddress] = useState(route.params.profile.address);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(route.params.profile.photo);
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

  async function editProfile() {
    if (username && email && password &&  confirmPassword && fname && lname && address) {
      setLoading(true);
      const token = await AsyncStorage.getItem('token')
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
          address: address
        }
        const headers = {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": `Bearer ${token}`
      };
        const axiosReq = axios({
          method: 'PATCH',
          headers: headers,
          url: `${BASE_URL}/api/profile/${profileID}/`,
          data: userData
        }).then(async function(response) {
          console.log('RESPONSE DATA', response.data)
          const responseData = await response.data
          uploadPhoto(profileID)
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
        }).catch(function(error){
          console.log('ERROR DATA1', error)
          console.log('ERROR DATA2', error.response.data)
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'INFO',
            text2: 'Edit Error!',
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

  return (
    <View style={styles.container}>
        <ScrollView>
            <Title style={styles.titleText}>Edit Profile</Title>
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
              title='Edit'
              loading={loading}
              modeValue='contained'
              buttonStyle={styles.signupButtonContainer}
              labelStyle={styles.signupButtonLabel}
              onPress={() => editProfile()}
            />
            <IconButton
              icon='keyboard-backspace'
              size={30}
              style={styles.navButton}
              color='#6646ee'
              onPress={() => navigation.goBack()}
            />
          </View>
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