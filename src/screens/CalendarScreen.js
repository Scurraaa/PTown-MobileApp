import React, { useState } from 'react';
import {  View, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Calc({ navigation, route }) {
    
    const [selected, setSelected] = useState(route.params.appointment)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const onDayPress = (day) => {
        setSelected(selected => [...selected, day.dateString])
        console.log(day.dateString)
        showDatePicker()
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmOpening = (date) => {
        const format1 = 'HH:mm'
        let date1 = new Date(date)
        const formattedDate = moment(date1).format(format1);
        console.log(formattedDate)
        hideDatePicker();
    };

    return (
        <View style={{flex: 1}}>
            <View style={{height: 80, backgroundColor: '#6200ee',}}>
                <View style={{flex: 1, justifyContent: 'center', margin: 15}}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name='arrow-left' color='white' size={35}/>
                    </TouchableOpacity>
                </View>
            </View>
            <Calendar
                onDayPress={onDayPress}
                style={{borderTopWidth: 1, paddingTop: 5, borderBottomWidth: 1, height: '100%'}}
                hideExtraDays
                minDate={new Date()}
                markedDates={{[selected]: {selected: true}}}
                theme={{
                    selectedDayBackgroundColor: '#6200ee',
                    todayTextColor: '#6200ee',
                    arrowColor: '#6200ee'
                }}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    )
}
