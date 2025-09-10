import React, { useEffect, memo } from 'react'
import { useState, useRef, useCallback } from 'react'
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
import ExistingSubjects from '../Screens/ExistingSubjects';
import { useFocusEffect } from '@react-navigation/native';
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
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth, eachDayOfInterval, subWeeks, addDays, addWeeks, addMonths, subMonths, getMonth, getYear } from 'date-fns';
import { demoData } from '../../Functions/Animated-Bar-Chart/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/Store';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import AddingSubjects from '../Screens/AddingSubjects'
import { ExistingSubjectsArrayItem } from '../../app/Slice';
// import { SafeAreaView } from 'react-native-safe-area-context';
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type WeeklyAnalyticsModalPropsType = {
  selectedWeekStart: Date
  selectedWeekEnd: Date
  WeekTitle: string
  WeekAnalyticsStatus: boolean
  setWeekAnalyticsStatus: SetState<boolean>
}

type MonthlyAnalyticsModalPropsType = {
  MonthTitle: string
  MonthlyAnalyticsStatus: boolean
  SelectedMonth: number
  SelectedYear: number
  setMonthlyAnalyticsStatus: SetState<boolean>
}

type NestedCircularProgressPropsType = {
  index: number;
  StartDateNumber: number;
  SelectedMonth: number;
  SelectedYear: number;
  ExistingSubjectsArray: ExistingSubjectsArrayItem[];
}

const WeeklyAnalyticsModal = React.memo((props: WeeklyAnalyticsModalPropsType) => {
  console.log("WeeklyAnalyticsModal is made run");
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState)
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
                {ExistingSubjectsArray.map((eachSubject, index) => {
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
                          <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>{eachSubject.Subject}</Text>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={RightArrowTwo} style={{height: 25, width: 25}}/>
                      </View>
                      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-end'}}>
                          <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>{totalWorkDone} mins</Text>
                      </View>
                  </View>
                )})}
              </ScrollView>
            </View>
        </View>
      </View>
    </Modal>
  )
});

const MonthlyAnalyticsModal = React.memo((props: MonthlyAnalyticsModalPropsType) => {
  console.log("MonthlyAnalyticsModal is made run");
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState)
    const filteredData: {"uniqueID": string, "Subject": string, "value": number, "activeStrokeColor": string}[] = []

    function parseDate(dateStr: string) {
      const [day, month, year] = dateStr.split("/"); // Split into components
      return new Date(`${year}-${month}-${day}`);    // Return a Date object
    }

    let StartDate = parseDate(1 + "/" + (props.SelectedMonth + 1) + "/" + props.SelectedYear)
    let EndDate = endOfMonth(StartDate)
    const ColorList = ['#e84118', '#badc58', '#18dcff', '#ff9f1a', '#b233ff', '#ff5733', '#33ff96']

    for (let index = 0; index < ExistingSubjectsArray.length; index++) {
      const element = ExistingSubjectsArray[index];
      const AddingList = []
      for (let indexTwo = 0; indexTwo < element.Dataframe.length; indexTwo++) {
        const eachDataframeObject = element.Dataframe[indexTwo];
        const date = parseDate(eachDataframeObject["Date"]);
        if (date >= StartDate && date <= EndDate) {
          AddingList.push(Number(eachDataframeObject["Work-Done-For"].split("min")[0]))
        }
      }
      const SumOfAddingList = AddingList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      filteredData.push({
        "uniqueID": element.uniqueID, 
        "Subject": element.Subject, 
        "value": SumOfAddingList,
        "activeStrokeColor": ColorList[index],
      })
    }

    function formatMinutesToHours(mins: number) {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
    
      if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
      if (hours > 0) return `${hours}h`;
      return `${minutes}min`;
    }
  return (
  <Modal transparent= {true} visible={props.MonthlyAnalyticsStatus} animationType='fade'>
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
              <TouchableOpacity onPress={() => props.setMonthlyAnalyticsStatus(false)} style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={LeftArrow} style={{height: 17, width: 17}}/>
              </TouchableOpacity>
              <View style={{flex: 0.8, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>{props.MonthTitle}</Text>
              </View>
              <View style={{flex: 0.1}}>
  
              </View>
            </View>
            <View style={{flex: 7, paddingLeft: 10,paddingRight: 10, paddingTop: 10}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredData.map((eachSubject, index) => {
                  return (
                  <View key={index} style={{height: 40, borderRadius: 10, backgroundColor: '#8a8a8a', flexDirection: 'row', paddingLeft: 20, paddingRight: 20, marginBottom: 5}}>
                      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <View style={{height: 10, width: 10, justifyContent: 'center', alignItems: 'flex-start', borderRadius: 20, backgroundColor: eachSubject.activeStrokeColor}}></View>
                      </View>
                      <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>{eachSubject.Subject}</Text>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={RightArrowTwo} style={{height: 25, width: 25}}/>
                      </View>
                      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-end'}}>
                          <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>{formatMinutesToHours(eachSubject.value)}</Text>
                      </View>
                  </View>
                )})}
              </ScrollView>
            </View>
        </View>
      </View>
    </Modal>
  )
});

const NestedCircularProgress = React.memo((props: NestedCircularProgressPropsType) => {
  console.log("NestedCircularProgress is made run");
  const filteredData: {"uniqueID": string, "Subject": string, "value": number, "radius": number, "activeStrokeColor": string, "inActiveStrokeColor": string }[] = []

  function parseDate(dateStr: string) {
    const [day, month, year] = dateStr.split("/"); // Split into components
    return new Date(`${year}-${month}-${day}`);    // Return a Date object
  }

  let StartDate = parseDate(props.StartDateNumber + "/" + (props.SelectedMonth + 1) + "/" + props.SelectedYear)
  const EndDate = () => {
    if (props.StartDateNumber == 22) {
      return endOfMonth(StartDate)
    }
    else {
      return addDays(StartDate, 6)
    }
  }

  const ColorList = ['#e84118', '#badc58', '#18dcff', '#ff9f1a', '#b233ff', '#ff5733', '#33ff96']
  const RadiusList = [56, 48, 40, 32, 24, 16, 8]

  for (let index = 0; index < props.ExistingSubjectsArray.length; index++) {
    const element = props.ExistingSubjectsArray[index];
    const AddingList = []
    for (let indexTwo = 0; indexTwo < element.Dataframe.length; indexTwo++) {
      const eachDataframeObject = element.Dataframe[indexTwo];
      const date = parseDate(eachDataframeObject["Date"]);
      if (date >= StartDate && date <= EndDate()) {
        AddingList.push(Number(eachDataframeObject["Work-Done-For"].split("min")[0]))
      }
    }
    const SumOfAddingList = AddingList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    filteredData.push({
      "uniqueID": element.uniqueID, 
      "Subject": element.Subject, 
      "value": SumOfAddingList,
      "radius": RadiusList[index],
      "activeStrokeColor": ColorList[index],
      "inActiveStrokeColor": ColorList[index]
    })
  }

  function convertToMinutes(timeStr: string) {
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minutesMatch = timeStr.match(/(\d+)min/);
  
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  
    return (hours * 60) + minutes;
  }

  function PercentageOfValues() {
    let AddingList = []
    for (let index = 0; index < props.ExistingSubjectsArray.length; index++) {
      const element = props.ExistingSubjectsArray[index];
      AddingList.push(convertToMinutes(element.Current_Duration))
    }
    for (let index = 0; index < filteredData.length; index++) {
      const element = filteredData[index];
      filteredData[index].value = (element.value / (AddingList[index] * 7)) * 100
    }
  }
  PercentageOfValues();

  if(props.index >= filteredData.length) 
    return null;

  const InternalProps = {
    activeStrokeWidth: 8,
    inActiveStrokeWidth: 8,
    inActiveStrokeOpacity: 0.3
  };

  const {value, radius, activeStrokeColor, inActiveStrokeColor} = filteredData[props.index]

  return (
    <CircularProgressBase
    {...InternalProps}
    value={value}
    radius={radius}
    activeStrokeColor={activeStrokeColor}
    inActiveStrokeColor={inActiveStrokeColor}
    >
    {/* Recursive call for nested component */}
      <NestedCircularProgress index={props.index + 1} StartDateNumber={props.StartDateNumber} SelectedMonth={props.SelectedMonth} SelectedYear={props.SelectedYear} ExistingSubjectsArray={props.ExistingSubjectsArray}/>
    </CircularProgressBase>
  )
});

const Statistics = () => {
  const [WeekChange, setWeekChange] = useState<number>(0);
  const [MonthChange, setMonthChange] = useState<number>(0);
  const currentDate = new Date();
  const [currentDay, setCurrentDay] = useState(currentDate.getDate());
  const currentWeekStartDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const currentWeekEndDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(currentWeekStartDate)
  const [selectedWeekEnd, setselectedWeekEnd] = useState<Date>(currentWeekEndDate)
  const currentMonth = getMonth(currentDate)
  const [SelectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [WeekTitle, setWeekTitle] = useState('This Week')
  const [MonthTitle, setMonthTitle] = useState('This Month')
  const [WeeklyAnalyticsStatus, setWeeklyAnalyticsStatus] = useState(false)
  const [MonthlyAnalyticsStatus, setMonthlyAnalyticsStatus] = useState(false)
  const currentYear = getYear(currentDate)
  const [SelectedYear, setSelectedYear] = useState(getYear(currentDate))
  const AddingSubjectsSheet = useRef<TrueSheet>(null);
  const [EditDialogBoxStatus, setEditDialogBoxStatus] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null);
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState)
  const ExistingSubjectSheet = useRef<TrueSheet>(null);
  const [MonthBoxPos, setMonthBoxPos] = useState('up')
  const [FakeWork, setFakeWork] = useState('FakeWork')
  
  async function ExistingSubjectButton () {
    console.log("ExistingSubjectButton is made run");
    await ExistingSubjectSheet.current?.present();
  }

  const scrollToPosition = () => {
    console.log("scrollToPosition is made run");
    if (MonthBoxPos == 'up') {
      scrollViewRef.current?.scrollTo({
        y: +162, // Scroll 162px vertically
        animated: true, // Smooth scrolling
      });
      setMonthBoxPos('down')
    }
    else if (MonthBoxPos == 'down') {
      scrollViewRef.current?.scrollTo({
        y: -162, // Scroll 162px vertically
        animated: true, // Smooth scrolling
      });
      setMonthBoxPos('up')
    }
  };
  
  const scrollingCondition = () => {
    console.log("scrollingCondition is made run");
    if (currentDate >= new Date(currentYear, currentMonth, 15)) {
      // set timeout is used because instant mounting of screen doesn't effect changes in scrolling. Also it appeals the UI luckily.
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
        y: +162, // Scroll 162px vertically
        animated: true, // Smooth scrolling
      });
      }, 1000); 
      setMonthBoxPos('down');
    }
  }

  const WordMonth = (date: number) => {
    console.log("WordMonth is made run");
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
    console.log("DayToWeekTitle is made run");
    const numberDate = date.getDate();
    const month = date.getMonth();
    return `Week from ${numberDate} ${WordMonth(month)}`
  }

  function DaytoStringDate(date: Date) {
    console.log("DaytoStringDate is made run");
    const numberDate = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${numberDate}/${month+1}/${year}`
  }

  function IncreaseWeekButton () {
    console.log("IncreaseWeekButton is made run");
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
    console.log("DecreaseWeekButton is made run");
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
    console.log("IncreaseMonthButton is made run");
    let IncreasedMonth = SelectedMonth + 1
    if(IncreasedMonth > 11) {
      IncreasedMonth = 0
      setSelectedMonth(IncreasedMonth)
      setSelectedYear(SelectedYear + 1)
    }
    else {
      setSelectedMonth(IncreasedMonth)
    }

    if (IncreasedMonth == currentMonth && SelectedYear == currentYear) {
      setMonthTitle("This Month")
    }
    else {
      setMonthTitle(WordMonth(IncreasedMonth))
    }
  }

  function DecreaseMonthButton () {
    console.log("DecreaseMonthButton is made run");
    let DecreasedMonth = SelectedMonth - 1
    if(DecreasedMonth < 0) {
      DecreasedMonth = 11
      setSelectedMonth(DecreasedMonth)
      setSelectedYear(SelectedYear - 1)
    }
    else {
      setSelectedMonth(DecreasedMonth)
    }

    if (DecreasedMonth == currentMonth && SelectedYear == currentYear) {
      setMonthTitle("This Month")
    }
    else {
      setMonthTitle(WordMonth(DecreasedMonth))
    }
  }

  const progressData = [
    { value: 80, radius: 56, activeStrokeColor: '#e84118', inActiveStrokeColor: '#e84118' },
    { value: 87, radius: 48, activeStrokeColor: '#badc58', inActiveStrokeColor: '#badc58' },
    { value: 62, radius: 40, activeStrokeColor: '#18dcff', inActiveStrokeColor: '#18dcff' },
    { value: 45, radius: 32, activeStrokeColor: '#ff9f1a', inActiveStrokeColor: '#ff9f1a' },
    { value: 55, radius: 24, activeStrokeColor: '#b233ff', inActiveStrokeColor: '#b233ff' },
    { value: 20, radius: 16, activeStrokeColor: '#ff5733', inActiveStrokeColor: '#ff5733' },
    { value: 35, radius: 8, activeStrokeColor: '#33ff96', inActiveStrokeColor: '#33ff96' },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      setCurrentDay(d.getDate());
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    scrollingCondition();
  }, [currentDay])

  // useFocusEffect(
  //   useCallback(() => {
  //     if (Platform.OS === 'android') {
  //       console.log("Focused on Stats Screen")
  //       StatusBar.setBackgroundColor('#D2CFE4')
  //     }
  //     return () => {
  //       // optional cleanup when screen is unfocused
  //     };
  //   }, [])
  // );
  
  return (
    <SafeAreaView style={styles.safeView}>
    <StatusBar
      translucent={true}
      backgroundColor="#D2CFE4" // Make the status bar transparent
      barStyle="dark-content"
    />
      <KeyboardAvoidingView style={styles.mainStyle}>
        <ScrollView>
        <View style={styles.heading}>

        </View>

        <View style={{height: 40, flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}} onPress={DecreaseWeekButton}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={ChevronLeftBlack} style={{height: 15, width: 15}}/>
            </View>
          </TouchableOpacity>
          <View style={{flex: WeekTitle == "This Week" ? 0.7 : 1.5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium'}}>{WeekTitle}</Text>
          </View>
          <TouchableOpacity onPress={IncreaseWeekButton} disabled={DaytoStringDate(selectedWeekStart) == DaytoStringDate(currentWeekStartDate)} style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
            <View>
              <Image source={ChevronRightBlack}
                style={[{height: 15, width: 15 },
                DaytoStringDate(selectedWeekStart) == DaytoStringDate(currentWeekStartDate) && {opacity: 0.3}
              ]}/>
            </View>
          </TouchableOpacity>
        </View>


        <View style={{paddingLeft: 10, paddingRight: 10, rowGap: 10}}>
          <View style={styles.weekReport}>
            <WeeklyBarChart
              selectedWeekStart={selectedWeekStart}
              selectedWeekEnd={selectedWeekEnd}
            />
          </View>
          <TouchableOpacity onPress={ExistingSubjectButton} style={{height: 40, backgroundColor: '#457fdf', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 10, elevation: 5}}>
            <Image source={AddTwo} style={{height: 20, width: 20}}/>
            <Text style={{color: 'white', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Add Subjects in Stats</Text>
          </TouchableOpacity>

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
          <View style={{height: 40, flexDirection: 'row'}}>
            <TouchableOpacity onPress={DecreaseMonthButton} style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <View>
                <Image source={ChevronLeftBlack} style={{height: 15, width: 15}}/>
              </View>
            </TouchableOpacity>
            <View style={{marginLeft: 15, marginRight: 15, flex: MonthTitle == "This Month" ? 0.6 : 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium'}}>{MonthTitle} {currentMonth != SelectedMonth && SelectedYear}</Text>
            </View>
            <TouchableOpacity onPress={IncreaseMonthButton} disabled={currentMonth == SelectedMonth && SelectedYear == currentYear} style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <View>
                <Image source={ChevronRightBlack} style={[{height: 15, width: 15 },
                currentMonth == SelectedMonth && SelectedYear == currentYear && {opacity: 0.3}]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingLeft: 10, paddingRight: 10, rowGap: 10}}>
          <View style={[styles.monthReport]}>
            <ScrollView style={{height: 162}} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
              <View style={styles.monthGraphSheet}>
                <View>
                  <NestedCircularProgress index={0} StartDateNumber={1} SelectedMonth={SelectedMonth} SelectedYear={SelectedYear} ExistingSubjectsArray={ExistingSubjectsArray}/>
                  <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <Text style={{fontFamily: 'sf-pro-display-medium', color: 'white'}}>1st Week</Text>
                  </View>
                </View>
                <View>
                  <NestedCircularProgress index={0} StartDateNumber={8} SelectedMonth={SelectedMonth} SelectedYear={SelectedYear} ExistingSubjectsArray={ExistingSubjectsArray}/>
                  <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <Text style={{fontFamily: 'sf-pro-display-medium', color: 'white'}}>2nd Week</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.monthGraphSheet}>
                <View>
                  <NestedCircularProgress index={0} StartDateNumber={15} SelectedMonth={SelectedMonth} SelectedYear={SelectedYear} ExistingSubjectsArray={ExistingSubjectsArray}/>
                  <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <Text style={{fontFamily: 'sf-pro-display-medium', color: 'white'}}>3rd Week</Text>
                  </View>
                </View>
                <View>
                  <NestedCircularProgress index={0} StartDateNumber={22} SelectedMonth={SelectedMonth} SelectedYear={SelectedYear} ExistingSubjectsArray={ExistingSubjectsArray}/>
                  <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <Text style={{fontFamily: 'sf-pro-display-medium', color: 'white'}}>4th Week</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity onPress={scrollToPosition} style={{backgroundColor: '#6f6f6f', height: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={BoldChevronDown} style={{height: 15, width: 15, transform:  [{rotate: MonthBoxPos == 'down' ?'180deg' : '0deg'}]}}/>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ height: 40, backgroundColor: 'white', borderRadius: 8, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, elevation: 5 }} onPress={() => setMonthlyAnalyticsStatus(true)}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#000000', fontFamily: 'sf-pro-display-medium', fontSize: 15}}>Month Analytics</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRightBlack} style={{height: 20, width: 20}}/>
            </View>
          </TouchableOpacity>

          <MonthlyAnalyticsModal
            MonthTitle={MonthTitle}
            MonthlyAnalyticsStatus={MonthlyAnalyticsStatus}
            SelectedMonth={SelectedMonth}
            SelectedYear={SelectedYear}
            setMonthlyAnalyticsStatus={setMonthlyAnalyticsStatus}
          />
          <View style={{marginTop: 10}}>
            <View style={{marginBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'sf-pro-display-medium', color: '#000'}}>New Insights will be soon unlocked with Streak</Text>
            </View>
            <LinearGradient colors={['#ffffff', '#D2CFE4']} style={{borderRadius: 10}}>
              <View style={{height: 100, borderRadius: 10, borderColor: '#6B1294', borderTopWidth: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={LockImage} style={{height: 15, width: 15}}/>
              </View>
            </LinearGradient>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <TrueSheet
      ref={ExistingSubjectSheet}
      sizes={['auto', 'large']}
      cornerRadius={24}
      >
        <ExistingSubjects 
        WorkToDo={FakeWork}
        setWorkToDo={setFakeWork}
        ExistingSubjectSheet={ExistingSubjectSheet}
        />
      </TrueSheet>
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
    backgroundColor: '#D2CFE4',
    // backgroundColor: 'black'
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
    paddingRight: 20,
    margin: 8, 
    marginTop: 15
    
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