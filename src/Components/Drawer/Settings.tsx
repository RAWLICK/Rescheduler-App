import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import ScheduleTable from '../Screens/ScheduleTable'
import { useDispatch, useSelector } from 'react-redux' 
import { addScheduleObject, removeScheduleObject } from '../../app/Slice'
import { RootState } from '../../app/Store'

// Dispatch, reducer ko use karte hue store me changes karta hai
const Settings = () => {
  const dispatch = useDispatch();
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 100}}>Settings</Text>
      {/* {ScheduleArray.map((item) => (
        <View key={item.StartTime}>
          <Text>{item.StartTime}</Text>
          <Text>{item.EndTime}</Text>
          <Text>{item.Work}</Text>
          <Text>{item.TaskDate}</Text>
          <Text>{item.Slice_Color}</Text>
        </View>
      ))} */}
      <View>
        <Text>{JSON.stringify(ScheduleArray)}</Text>
      </View>
      {/* <ScheduleTable/> */}
    </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({})