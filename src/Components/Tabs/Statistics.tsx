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
import AddTwo from "../Images/AddTwo.png"
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
import { startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks, addMonths, subMonths } from 'date-fns';

const Statistics = () => {
  const [WeekChange, setWeekChange] = useState<number>(0);
  const [MonthChange, setMonthChange] = useState<number>(0)
  const currentDate = new Date();
  const currentWeekStartDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const currentWeekEndDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(currentWeekStartDate)
  const [WeekTitle, setWeekTitle] = useState('This Week')
  // const DatesBetween = eachDayOfInterval({start: currentWeekStartDate, end: currentWeekEndDate})
  // const AddingWeeks = addWeeks(currentWeekStartDate, 1)
  // const SubtractWeeks = subWeeks(selectedWeekStart, 1)

  const WordMonth = (date: number) => {
    let MonthExtract = date;
    const Months = [
      'Jan',
      'Feb',
      'March',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    return Months[MonthExtract];
  };

  function DayToWeekTitle(date: Date) {
    const numberDate = date.getDate();
    const month = date.getMonth();
    return `Week of ${numberDate} ${WordMonth(month)}`
  }

  function DaytoStringDate(date: Date) {
    const numberDate = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${numberDate}/${month+1}/${year}`
  }

  function IncreaseWeekButton () {
    const IncreasedWeekStart = addWeeks(selectedWeekStart, 1)
    setSelectedWeekStart(IncreasedWeekStart)
    if (DaytoStringDate(IncreasedWeekStart) == DaytoStringDate(currentWeekStartDate)) {
      setWeekTitle("This Week")
    } else {
      setWeekTitle(DayToWeekTitle(IncreasedWeekStart))
    }
  }

  function DecreaseWeekButton () {
    const DecreasedWeekStart = subWeeks(selectedWeekStart, 1)
    setSelectedWeekStart(DecreasedWeekStart)
    if (DaytoStringDate(DecreasedWeekStart) === DaytoStringDate(currentWeekStartDate)) {
      setWeekTitle("This Week")
    } else {
    setWeekTitle(DayToWeekTitle(DecreasedWeekStart))
    }
  }

  // useEffect(() => {
  //   console.log(selectedWeekStart)
  // }, [selectedWeekStart])
  


  module.exports = {WeekChange}
  
  return (
    <SafeAreaView style={styles.safeView}>
    <StatusBar
      translucent={true}
      backgroundColor="#D2CFE4" // Make the status bar transparent
      barStyle="dark-content"
    />
      <View style={styles.mainStyle}>
        <View style={styles.heading}>

        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', height: 40, flexDirection: 'row'}}>
          <TouchableOpacity onPress={DecreaseWeekButton}>
            <Image source={ChevronLeftBlack} style={{height: 15, width: 15}}/>
          </TouchableOpacity>
          <View style={{marginLeft: 15, marginRight: 15}}>
            <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium'}}>{WeekTitle}</Text>
          </View>
          <TouchableOpacity onPress={IncreaseWeekButton} disabled={DaytoStringDate(selectedWeekStart) == DaytoStringDate(currentWeekStartDate)}>
            <Image source={ChevronRightBlack}
              style={[{height: 15, width: 15 },
              DaytoStringDate(selectedWeekStart) == DaytoStringDate(currentWeekStartDate) && {opacity: 0.3}
            ]}/>
          </TouchableOpacity>
        </View>
        <View style={{paddingLeft: 10, paddingRight: 10, rowGap: 10}}>
          <View style={styles.weekReport}>
            <WeeklyBarChart/>
          </View>
          <View style={{height: 40, backgroundColor: '#457fdf', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 10, elevation: 5}}>
            <Image source={AddTwo} style={{height: 20, width: 20}}/>
            <Text style={{color: 'white', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Add Subjects in Stats</Text>
          </View>

          <TouchableOpacity style={{ height: 40, backgroundColor: 'white', borderRadius: 8, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, elevation: 5 }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Week Analytics</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRightBlack} style={{height: 20, width: 20}}/>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 10}}>
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
        <View style={{paddingLeft: 10, paddingRight: 10, rowGap: 10}}>
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
                    <Text style={{fontFamily: 'sf-pro-display-medium', color: 'white'}}>1st Week</Text>
                  </View>
                </View>
              )
            })}
            </View>
            <TouchableOpacity style={{backgroundColor: '#6f6f6f', flex: 0.1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={BoldChevronDown} style={{height: 15, width: 15}}/>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ height: 40, backgroundColor: 'white', borderRadius: 8, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, elevation: 5 }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Month Analytics</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRightBlack} style={{height: 20, width: 20}}/>
            </View>
          </TouchableOpacity>
          <View style={{marginTop: 10}}>
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
      </View>
      {/* <Taskbar activeState={'Statistics'}/> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: '#D2CFE4'
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