import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default function CustomCard2({data, isVerified}) {


    return(
        <Card style={styles.cardContainer} key={data.id}>
            <Card.Cover source={{ uri: data.photo ? data.photo : "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" }} />
            <Card.Title 
                title={data.name}
                subtitle={data.address}
                right={(props) => 
                <View>
                    {isVerified ? <Icon style={{marginTop: 5, marginRight: 10}} name='check-decagram' color='#6200ee' size={18}/> : <View></View>}
                </View>
                }
            />
            <Card.Content>
                <Paragraph>{data.description}</Paragraph>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        marginTop: 10,
    },
});