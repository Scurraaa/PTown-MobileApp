import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/constants'
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-paper'

export default function ProfileScreen({ navigation })  {

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null);

    useEffect(() => {
        getProfile()
    }, [])

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

    async function getProfile() {
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
            url: `${BASE_URL}/api/profile/?user=${userId}`,
        }).then(async function (responsed) {
            setImage(responsed.data[0].photo)
            setProfile(responsed.data[0])
        }).catch(function(error){
            console.log("ERROR DATA1", error)
            console.log("ERROR DATA2", error.response.status)
        })
        setLoading(false);
    }

    const logout = async () => {
        AsyncStorage.clear();
        navigation.navigate('Login')
    }

    if (loading) {
        return (
            <Loading size='large'/>
        )
    }
    else {
        return (
            <View style={styles.container}>
               <View style={imageUploaderStyles.container}>
                    {
                        image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                    }
                </View>
                <View style={{height: 200}}>
                    <Button style={{width: 250, margin: 5}} icon="emoticon" mode="contained" onPress={() => navigation.navigate('Edit Profile', {
                        profile: profile
                    })}>
                        Edit Profile
                    </Button>
                    <Button style={{width: 250, margin: 5, backgroundColor: '#626262'}} icon="book" mode="contained">
                        My Bookings
                    </Button>
                    <Button style={{width: 250, margin: 5}} icon="logout" mode="contained" onPress={() => navigation.navigate('Login')}>
                        Log Out
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    }
})

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