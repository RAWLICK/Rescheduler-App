import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { BarChart } from 'react-native-chart-kit'
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import WeeklyBarChart from '../../Functions/Animated-Bar-Chart/WeeklyBarChart'
import ChevronLeftBlack from '../Images/ChevronLeftBlack.png'
import ChevronRightBlack from '../Images/ChevronRightBlack.png'
import BoldChevronDown from '../Images/BoldChevronDown.png'
import LockImage from '../Images/Lock.png'
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from "@react-native-community/blur";
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
  Dimensions,
  Modal
} from 'react-native';

const Statistics = () => {
  const [WeekChange, setWeekChange] = useState<number>(0);
  const [MonthChange, setMonthChange] = useState<number>(0)


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

        <View>
          <View style={{justifyContent: 'center', alignItems: 'center', height: 40, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setMonthChange(MonthChange - 1)}>
              <Image source={ChevronLeftBlack} style={{height: 15, width: 15}}/>
            </TouchableOpacity>
            <View style={{marginLeft: 15, marginRight: 15}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium'}}>This Month</Text>
            </View>
            <TouchableOpacity onPress={() => setMonthChange(MonthChange + 1)}>
              <Image source={ChevronRightBlack} style={{height: 15, width: 15}}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.monthReport]}>
          <View style={styles.monthGraphSheet}>
          {new Array(2).fill(null).map((__, index) => {
            const props = {
              activeStrokeWidth: 8,
              inActiveStrokeWidth: 8,
              inActiveStrokeOpacity: 0.3
            };
            const fuckrad = 8;
            return (
              <View key={index} style={{margin: 8, marginTop: 15}}>
                <CircularProgressBase
                {...props}
                value={80}
                radius={fuckrad * 7}
                activeStrokeColor={'#e84118'}
                inActiveStrokeColor={'#e84118'}
              >
                <CircularProgressBase
                  {...props}
                  value={87}
                  radius={fuckrad * 6}
                  activeStrokeColor={'#badc58'}
                  inActiveStrokeColor={'#badc58'}
                >
                  <CircularProgressBase
                    {...props}
                    value={62}
                    radius={fuckrad * 5}
                    activeStrokeColor={'#18dcff'}
                    inActiveStrokeColor={'#18dcff'}
                  >
                    <CircularProgressBase
                      {...props}
                      value={48}
                      radius={fuckrad * 4}
                      activeStrokeColor={'#b233ff'}
                      inActiveStrokeColor={'#b233ff'}
                    >
                      <CircularProgressBase
                        {...props}
                        value={47}
                        radius={fuckrad * 3}
                        activeStrokeColor={'#ff5733'}
                        inActiveStrokeColor={'#ff5733'}
                      >
                        <CircularProgressBase
                          {...props}
                          value={50}
                          radius={fuckrad * 2}
                          activeStrokeColor={'#33ff96'}
                          inActiveStrokeColor={'#33ff96'}
                        >
                          <CircularProgressBase
                            {...props}
                            value={39}
                            radius={fuckrad}
                            activeStrokeColor={'#33acff'}
                            inActiveStrokeColor={'#33acff'}
                          >
                          </CircularProgressBase>
                        </CircularProgressBase>
                      </CircularProgressBase>
                    </CircularProgressBase>
                  </CircularProgressBase>
                </CircularProgressBase>
                </CircularProgressBase>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                  <Text style={{fontFamily: 'sf-pro-display-medium'}}>1st Week</Text>
                </View>
              </View>
            )
          })}
          </View>
          <TouchableOpacity style={{backgroundColor: '#6f6f6f', flex: 0.1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={BoldChevronDown} style={{height: 15, width: 15}}/>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20, marginRight: 5, marginLeft: 5}}>
          <View style={{marginBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: 'sf-pro-display-medium', color: '#000'}}>Reach Streak of 10 to unlock new Insights</Text>
          </View>
          <LinearGradient colors={['#ffffff', '#D2CFE4']} style={{borderRadius: 10}}>
            <View style={{height: 100, borderRadius: 10, borderColor: '#6B1294', borderTopWidth: 5, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={LockImage} style={{height: 15, width: 15}}/>
            </View>
          </LinearGradient>
        </View>
      </View>
      {/* <Taskbar activeState={'Statistics'}/> */}
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
  }, 

  monthReport: {
    backgroundColor: '#000',
    height: 180,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 20,
    flexDirection: 'column'
    
  }, 

  monthGraphSheet: {
    flex: 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },

  blurStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
})

export default Statistics