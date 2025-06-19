import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import Remove from '../Images/Remove.png'
import { NavigationContainer, CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScheduleArrayItem } from './AddTiming';
import { useDispatch, useSelector } from 'react-redux'
import { addScheduleObject, removeScheduleObject } from '../../app/Slice';
import BlueAlarm from '../Images/Alarm_Clock_Blue.png'
import GreyAlarm from '../Images/Alarm_Clock_Grey.png'
import { RootState } from '../../app/Store';
import { ApiDataType } from '../Tabs/Schedule';
import notifee from '@notifee/react-native';
import Sound from 'react-native-sound';
import alarmSound from '../../../android/app/src/main/res/raw/love_alarm.mp3';

const TopTab = createMaterialTopTabNavigator();

type ScheduleTablePropsType = {
  ApiData: ApiDataType;
  rescheduleStatus: string;
  selectedDate: string
}

const ScheduleTable = (props: ScheduleTablePropsType) => {
  const dispatch = useDispatch();
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  const [Title, setTitle] = useState('')
  const [RingAlarmArray, setRingAlarmArray] = useState<number[]>([])
  const [hourRotation, setHourRotation] = useState(0);
  const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer)
  // Import the react-native-sound module
  var Sound = require('react-native-sound');

  // Enable playback in silence mode
  Sound.setCategory('Playback');

  useEffect(() => {
    if (props.rescheduleStatus == 'rescheduled') {
      setTitle('Rescheduled Table')
    }
    else {
      setTitle('Schedule Table')
      setRingAlarmArray([])
    }
  }, [props.rescheduleStatus])
  

  const data = {
    "uniqueID": ScheduleArray.map((item: ScheduleArrayItem) => item.uniqueID),
    "StartTime": ScheduleArray.map((item: ScheduleArrayItem) => item.StartTime),
    "EndTime": ScheduleArray.map((item: ScheduleArrayItem) => item.EndTime),
    "Work": ScheduleArray.map((item: ScheduleArrayItem) => item.Work),
    "StartAngle": ScheduleArray.map((item: ScheduleArrayItem) => item.StartAngle),
    "EndAngle": ScheduleArray.map((item: ScheduleArrayItem) => item.EndAngle),
    "TaskDate": ScheduleArray.map((item: ScheduleArrayItem) => item.TaskDate),
    "Slice_Color": [
    "rgba(175, 193, 85, 0.5)",
    "rgba(182, 108, 239, 0.5)",
    "rgba(78, 161, 40, 0.5)",
    "rgba(71, 214, 63, 0.5)",
    "rgba(19, 249, 16, 0.5)",
    "rgba(69, 221, 118, 0.5)", 
    "rgba(17, 150, 214, 0.5) ",
    "rgba(174, 182, 155, 0.5)",
    "rgba(54, 147, 187, 0.5) ",
    "rgba(49, 107, 93, 0.5)",
    "rgba(12, 248, 250, 0.5) ",
    "rgba(146, 120, 43, 0.5)", 
    "rgba(38, 3, 93, 0.5)",
    "rgba(240, 19, 80, 0.5)",
    "rgba(227, 127, 0, 0.5)",
    "rgba(38, 131, 56, 0.5)",
    "rgba(57, 190, 200, 0.5)",
    "rgba(28, 79, 20, 0.5)",
    "rgba(82, 176, 27, 0.5)",
    "rgba(191, 115, 181, 0.5)"
  ],
  }

  const TwelveHourFormat = (time: string) => {
    let NumberHour = Number(time.split(':', 1))
    let MinuteHour = Number(time.slice(3, 5))
    if (NumberHour > 12) {
      return `${NumberHour - 12}:${time.slice(3, 5)} PM`
    }
    else if (NumberHour == 12 && MinuteHour >= 0) {
      return `${time} PM`
    }
    else if (time.length > 5) {
      return time
    }
    else {
      return `${time} AM`
    }
  }

  async function DeleteTask(id: string) {
    dispatch(removeScheduleObject(id));
    try {
      const response = await fetch(
        // Platform.OS === 'ios'? 'http://localhost:5000/':'http://192.168.131.92:5000/',
        'https://rescheduler-server.onrender.com/UpdateScheduleArray',
        {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
        },
        body: JSON.stringify(
          {"uniqueID": StudentInfoData[0]["uniqueID"],
            "Process": "Delete",
            "SubjectUniqueID": id
          }
        ), // Convert the request payload to JSON.
      })

      if (!response.ok) {  // Handle HTTP errors
        throw new Error('Failed to fetch data from the server');
      }
    } catch (error) {
      console.error('Catch Error: ', error);
    }
  }

  function ClickedAlarm(index: number) {
    const isAlreadyAdded = RingAlarmArray.includes(index)
    if (!isAlreadyAdded) {
      setRingAlarmArray((prev) => {
        let upDatedArray = [...prev, index]
        return upDatedArray
      })
    }
    else {
      setRingAlarmArray(RingAlarmArray.filter((item) => item !== index))
    }
  }

  async function RingAlarm() {
    console.log("Hour Rotation: ", hourRotation)
    for (let index = 0; index < RingAlarmArray.length; index++) {
      const element = RingAlarmArray[index];
      let filteredData = ScheduleArray.filter((item) => item['TaskDate'] === props.selectedDate)
      if (hourRotation == filteredData[element]['StartAngle']) {
        console.log("Alarm Ringing")
        var whoosh = new Sound('notify_alarm.mp3', Sound.MAIN_BUNDLE, (error: Error | null) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          // loaded successfully
          console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        
          // Play the sound with an onEnd callback
          whoosh.play((success: boolean) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        });
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
          title: `Notifying for ${filteredData[element]['Work']}`,
          // body: 'Easily reschedule your messed up routine using Rescheduler ',
          android: {
            channelId,
            // smallIcon: 'appicon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
        
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const hTime = d.getHours();
      const mTime = d.getMinutes();

      const hRotation = 30 * hTime + 0.5 * mTime;

      setHourRotation(hRotation);
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    RingAlarm();
  }, [hourRotation, RingAlarmArray])
  
  
  return (
    <View style={{backgroundColor: '#e7e7e7'}}>
      <View style={styles.HeadingArea}>
        <Text style={styles.Heading}>{Title}</Text>
      </View>
      <View style={styles.ScheduleArea}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {/* Below is a very complex filtering and mapping possible with the effort of ChatGPT */}
        {props.rescheduleStatus == 'off' && ( 
        data['TaskDate']
        .map((TaskDate:string, index:number) => ({TaskDate, index}))
        .filter(({TaskDate}) => TaskDate === props.selectedDate)
        .map(({index}) => {
          const uniqueID = data['uniqueID'][index]
          const startTime = data['StartTime'][index]
          const endTime = data['EndTime'][index]
          const angleWork = data['Work'][index]
          return (
          <View style={styles.Schedules} key={uniqueID}>
            <View style={{flex: 0.8, padding: 10, paddingLeft: 30}}>
              <View style={{flex: 0.6, justifyContent: 'center'}}>
                <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 18}}>{angleWork}</Text>
              </View>
              <View style={{flex: 0.4, justifyContent: 'center'}}>
                <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 10}}>{TwelveHourFormat(startTime)} - {TwelveHourFormat(endTime)}</Text>
              </View>
            </View>
            <TouchableOpacity style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}
             onPress={() => DeleteTask(uniqueID)}
             >
              <Image source={Remove} style={{height: 20, width: 20}}/>
            </TouchableOpacity>
          </View>
          )
        }))}

        {props.rescheduleStatus == 'rescheduled' && ( 
        props.ApiData['Start_Angle']
        .map((Start_Angle:number, index:number) => ({Start_Angle, index}))
        .map(({Start_Angle, index}) => {
          // const uniqueID = data['uniqueID'][index]
          const startTime = props.ApiData['Start_Timing'][index]
          const endTime = props.ApiData['End_Timing'][index]
          const angleWork = props.ApiData['Work'][index]
          return (
          <View style={styles.Schedules} key={Start_Angle}>
            <View style={{flex: 0.8, padding: 10, paddingLeft: 30}}>
              <View style={{flex: 0.6, justifyContent: 'center'}}>
                <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 18}}>{angleWork}</Text>
              </View>
              <View style={{flex: 0.4, justifyContent: 'center'}}>
                <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 10}}>{TwelveHourFormat(startTime)} - {TwelveHourFormat(endTime)}</Text>
              </View>
            </View>
            <TouchableOpacity style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}
             onPress={() => ClickedAlarm(index)}>
              <Image source={GreyAlarm} style={{height: 25, width: 25, tintColor: RingAlarmArray.includes(index) ? '#53b9f3' : 'grey' }}/>
            </TouchableOpacity>
          </View>
          )
        }))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  HeadingArea: {
    height: 50,
    // justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: 0.5,
    borderColor: '#d3d3d3',
    paddingTop: 15
  },

  Heading: {
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    fontSize: 20
  },

  ScheduleArea: {
    margin: 15
  },

  Schedules: {
    height: 60,
    borderRadius: 15,
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row'
  }
})

export default ScheduleTable