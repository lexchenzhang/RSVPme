import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { globalStyles } from "../styles/global";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default function Calendars() {
  return (
    <View style={globalStyles.container}>
    
 <CalendarList
  // Callback which gets executed when visible months change in scroll view. Default = undefined
  //onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Enable or disable scrolling of calendar list
  scrollEnabled={true}
  // Enable or disable vertical scroll indicator. Default = false
  showScrollIndicator={false}
   // Enable horizontal scrolling, default = false
   horizontal={true}
   // Enable paging on horizontal, default = false
   pagingEnabled={false}
   // Set custom calendarWidth.
   calendarWidth={400}
   onDayPress={(day) => {console.log('selected day', day)}} 
   markedDates={{
    //'2020-11-25': {dots: [vacation, massage, workout], selected: true, selectedColor: 'red'},
    //'2020-11-26': {dots: [massage, workout], disabled: true}
  }}
  markingType={'multi-dot'}
  
/>



    </View>
  );
}
