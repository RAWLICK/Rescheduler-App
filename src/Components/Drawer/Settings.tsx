import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import ScheduleTable from '../Screens/ScheduleTable'

const Settings = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 100}}>Settings</Text>
      {/* <ScheduleTable/> */}
    </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({})