import React from 'react';
import { Rating } from 'react-native-ratings';
import { Image, StyleSheet, Text, View } from 'react-native'
import moment from 'moment';

export default function Comment({ data, user }) {
    const date1 = new Date(data.created)
    const created_at = moment(date1).format('YYYY-MM-DD')
    return (
        <View style={styles.container}>
            <View style={styles.avatarAndName}>
                <View>
                    <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
                </View>
            </View>
            <View>
                <View style={styles.starAndDate}>
                    <Rating
                        ratingCount={5}
                        imageSize={15}
                        startingValue={data.rating}
                        fractions={2}
                        tintColor={'#efefef'}
                        readonly={true}
                    />
                    <Text style={{marginLeft: 5}}>{created_at}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.text}>{data.text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    avatarAndName: {
        flexDirection: 'row',
        marginBottom: 10
    },
    name: {
        marginTop: 15,
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 15
    }, 
    starAndDate: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 15
    }
});