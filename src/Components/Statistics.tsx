import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from './Navbar'
import Taskbar from './Taskbar'
import { BarChart } from 'react-native-chart-kit'
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import WeeklyBarChart from '../Functions/Animated-Bar-Chart/WeeklyBarChart.tsx'
import ChevronLeftBlack from '../Images/ChevronLeftBlack.png'
import ChevronRightBlack from '../Images/ChevronRightBlack.png'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const Statistics = () => {
  const [WeekChange, setWeekChange] = useState<number>(0);

  module.exports = {WeekChange}
  
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainStyle}>
        <View style={styles.heading}>

        </View>
        <View>
          <View style={{justifyContent: 'center', alignItems: 'center', height: 40, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setWeekChange(WeekChange - 1)}>
              <Image source={ChevronLeftBlack} style={{height: 15, width: 15}}/>
            </TouchableOpacity>
            <View style={{marginLeft: 15, marginRight: 15}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium'}}>This Week</Text>
            </View>
            <TouchableOpacity onPress={() => setWeekChange(WeekChange + 1)}>
              <Image source={ChevronRightBlack} style={{height: 15, width: 15}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.weekReport}>
            <WeeklyBarChart/>
          </View>
          <TouchableOpacity style={{ height: 40, backgroundColor: 'white', margin: 10, borderRadius: 8, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, elevation: 5 }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>More Analytics</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRightBlack} style={{height: 20, width: 20}}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Taskbar activeState={'Statistics'}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'white'
  },

  mainStyle: {
    flex: 1,
    backgroundColor: '#D2CFE4',
    paddingTop: StatusBar.currentHeight
  },

  heading: {
    // height: 30
  },

  weekReport: {
    backgroundColor: '#3E3649',
    height: 210,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 10,
    flexDirection: 'row',
    paddingBottom: 20
  },

  weekReportItem: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10
  }
})

export default Statistics