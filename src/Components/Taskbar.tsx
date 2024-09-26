import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { act } from 'react'
import { useState, useEffect } from 'react'
import RescheduleImage from '../Images/Reschedule.png'
import CalenderImage from '../Images/Calender.png'
import StatisticsImage from '../Images/Statistics.png'
import NotesImage from '../Images/Notes.png'
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
type PropsType = {
  activeState: string;
};

const Taskbar = (props: PropsType) => {
  const [active, setActive] = useState(props.activeState)
  const navigation = useNavigation<NavigationProp<any, any>>();
  const ScheduleClick = () => {
    // setActive('Schedule');
    navigation.navigate('Schedule');
  }
  const CalenderClick = () => {
    setActive('Calender');
    navigation.navigate('Calender');
  }
  const StatisticsClick = () => {
    // setActive('Statistics');
    navigation.navigate('Statistics');
  }
  const NotesClick = () => {
    setActive('Notes');
    navigation.navigate('Notes')
  }
  
  return (
    <View style={styles.mainTask}>

      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={ScheduleClick}>
        <View style={[styles.IconView,
           active === 'Schedule'? {backgroundColor: '#40095C'} : {backgroundColor: '#6B1294'}]}>
          <Image source={RescheduleImage} style={styles.TaskbarIcons}/>
        </View>
        <Text style={[styles.IconTitle, active === 'Schedule'? {fontFamily: 'sf-pro-display-bold'}: {}]}>Schedule</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={CalenderClick}>
        <View style={[styles.IconView,
           active === 'Calender'? {backgroundColor: '#40095C'} : {backgroundColor: '#6B1294'}]}>
          <Image source={CalenderImage} style={styles.TaskbarIcons}/>
        </View>
        <Text style={[styles.IconTitle, active === 'Calender'? {fontFamily: 'sf-pro-display-bold'}: {}]}>Calender</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={StatisticsClick}>
        <View style={[styles.IconView,
           active === 'Statistics'? {backgroundColor: '#40095C'} : {backgroundColor: '#6B1294'}]}>
          <Image source={StatisticsImage} style={styles.TaskbarIcons}/>
        </View>
        <Text style={[styles.IconTitle, active === 'Statistics'? {fontFamily: 'sf-pro-display-bold'}: {}]}>Statistics</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={NotesClick}>
        <View style={[styles.IconView,
           active === 'Notes'? {backgroundColor: '#40095C'} : {backgroundColor: '#6B1294'}]}>
          <Image source={NotesImage} style={styles.TaskbarIcons}/>
        </View>
        <Text style={[styles.IconTitle, active === 'Notes'? {fontFamily: 'sf-pro-display-bold'}: {}]}>Notes</Text>
      </TouchableOpacity> */}

    </View>
  )
}

const styles = StyleSheet.create({
  mainTask: {
    flexDirection: 'row',
    backgroundColor: '#6B1294',
    height: 70
  },

  IconView: {
    padding: 3,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 20
  },

  TaskbarIcons: {
    height: 25,
    width: 25
  },

  IconTitle: {
    fontSize: 11,
    fontFamily: 'sf-pro-display-medium'
  }
})

export default Taskbar