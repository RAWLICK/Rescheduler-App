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
import LeftArrow from '../Images/LeftArrow.png'
import RightArrowTwo from '../Images/RightArrowTwo.png'
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
  Modal,
  Platform
} from 'react-native';
import { startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks, addMonths, subMonths, getMonth, getYear } from 'date-fns';
import { demoData } from '../../Functions/Animated-Bar-Chart/constants';
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type WeeklyAnalyticsModalPropsType = {
  selectedWeekStart: Date
  selectedWeekEnd: Date
  WeekTitle: string
  WeekAnalyticsStatus: boolean
  setWeekAnalyticsStatus: SetState<boolean>
}

const WeeklyAnalyticsModal = (props: WeeklyAnalyticsModalPropsType) => {
  function StringDateToDateConvert(stringDate: string) {
    // + converts string to number
    let [day, month, year] = stringDate.split('/')
    const createdDate = new Date(Date.UTC(+year, +month - 1, +day))
    return createdDate
  }
  return (
    <Modal transparent= {true} visible={props.WeekAnalyticsStatus} animationType='fade'>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BlurView
          style={styles.blurStyle}
          blurType="light"
          blurAmount={10}
          // reducedTransparencyFallbackColor="light"
        />
        <View style={[styles.selectionDialogBox]}>
            <BlurView
            style={styles.blurStyle}
            blurType="dark"
            blurAmount={50}
            // reducedTransparencyFallbackColor="black"
            />
            <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'grey'}}>
              <TouchableOpacity onPress={() => props.setWeekAnalyticsStatus(false)} style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={LeftArrow} style={{height: 17, width: 17}}/>
              </TouchableOpacity>
              <View style={{flex: 0.8, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>{props.WeekTitle}</Text>
              </View>
              <View style={{flex: 0.1}}>
  
              </View>
            </View>
            <View style={{flex: 7, paddingLeft: 10,paddingRight: 10, paddingTop: 10}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {demoData.map((eachSubject, index) => {
                  // Filter the Dataframe for dates within the range
                  const filteredDataframe = eachSubject.Dataframe.filter((eachDataframeObject) => {
                    const date = StringDateToDateConvert(eachDataframeObject.Date);
                    return date >= props.selectedWeekStart && date <= props.selectedWeekEnd;
                  });
                  // console.log("Filtered Dataframe: ", filteredDataframe)
                  // Extract Work-Done-For values from filtered Dataframe
                  const workDoneValues = filteredDataframe.map((eachDataframeObject) => eachDataframeObject["Work-Done-For"]);
          
                  // You can calculate a specific value (e.g., total, average, etc.)
                  const totalWorkDone = workDoneValues.reduce((total, value) => {
                    // Convert "60min" to a number (60)
                    const numericValue = parseInt(value.replace("min", ""), 10);
                    return total + numericValue;
                  },0);
                  return (
                  <View key={index} style={{height: 40, borderRadius: 10, backgroundColor: '#8a8a8a', flexDirection: 'row', paddingLeft: 20, paddingRight: 20, marginBottom: 5}}>
                      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white'}}>{eachSubject.Subject}</Text>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={RightArrowTwo} style={{height: 25, width: 25}}/>
                      </View>
                      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-end'}}>
                          <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white'}}>{totalWorkDone} mins</Text>
                      </View>
                  </View>
                )})}
              </ScrollView>
            </View>
        </View>
      </View>
    </Modal>
  )
}

const MonthlyAnalyticsModal = () => {

}

const Statistics = () => {
  const [WeekChange, setWeekChange] = useState<number>(0);
  const [MonthChange, setMonthChange] = useState<number>(0)
  const currentDate = new Date();
  const currentWeekStartDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const currentWeekEndDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(currentWeekStartDate)
  const [selectedWeekEnd, setselectedWeekEnd] = useState<Date>(currentWeekEndDate)
  const currentMonth = getMonth(currentDate)
  const [SelectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [WeekTitle, setWeekTitle] = useState('This Week')
  const [MonthTitle, setMonthTitle] = useState('This Month')
  const [WeeklyAnalyticsStatus, setWeeklyAnalyticsStatus] = useState(false)
  const [MontlyAnalyticsStatus, setMontlyAnalyticsStatus] = useState(false)
  const currentYear = getYear(currentDate)
  // const DatesBetween = eachDayOfInterval({start: currentWeekStartDate, end: currentWeekEndDate})
  // const AddingWeeks = addWeeks(currentWeekStartDate, 1)
  // const SubtractWeeks = subWeeks(selectedWeekStart, 1)

  const WordMonth = (date: number) => {
    let MonthExtract = date;
    const Months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return Months[MonthExtract];
  };

  function DayToWeekTitle(date: Date) {
    const numberDate = date.getDate();
    const month = date.getMonth();
    return `Week from ${numberDate} ${WordMonth(month)}`
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
    setselectedWeekEnd(endOfWeek(IncreasedWeekStart, {weekStartsOn: 1}))
    if (DaytoStringDate(IncreasedWeekStart) == DaytoStringDate(currentWeekStartDate)) {
      setWeekTitle("This Week")
    } else {
      setWeekTitle(DayToWeekTitle(IncreasedWeekStart))
    }
  }

  function DecreaseWeekButton () {
    const DecreasedWeekStart = subWeeks(selectedWeekStart, 1)
    setSelectedWeekStart(DecreasedWeekStart)
    setselectedWeekEnd(endOfWeek(DecreasedWeekStart, {weekStartsOn: 1}))
    if (DaytoStringDate(DecreasedWeekStart) === DaytoStringDate(currentWeekStartDate)) {
      setWeekTitle("This Week")
    } else {
    setWeekTitle(DayToWeekTitle(DecreasedWeekStart))
    }
  }

  function IncreaseMonthButton () {
    let IncreasedMonth = SelectedMonth + 1
    setSelectedMonth(SelectedMonth + 1)
    if (IncreasedMonth == currentMonth) {
      setMonthTitle("This Month")
    }
    else {
      setMonthTitle(WordMonth(IncreasedMonth))
    }
  }

  function DecreaseMonthButton () {
    let DecreasedMonth = SelectedMonth - 1
    setSelectedMonth(SelectedMonth - 1)
    if (DecreasedMonth == currentMonth) {
      setMonthTitle("This Month")
    }
    else {
      setMonthTitle(WordMonth(DecreasedMonth))
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
            <WeeklyBarChart
              selectedWeekStart={selectedWeekStart}
              selectedWeekEnd={selectedWeekEnd}
            />
          </View>
          <View style={{height: 40, backgroundColor: '#457fdf', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 10, elevation: 5}}>
            <Image source={AddTwo} style={{height: 20, width: 20}}/>
            <Text style={{color: 'white', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Add Subjects in Stats</Text>
          </View>

          <TouchableOpacity style={{ height: 40, backgroundColor: 'white', borderRadius: 8, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, elevation: 5 }} onPress={() => setWeeklyAnalyticsStatus(true)}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Week Analytics</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRightBlack} style={{height: 20, width: 20}}/>
            </View>
          </TouchableOpacity>
          
          <WeeklyAnalyticsModal
          selectedWeekStart={selectedWeekStart}
          selectedWeekEnd={selectedWeekEnd}
          WeekTitle={WeekTitle}
          WeekAnalyticsStatus={WeeklyAnalyticsStatus}
          setWeekAnalyticsStatus={setWeeklyAnalyticsStatus}
          />
        </View>

        <View style={{marginTop: 10}}>
          <View style={{justifyContent: 'center', alignItems: 'center', height: 40, flexDirection: 'row'}}>
            <TouchableOpacity onPress={DecreaseMonthButton}>
              <Image source={ChevronLeftBlack} style={{height: 15, width: 15}}/>
            </TouchableOpacity>
            <View style={{marginLeft: 15, marginRight: 15}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium'}}>{MonthTitle}</Text>
            </View>
            <TouchableOpacity onPress={IncreaseMonthButton} disabled={currentMonth == SelectedMonth}>
              <Image source={ChevronRightBlack} style={[{height: 15, width: 15 },
              currentMonth == SelectedMonth && {opacity: 0.3}
            ]}/>
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
  selectionDialogBox: {
    flexDirection: 'column',
    height: 400,
    width: 320,
    borderRadius: 20,
    overflow: 'hidden'
    // backgroundColor: 'black',       // Disabled because of iOS
    // opacity: 0.85,                  // Disabled because of iOS
  },
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