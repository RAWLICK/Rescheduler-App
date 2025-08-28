import React, { RefObject } from 'react';
import { useState, useEffect, memo, useRef, useCallback } from 'react';
import ClockImage from '../Images/AnalogClockImage.png'
// import Holder from '../Images/Holder.png'
import AddIcon from '../Images/Add.png'
import LeftArrow from '../Images/LeftArrow.png'
import ScheduleTableIcon from '../Images/ScheduleTable.png'
import ClipboardIcon from '../Images/Clipboard.png'
import CalenderIcon from '../Images/Calender.png'
import Doodle from '../Images/Doodle.jpg'
import Reload from '../Images/Reload.png'
import 'react-native-gesture-handler'
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, Stop } from 'react-native-svg';
import Sound from 'react-native-sound';
// import ChainSound from '../Sounds/ChainSound.mp3'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from "@react-native-community/blur";
import BouncyCheckbox from "react-native-bouncy-checkbox";
// import Carousel from 'react-native-reanimated-carousel';
import {PythonShell} from 'python-shell';
import LinearGradient from 'react-native-linear-gradient';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { RouteProp } from '@react-navigation/native';
import { CombinedNavigationProp, CombinedRouteProp } from '../../App';
import { nanoid } from 'nanoid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import Navbar from '../Navbar/Navbar';
import ScheduleTable from '../Screens/ScheduleTable'
import CalenderView from '../Screens/CalenderView'
import TaskCompletionBoard from '../Screens/TaskCompletionBoard';
import { TaskCompletionPopUp } from '../Screens/TaskCompletionBoard';
import { ScheduleArrayItem } from '../Screens/AddTiming';
import { combineSlices } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux' 
import { addScheduleObject, removeScheduleObject,
   updateLocalStorageInfo,
   DemoUpdateLocalStorageInfo
   } from '../../app/Slice';
import { RootState } from '../../app/Store';
import { data } from '../../Functions/Animated-Bar-Chart/constants';
import useInternetCheck from '../Authentication/InternetCheck';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { addDays, subDays } from "date-fns";
import { updateStreakInfo } from '../../app/Slice';
import { CommonActions } from '@react-navigation/native';
import { registerUserInfo } from '../../app/Slice';
import { MotiView } from 'moti';
import {Easing as EasingNode} from 'react-native-reanimated';
import InAppReview from 'react-native-in-app-review';
import {persistor} from '../../app/Store';
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ApiDataType {
  "Durations": string[];
  "End_Timing": string[];
  "Start_Timing": string[];
  "Work": string[];
  "Start_Angle": number[];
  "End_Angle": number[];
}

const Clock = () => {
  const [hourRotation, setHourRotation] = useState(0);
  const [minuteRotation, setMinuteRotation] = useState(0);
  const [secondRotation, setSecondRotation] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const hTime = d.getHours();
      const mTime = d.getMinutes();
      const sTime = d.getSeconds();

      const hRotation = 30 * hTime + 0.5 * mTime + (0.5 / 60) * sTime; // 30 degrees per hour + 0.5 degrees per minute + 0.0083 degrees per second
      const mRotation = 6 * mTime;
      const sRotation = 6 * sTime;

      // Update the state, which will trigger a re-render
      setHourRotation(hRotation);
      setMinuteRotation(mRotation);
      setSecondRotation(sRotation);
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
  <ImageBackground source={ClockImage}  style={styles.Clock}>
    <View style={[styles.hour, { transform: [{ rotate: `${hourRotation}deg` }] }]}></View>
    <View style={[styles.minute, { transform: [{ rotate: `${minuteRotation}deg` }] }]}></View>
    <View style={[styles.second, { transform: [{ rotate: `${secondRotation}deg` }] }]}></View>
  </ImageBackground>
  );
};

type UpperAreaPropsType = {
  rescheduleStatus: string,
  currentHourTime: number, 
  currentMinTime: number, 
  currentMonth: number, 
  currentDay: number, 
  Work: string, 
  timeStart: string, 
  timeEnd: string,
  duration: string,
  TwelveHourFormat: (time: string) => string
  currentDateStringFormat: string,
  selectedDate: string
}

type RescheduleButtonAreaPropsType = {
  Loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ResButtonTitle: string;
  PriorSelections: number[];
  FixedSelections: number[];
  RemovingSelections: number[];
  rescheduleStatus: string, 
  DialogBackButton: () => void, 
  DialogTitle: string, 
  data: {
    StartTime: string[];
    EndTime: string[];
    Work: string[];
    StartAngle: number[];
    EndAngle: number[];
    TaskDate: string[]
    Slice_Color: string[];
  }, 
  hourRotation: number, 
  checked: boolean, 
  handleCheckboxChange: (index: number, checked: boolean) => void,
  RescheduleButtonClick: () => void,
  selectedDate: string,
  currentDateStringFormat: string,
  handleOutsidePress: () => void
}

type BottomOptionsAreaPropsType = {
  ApiData: ApiDataType
  rescheduleStatus: string;
  ScheduleTableButton: () => Promise<void>,
  ScheduleTableSheet: RefObject<TrueSheet>,
  CalenderButton: () => Promise<void>,
  CalenderSheet: RefObject<TrueSheet>,
  selectedDate: string,
  setSelectedDate: SetState<string>
  navigation: NavigationProp<any, any>
  currentDateStringFormat: string
}

const UpperArea = (props: UpperAreaPropsType) => {
  // console.log("Upper Area is made ran")
  const currentHourMinTime = `${props.currentHourTime.toString().padStart(2, '0')}:${props.currentMinTime.toString().padStart(2, '0')}`
  const stringToMonthConverter = (currentMonth: number) => {
    switch (currentMonth) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  }
  let currentMonth = stringToMonthConverter(props.currentMonth)
  let currentDate = props.currentDay.toString().padStart(2, '0')
  let selectedMonth = stringToMonthConverter(Number(props.selectedDate.split('/')[1]))
  let selectedDate = props.selectedDate.split('/')[0].padStart(2, '0')

  return (
    <View style={styles.UpperArea}>
      <View style={{flex: 0.5, backgroundColor: '#FFFFFF', marginBottom: 3, flexDirection: 'row', borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, elevation: 5}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderRightColor: 'grey', borderRightWidth: 0.5}}>
          <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>{props.currentDateStringFormat == props.selectedDate ? props.TwelveHourFormat(currentHourMinTime) : "-- --"}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>{props.selectedDate == props.currentDateStringFormat ? currentMonth : selectedMonth} {props.selectedDate == props.currentDateStringFormat ? currentDate : selectedDate}</Text>
        </View>
      </View>

      <View style={{flex: 1, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 5, borderTopLeftRadius: 5, elevation: 5}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'grey',  borderBottomWidth: 0.5}}>
          <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>{props.Work} {props.duration}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>{props.timeStart} - {props.timeEnd}</Text>
        </View>
      </View>
      {/* {infoVisible && (
        <AngleInfo/>
      )} */}
    </View>
  )
};

const RescheduleButtonArea = (props: RescheduleButtonAreaPropsType) => {
  // console.log("Reschedule Button Area is made ran");
  const requestReview = () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          console.log('In-App Review Flow:', hasFlowFinishedSuccessfully);
        })
        .catch((error) => {
          console.log('In-App Review Error:', error);
        });
    }
  };

  const DisplayingSubjects = props.data['StartAngle']
  .map((StartAngle: number, index: number) => ({
    StartAngle, 
    TaskDate: props.data['TaskDate'][index],
    index // Store the original index
  }))
  .filter(({TaskDate}) => {
    return TaskDate == props.currentDateStringFormat
  })
  .map(({TaskDate, index, StartAngle}, newIndex) => ({  // newIndex is made to index 0, 1 instead of 52, 53 etc.
    TaskDate, index, StartAngle, newIndex
  }))
  .filter(({index, StartAngle, newIndex}) => {
  if (props.rescheduleStatus == 'PriorStage') {
    return StartAngle <= props.hourRotation 
  }
  else if (props.rescheduleStatus == 'FixingStage') {
    if (!props.RemovingSelections.includes(newIndex)) {    // Prevent Fixed and Removing list getting common
      return StartAngle > props.hourRotation 
    }
  }
  else if (props.rescheduleStatus == 'RemovingStage') {
    if (!props.FixedSelections.includes(newIndex)) {       // Prevent Fixed and Removing list getting common
      return StartAngle > props.hourRotation 
    }
  }})
  const [toggle, setToggle] = useState(false);

  // Toggle state repeatedly to re-trigger the animation
  useEffect(() => {
    const interval = setInterval(() => {
      setToggle((prev) => !prev);
    }, 4000); // match your duration

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.LowerArea]}>
      {[...Array(3).keys()].map((index) => {
        return (
          // Don't Know how MotiView is working in iOS because it's package is not showing in Podfile.lock
        <MotiView
          key={`${index}-${toggle}`}
          style={[styles.RescheduleButton, { position: 'absolute', width: 270, height: 40}]}
          from={{
            opacity: 0.5,
            scaleX: 1,
            scaleY: 1
          }}
          animate={{ opacity: 0, scaleX: 1.3, scaleY: 1.5 }}
          transition={{
            type: 'timing',
            duration: 1500,
            easing: EasingNode.out(EasingNode.ease),
            // easing: EasingNode.inOut(EasingNode.quad),
            delay: index * 700,
            repeatReverse: false,
            loop: true
          }}
        />
      )})}
      <TouchableOpacity style={[styles.RescheduleButton]} onPress={() => props.RescheduleButtonClick()}>
        <Text style={[{fontFamily: Platform.OS == 'ios' ? 'CoolveticaRg-Regular' : 'coolvetica rg', fontSize: 23, color: 'white'}]}>{props.ResButtonTitle}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.RescheduleButton]} onPress={requestReview}>
        <Text style={[{fontFamily: Platform.OS == 'ios' ? 'CoolveticaRg-Regular' : 'coolvetica rg', fontSize: 23, color: 'white'}]}>{props.ResButtonTitle}</Text>
      </TouchableOpacity> */}
      <Modal transparent= {true} visible={props.rescheduleStatus !== 'off' && props.rescheduleStatus !== 'rescheduled'} animationType='fade'>
      {/* <TouchableWithoutFeedback onPress={props.handleOutsidePress}> */}
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
          <TouchableOpacity onPress={props.DialogBackButton} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={LeftArrow} style={{height: 17, width: 17}}/>
          </TouchableOpacity>
          <View style={{flex: 8, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>{props.DialogTitle}</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={{flex: 5, paddingLeft: DisplayingSubjects.length === 0 ? 0 : 20, paddingBottom: DisplayingSubjects.length === 0 ? 0 : 5}}>
          {DisplayingSubjects.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}}>
                No work left for this Section
              </Text>
            </View>
          ) : (
          <ScrollView>
          {DisplayingSubjects.map(({index, newIndex}) => {
            return(
              <View style={{margin: 5}} key={index}>
                <BouncyCheckbox
                  size={25}
                  isChecked={false}
                  fillColor="#2173BD"
                  // unFillColor="#FFFFFF"
                  text={String(props.data['Work'][index])}
                  iconStyle={{ borderColor: "red" }}
                  innerIconStyle={{ borderWidth: 2 }}
                  textStyle={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', color: '#fff', textDecorationLine: 'none' }}
                  onPress={(isChecked: boolean) => props.handleCheckboxChange(newIndex, isChecked)}
                />
              </View>
            )})}
            </ScrollView>
          )}
          </View>
          {props.Loading ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          ) : (
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}} onPress={() => props.RescheduleButtonClick()}>
            <View>
              <Text style={{color: '#457fdf', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>Next</Text>
            </View>
          </TouchableOpacity>
          )}
        </View>
      </View>
    {/* </TouchableWithoutFeedback> */}
    </Modal>
    </View>
  )
};

const BottomOptionsArea = (props: BottomOptionsAreaPropsType) => {
  // console.log("BottomOptionsArea is made ran");
  const currentDate = new Date();
  function ClickingAddTiming() {
    if (props.rescheduleStatus === 'rescheduled') {
      Alert.alert('You have Rescheduled', 'Please click on "Back To Normal" to come back and add new timings of subjects')
    }
    else {
      props.navigation.navigate('StackScreens', {screen: 'AddTimingStack'});
    }
  }

  function ClickingCalender() {
    if (props.rescheduleStatus === 'rescheduled') {
      Alert.alert('You have Rescheduled', 'Please click on "Back To Normal" to come back and select date from Calender')
    }
    else {
      props.CalenderButton();
    }
  }
  return (
    <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginRight: 60, marginLeft: 60}}>
      <View style={{backgroundColor: '#BFB8E9', flexDirection: 'row', paddingTop: 8, paddingBottom: 8, borderRadius: 10, elevation: 5}}>
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={props.ScheduleTableButton}>
          <Image source={ClipboardIcon} style={{width: 35, height: 35}}/>
        </TouchableOpacity>
        <TrueSheet
          ref={props.ScheduleTableSheet}
          sizes={['auto', 'large']}
          cornerRadius={24}
        >
          <ScheduleTable
          ApiData={props.ApiData}
          rescheduleStatus={props.rescheduleStatus}
          selectedDate={props.selectedDate}
          />
        </TrueSheet>

        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={ClickingCalender}>
          {(props.currentDateStringFormat != props.selectedDate) &&
            <View style={{backgroundColor: 'red', borderRadius: 20, height: 8, width: 8, marginLeft: 40}}></View>
          }
          <Image source={CalenderIcon} style={{width: 29, height: 29}}/>
        </TouchableOpacity>
        <TrueSheet
        ref={props.CalenderSheet}
        sizes={['auto', 'large']}
        cornerRadius={24}
        >
          <CalenderView
           selectedDate={props.selectedDate} 
           setSelectedDate={props.setSelectedDate}
          />
        </TrueSheet>

        <TouchableOpacity style={[{ flex: 1, justifyContent: 'center', alignItems: 'center'}]} 
        onPress={ClickingAddTiming}>
          <View style={{}}>
            <Image style={styles.AddIcon} source={AddIcon}/>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const Schedule: React.FC = () => {
    const isConnected = useInternetCheck();
    const route = useRoute<CombinedRouteProp>();
    const navigation = useNavigation<NavigationProp<any, any>>();
    // const navigation = useNavigation<CombinedNavigationProp>();
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentHourTime = currentDate.getHours();
    const currentMinTime = currentDate.getMinutes();
    const currentSecTime = currentDate.getSeconds();
    // const currentDay = currentDate.getDate();
    const [currentDay, setCurrentDay] = useState(currentDate.getDate())
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentDateStringFormat = (`${currentDay.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`)
    const [previousDate, setPreviousDate] = useState(subDays(new Date(), 1))
    const [previousDay, setPreviousDay] = useState(previousDate.getDate())
    const previousDayMonth = previousDate.getMonth() + 1;
    const previousDayYear = previousDate.getFullYear();
    const previousDateStringFormat = (`${previousDay.toString().padStart(2, '0')}/${previousDayMonth.toString().padStart(2, '0')}/${previousDayYear}`)
    const [PrevToPrevDate, setPrevToPrevDate] = useState(subDays(new Date(), 2))
    const [PrevToPrevDay, setPrevToPrevDay] = useState(PrevToPrevDate.getDate())
    const PrevToPrevDayMonth = PrevToPrevDate.getMonth() + 1
    const PrevToPrevDayYear = PrevToPrevDate.getFullYear();
    const PrevToPrevDateStringFormat = (`${PrevToPrevDay.toString().padStart(2, '0')}/${PrevToPrevDayMonth.toString().padStart(2, '0')}/${PrevToPrevDayYear}`)

    const [selectedDate, setSelectedDate] = useState(currentDateStringFormat);
    const [hourRotation, setHourRotation] = useState(0);
    const [minuteRotation, setMinuteRotation] = useState(0);
    const [secondRotation, setSecondRotation] = useState(0);
    const [FiveSecGap, setFiveSecGap] = useState(1)
    const angle = useSharedValue(0);
    const startAngle = useSharedValue(0);
    const [timeStart, settimeStart] = useState('')
    const [timeEnd, settimeEnd] = useState('')
    const [duration, setduration] = useState('')
    const [Work, setWork] = useState('Free Time')
    const [angleColor, setangleColor] = useState('')
    const color = [
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
    ]
    const [tintstatus, setTintStatus] = useState(false)
    const [strokeStatus, setStrokeStatus] = useState(false)
    const [rescheduleStatus, setRescheduleStatus] = useState('off')
    const roughRescheduleStatus = useRef("off");
    const [DialogTitle, setDialogTitle] = useState('')
    const [ResButtonTitle, setResButtonTitle] = useState('Smart Compress')
    const [checked, setChecked] = useState(false);
    // const width = Dimensions.get('window').width;  // For Carousel
    const [serverResponseMessage, setServerResponseMessage] = useState(false)
    const ScheduleTableSheet = useRef<TrueSheet>(null);
    const CalenderSheet = useRef<TrueSheet>(null);
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
    const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
    const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState)
    const DemoNumberHere = useSelector((state: RootState) => state.DemoArraySliceReducer.DemoArrayInitialState)
    // const FullState = useSelector((state: RootState) => state)
    // const LocalStorageInfo = useSelector((state: RootState) => state.LocalStorageInfoSliceReducer.LocalStorageInfoInitialState)
    const [Loading, setLoading] = useState(false)
    const TodayScheduleArray: ScheduleArrayItem[] = [];
    
    const data = {
      "uniqueID": ScheduleArray.map((item: ScheduleArrayItem) => item.uniqueID),
      "StartTime": ScheduleArray.map((item: ScheduleArrayItem) => item.StartTime),
      "EndTime": ScheduleArray.map((item: ScheduleArrayItem) => item.EndTime),
      "Work": ScheduleArray.map((item: ScheduleArrayItem) => item.Work),
      "StartAngle": ScheduleArray.map((item: ScheduleArrayItem) => item.StartAngle),
      "EndAngle": ScheduleArray.map((item: ScheduleArrayItem) => item.EndAngle),
      "TaskDate": ScheduleArray.map((item: ScheduleArrayItem) => item.TaskDate),
      "Slice_Color": ScheduleArray.map((item: ScheduleArrayItem) => item.Slice_Color),
    }
    
    const [ApiData, setApiData] = useState<ApiDataType>({} as ApiDataType)
    
    const [PriorSelections, setPriorSelections] = useState<number[]>([])
    const [FixedSelections, setFixedSelections] = useState<number[]>([])
    const [RemovingSelections, setRemovingSelections] = useState<number[]>([])

    useEffect(() => {
      const intervalId = setInterval(() => {
        const d = new Date();
        const pd = subDays(new Date(), 1);
        const ptpd = subDays(new Date(), 2);
        const hTime = d.getHours();
        const mTime = d.getMinutes();
        const sTime = d.getSeconds();
  
        const hRotation = 30 * hTime + 0.5 * mTime + (0.5 / 60) * 30; // Calculate hour rotation based on current time
        const mRotation = 6 * mTime;
        const sRotation = 6 * sTime;
  
        setHourRotation(hRotation);
        setMinuteRotation(mRotation);
        setSecondRotation(sRotation);
        setCurrentDate(d);
        setPreviousDate(pd);
        setPrevToPrevDate(ptpd);
        setCurrentDay(d.getDate());
        setPreviousDay(pd.getDate());
        setPrevToPrevDay(ptpd.getDate());
      }, 1000);
  
      // Clean up the interval on unmount
      return () => clearInterval(intervalId);
    }, []);

    // const [sound, setSound] = useState<Sound | null>(null);
    // const playSound = () => {
    //   const newSound = new Sound(ChainSound, Sound.MAIN_BUNDLE, (error) => {
    //     if (error) {
    //       console.log('Failed to load the sound', error);
    //       return;
    //     }
    //     // Play the sound
    //     newSound.play((success) => {
    //       if (success) {
    //         console.log('Successfully finished playing');
    //       } else {
    //         console.log('Playback failed due to audio decoding errors');
    //       }
    //   });
    //   setSound(newSound);
    // })};
    
    // const pan = Gesture.Pan()
    //   .onBegin(() => {
    //     startAngle.value = angle.value;
    //     console.log("Pressed onBegin")
    //   })
    //   .onStart(() => {
    //     startAngle.value = angle.value;
    //     console.log("Pressed onStart")
    //   })
    //   .onChange((event) => {
    //     console.log("Pressed onChange")
    //     const x = event.translationX;
    //     const y = event.translationY;
    //     const newAngle = Math.atan2(y, x);
    //     angle.value = startAngle.value + newAngle;
    //     // playSound();
    //   })
    //   .onFinalize(() => {
    //     console.log("Pressed onFinalize")
    //   });
                                                                                                                   
      // const animatedStyles = useAnimatedStyle(() => ({
      //   transform: [
      //     { rotate: `${angle.value}rad` }]
      // }));
  
    // const data = {
    //   "Start_": [300.0, 325.5, 351.0, 357.5, 383.0, 389.5, 390.0, 420.0, 445.0, 458.0, 496.5, 510.0, 540.0, 552.0, 565.0],
    //   "End_": [325.5, 351.0, 357.5, 383.0, 389.5, 390.0, 420.0, 445.0, 458.0, 496.5, 510.0, 540.0, 552.0, 565.0, 590.5],
    //   "Time_Start": ['10:00:00', '10:51:00', '11:42:00', '11:55:00', '12:46:00', '12:59:00', '13:00:00', '14:00:00', '14:50:00', '15:16:00', '16:33:00', '17:00:00', '18:00:00', '18:24:00', '18:50:00', '19:41:00', '22:00:00', '22:30:00', '22:44:00', '00:00:00'],
    //   "Time_End": ['10:51:00', '11:42:00', '11:55:00', '12:46:00', '12:59:00', '13:00:00', '14:00:00', '14:50:00', '15:16:00', '16:33:00', '17:00:00', '18:00:00', '18:24:00', '18:50:00', '19:41:00', '22:00:00', '22:30:00', '22:44:00', '00:00:00', '05:00:00'],
    //   "Duration": [51, 51, 13, 51, 13, 1, 60, 50, 26, 77, 27, 60, 24, 26, 51, 139, 30, 14, 76, 300],
    //   "Slice_Color": [
    //   "rgba(175, 193, 85, 0.5)",
    //   "rgba(182, 108, 239, 0.5)",
    //   "rgba(78, 161, 40, 0.5)",
    //   "rgba(71, 214, 63, 0.5)",
    //   "rgba(19, 249, 16, 0.5)",
    //   "rgba(69, 221, 118, 0.5)", 
    //   "rgba(17, 150, 214, 0.5) ",
    //   "rgba(174, 182, 155, 0.5)",
    //   "rgba(54, 147, 187, 0.5) ",
    //   "rgba(49, 107, 93, 0.5)",
    //   "rgba(12, 248, 250, 0.5) ",
    //   "rgba(146, 120, 43, 0.5)", 
    //   "rgba(38, 3, 93, 0.5)",
    //   "rgba(240, 19, 80, 0.5)",
    //   "rgba(227, 127, 0, 0.5)",
    //   "rgba(38, 131, 56, 0.5)",
    //   "rgba(57, 190, 200, 0.5)",
    //   "rgba(28, 79, 20, 0.5)",
    //   "rgba(82, 176, 27, 0.5)",
    //   "rgba(191, 115, 181, 0.5)"],
    //   "Work": ['Work 1', 'Work 2', 'Work 2 Break', 'Work 3', 'Work 3 Break', 'Work 4', 'Work 4 Break','Sona', 'Work 5', 'Work 5 Break', 'Work 6', 'Free 1', 'Work 7', 'Work 8', 'Work 9', 'Fuck 1', 'Fuck 2', 'Fuck 3', 'Fuck 4', 'Fuck 5']
    // };

    

    // useEffect(() => {
    //   console.log("Data (In Schedule.tsx): ", data)
    // }, [])

    const TwelveHourFormat = (time: string) => {
      // console.log("TwelveHourFormat is made ran");
      let NumberHour = Number(time.split(':', 1))
      let MinuteHour = Number(time.slice(3, 5))
      if (NumberHour > 12) {
        return `${(NumberHour - 12).toString().padStart(2, '0')}:${time.slice(3, 5)} PM`
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

    function angleToTime(angle: number) {
      // console.log("angleToTime is made ran");
      // Each hour represents 30 degrees (360 degrees / 12 hours)
      const hours = Math.floor(angle / 30);
      
      // Each degree represents 2 minutes (360 degrees / 12 hours / 60 minutes)
      const minutes = Math.floor((angle % 30) * 2);

      if (minutes == 0 && hours == 1) {
        return `${hours} hour`;
      }
      else if (hours == 0 && minutes == 1) {
        return `${minutes} minute`;
      }
      else if (hours == 0 && minutes > 1) {
        return `${minutes} minutes`;
      }
      else if (minutes == 0 && hours > 1) {
        return `${hours} hours`;
      }
      else if (hours == 1 && minutes == 1) {
        return `${hours} hour and ${minutes} minute`;
      }
      else if (hours == 1 && minutes > 1) {
        return `${hours} hour and ${minutes} minutes`;
      }
      else if (hours > 1 && minutes == 1 ) {
        return `${hours}hours ${minutes} minute`;
      }
      else {
        return `${hours} hours and ${minutes} minutes`;
      }
    }

    const SingleAngle = useCallback(() => {
      // console.log("SingleAngle is made ran");
      const hardRadius = 150;
      const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        // The - 90 is used to adjust the angle so that 0 degrees points upwards, which is common in many applications like graphical rendering.
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
        };
      };
  
      // Polar coordinates represent a point in a plane using a distance from a reference point (called the radius) and an angle from a reference direction.
      // Cartesian coordinates represent a point in a plane using an x-coordinate and a y-coordinate.
      const getSingleAnglePath = (cx: number, cy: number, radius: number, angle: number, startAng: number) => {
        const p1 = polarToCartesian(cx, cy, radius, startAng);
        const p2 = polarToCartesian(cx, cy, radius, angle);
        
        // A rx,ry x-axis-rotation large-arc-flag,sweep-flag x,y
        // large-arc-flag: This flag determines whether the arc should be greater than or less than 180 degrees. It can be 0 or 1:
        // 1 means the arc spans greater than or equal to 180 degrees.
        // 0 means the arc spans less than 180 degrees.
        return [
          `M ${cx},${cy}`,
          `L ${p1.x},${p1.y}`,
          `A ${radius},${radius} 0 ${angle - startAng > 180 ? 1 : 0},1 ${p2.x},${p2.y}`,
          `L ${cx},${cy}`
        ].join(" ");
      };
  
      return (
        <Svg width={hardRadius * 2} height={hardRadius * 2} viewBox={`0 0 ${hardRadius * 2} ${hardRadius * 2}`}>
          <Circle cx={hardRadius} cy={hardRadius} r={hardRadius} fill='#FFFFFF'/>
          {/* <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="red" stopOpacity="1" />
              <Stop offset="50%" stopColor="red" stopOpacity="0" />
            </LinearGradient>
          </Defs> */}

          {rescheduleStatus == "off" && (
          data['TaskDate']
          .map((TaskDate:string, index:number) =>
          ({TaskDate, index, StartAngle: data['StartAngle'][index], EndAngle: data['EndAngle'][index]}))
          .filter(({TaskDate}) => TaskDate === selectedDate)
          .filter(({EndAngle}) => EndAngle > hourRotation)
          .filter(({StartAngle}) => StartAngle < hourRotation + 360)
          .map(({index}) => {
            const uniqueID = data['uniqueID'][index]
            const startAngle = data['StartAngle'][index];
            const endAngle = data['EndAngle'][index];
            const sectorColor = data['Slice_Color'][index];
            const startTime = data['StartTime'][index]
            const endTime = data['EndTime'][index]
            const angleDuration = angleToTime(endAngle - startAngle)
            const angleWork = data['Work'][index]
            
            const angleOnPress = () => {
              console.log('Pressed onOP');
              settimeStart(TwelveHourFormat(startTime));
              settimeEnd(TwelveHourFormat(endTime));
              setWork(angleWork);
              setduration(`(${angleDuration})`);
              setangleColor(sectorColor);
              setStrokeStatus(true);
              // console.log(angleColor);
            };

            return(
              <Path
                key={uniqueID}
                d={getSingleAnglePath(hardRadius, hardRadius, hardRadius, endAngle, startAngle)}
                fill={sectorColor}  
                onPressIn={()=> angleOnPress()}
                onPressOut={LabelChanging}
                // stroke={strokeStatus? '#000000' : 'none'}
                // strokeDasharray="5,10"  // 10 units of stroke, 5 units of gap
                // strokeDashoffset="0"    // Start from the beginning of the path

                // stroke="url(#grad)"     //<Defs> Part
                // strokeWidth="4"
              />
          )}))}

          {rescheduleStatus == "rescheduled" && (
            ApiData?.['Start_Angle']
            .map((Start_Angle:number, index:number) => ({Start_Angle, index, End_Angle: ApiData['End_Angle'][index]}))
            .filter(({End_Angle}) => End_Angle > hourRotation)
            .filter(({Start_Angle}) => Start_Angle < hourRotation + 360)
            .map(({index}) => {
              // const uniqueID = data['uniqueID'][index]
              const startAngle = ApiData['Start_Angle'][index];
              const endAngle = ApiData['End_Angle'][index];
              const sectorColor = color[index];
              const startTime = ApiData['Start_Timing'][index]
              const endTime = ApiData['End_Timing'][index]
              const angleDuration = angleToTime(endAngle - startAngle)
              const angleWork = ApiData['Work'][index]
              
              const angleOnPress = () => {
                console.log('Pressed onOP');
                settimeStart(TwelveHourFormat(startTime));
                settimeEnd(TwelveHourFormat(endTime));
                setWork(angleWork);
                setduration(`(${angleDuration})`);
                setangleColor(sectorColor);
                setStrokeStatus(true);
                // console.log(angleColor);
              };
  
              return(
                <Path
                  // key={uniqueID}
                  key={startAngle}
                  d={getSingleAnglePath(hardRadius, hardRadius, hardRadius, endAngle, startAngle)}
                  fill={sectorColor}  
                  onPressIn={()=> angleOnPress()}
                  onPressOut={LabelChanging}
                  // stroke={strokeStatus? '#000000' : 'none'}
                  // strokeDasharray="5,10"  // 10 units of stroke, 5 units of gap
                  // strokeDashoffset="0"    // Start from the beginning of the path
  
                  // stroke="url(#grad)"     //<Defs> Part
                  // strokeWidth="4"
                />
            )})
          )}
        </Svg>
      );
    }, [ScheduleArray, selectedDate, rescheduleStatus, minuteRotation]);
    
    for (let index = 0; index < ScheduleArray.length; index++) {
      const eachWork = ScheduleArray[index];
      if (eachWork["TaskDate"] == currentDateStringFormat) {
        TodayScheduleArray.push(eachWork)
      }
    }

    // In the backend API case, ensure to have a 3rd device to share the same network in both PC and real device emulator and also ensure that Windows Firewall is closed.

    const sendNameToBackend = async () => {
      // console.log("sendNameToBackend is made ran");
      setLoading(true);  // Set loading state to true
      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/':'http://192.168.31.141:5000/',
          'https://rescheduler-server.onrender.com/',
          {
          method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
          },
          // body: JSON.stringify({ "ImportedDataFrame": JSON.stringify(TodayScheduleArray), "currentTime": "05/01/2025 09:00", "PriorSelections": "0,1", "FixedSelections": "5", "RemovingSelections": "1"}), // Convert the request payload to JSON.
          body: JSON.stringify({ "ImportedDataFrame": JSON.stringify(TodayScheduleArray), "currentTime": `${currentDateStringFormat} ${currentHourTime}:${currentMinTime}`, "PriorSelections": `${PriorSelections}`, "FixedSelections": `${FixedSelections}`, "RemovingSelections": `${RemovingSelections}`}), // Convert the request payload to JSON.
        })
  
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data from the server');
        }
        // setLoading(false);  // Set loading state to false
        const fetched_data = await response.json(); // Parse JSON response
        setApiData(fetched_data)
        setServerResponseMessage(true);  // Update state with server response
        // console.log("API_DATA: ", JSON.stringify(ApiData))
      } catch (error) {
        setLoading(false);  // Set loading state to false
        console.log('Catch Error: ', error);
        Alert.alert('No Internet', 'Please connect with the internet');  // Handle network error
      }

      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/IncrementRescheduleClick':'http://192.168.131.92:5000/IncrementRescheduleClick',
          'https://rescheduler-server.onrender.com/IncrementRescheduleClick',
          {
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({ 
              "uniqueID": StudentInfoData.uniqueID, 
            })
          })
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data from the server');
        }
        setLoading(false);  // Set loading state to false
        const fetched_data = await response.json(); // Parse JSON response
        console.log(fetched_data)
        return true
      } catch (error) {
        setLoading(false);  // Set loading state to false
        // console.error('Catch Error: ', error);
        return false
      }
    };

    const DialogBackButton = () => {
      // console.log("DialogBackButton is made ran");
      setRescheduleStatus('off')
      roughRescheduleStatus.current = 'off';
      // rescheduleStatus === 'PriorStage' && setRescheduleStatus('off')
      // rescheduleStatus === 'FixingStage' && setRescheduleStatus('PriorStage')
      // rescheduleStatus === 'RemovingStage' && setRescheduleStatus('FixingStage')
    }

    const RescheduleButtonClick = async() => {
      // console.log("RescheduleButtonClick is made ran");
      const DisplayingSubjects = data['StartAngle']
      .map((StartAngle: number, index: number) => ({
        StartAngle, 
        TaskDate: data['TaskDate'][index],
        index // Store the original index
      }))
      .filter(({TaskDate}) => {
        return TaskDate == currentDateStringFormat
      })
      .map(({TaskDate, index, StartAngle}, newIndex) => ({  // newIndex is made to index 0, 1 instead of 52, 53 etc.
        TaskDate, index, StartAngle, newIndex
      }))
      .filter(({index, StartAngle, newIndex}) => {
      // Here roughRescheduleStatus is used instead of rescheduleStatus because I want to use the current status of rescheduleStatus
      if (roughRescheduleStatus.current == 'PriorStage') {
        return StartAngle <= hourRotation 
      }
      else if (roughRescheduleStatus.current == 'FixingStage') {
        // Removed including excluding condition here because I want all angles after current angle
          return StartAngle > hourRotation 
      }
      else if (roughRescheduleStatus.current == 'RemovingStage') {
       // Removed including excluding condition here because I want all angles after current angle
          return StartAngle > hourRotation 
      }})
      
      // Changing to PriorStage
      if (rescheduleStatus === 'off') {
        setRescheduleStatus('PriorStage')
        setSelectedDate(currentDateStringFormat);
        roughRescheduleStatus.current = 'PriorStage';
      }
      
      // Changing to FixingStage
      if (rescheduleStatus === 'PriorStage') {
        setRescheduleStatus('FixingStage')
        roughRescheduleStatus.current = 'FixingStage';
      }

      // Changing to RemovingStage
      if (DisplayingSubjects.length === 0 && rescheduleStatus === 'FixingStage') {
        console.log("DisplayingSubjects: ", DisplayingSubjects)
        Alert.alert("No Work Ahead", `Without any Work Ahead, Schedule cannot be made`)
        return;
      }
      else if (rescheduleStatus === 'FixingStage' && PriorSelections.length === 0 && DisplayingSubjects.length === FixedSelections.length) {
        Alert.alert("Same Schedule", `Selecting none of the Previous Work and Fixing all the Work Timing Ahead will result in same Schedule as before`)
        return;
      }
      else {
        rescheduleStatus === 'FixingStage' && setRescheduleStatus('RemovingStage')
        if (rescheduleStatus === 'FixingStage') {
          roughRescheduleStatus.current = 'RemovingStage';
        }
      }

      // Changing to Rescheduled Stage
      if (PriorSelections.length == 0 && FixedSelections.length == 0 && RemovingSelections.length == 0 && rescheduleStatus === 'RemovingStage') {
        Alert.alert("No Work Selected", `Select out some work to get rescheduled`)
      }
      else {
        rescheduleStatus === 'RemovingStage' && sendNameToBackend().then((result) => {
          if (result) {
            setRescheduleStatus('rescheduled')
            setResButtonTitle('Back To Normal')
            roughRescheduleStatus.current = 'rescheduled';
          }
        })
      }

      // Changing back to Off Stage
      if (rescheduleStatus == 'rescheduled') {
        setRescheduleStatus('off')
        roughRescheduleStatus.current = 'off';
      }
    }

    const handleOutsidePress = () => {
      Keyboard.dismiss();                   // Close keyboard if open
      setRescheduleStatus("off")        // Close modal
    };

    const handleCheckboxChange = (index: number, checked: boolean) => {
      // console.log("handleCheckboxChange is made ran");
      if (rescheduleStatus == 'PriorStage') {
        setPriorSelections((prevSelections) => {
          if (checked) {
            const newSelections = [...prevSelections, index]
            return newSelections.sort((a, b) => a - b);
          } 
          else {
            const newSelections = prevSelections.filter((item) => item !== index);
            return newSelections.sort((a, b) => a - b);
          }
        })
      }
      else if (rescheduleStatus == 'FixingStage') {
        setFixedSelections((prevSelections) => {
          if (checked) {
            const newSelections = [...prevSelections, index]
            return newSelections.sort((a, b) => a - b);
          } 
          else {
            const newSelections = prevSelections.filter((item) => item !== index);
            return newSelections.sort((a, b) => a - b);
          }
        })
        // console.log("FixedSelectionList: ", FixedSelections)
      }
      else if (rescheduleStatus == 'RemovingStage') {
        setRemovingSelections((prevSelections) => {
          if (checked) {
            const newSelections = [...prevSelections, index]
            return newSelections.sort((a, b) => a - b);
          } 
          else {
            const newSelections = prevSelections.filter((item) => item !== index);
            return newSelections.sort((a, b) => a - b);
          }
        })
        // console.log("RemovingSelectionList: ", RemovingSelections)
      }
    };

    function LabelChanging() {
      // console.log("LabelChanging is made ran");
      if (rescheduleStatus != "rescheduled") {
        for (let index = 0; index < data["TaskDate"].length; index++) {
          const uniqueID = data['uniqueID'][index]
          const startAngle = data['StartAngle'][index];
          const endAngle = data['EndAngle'][index];
          const sectorColor = data['Slice_Color'][index];
          const startTime = data['StartTime'][index]
          const endTime = data['EndTime'][index]
          const angleDuration = angleToTime(endAngle - startAngle)
          const angleWork = data['Work'][index]
          const TaskDate = data['TaskDate'][index]
          if (TaskDate === selectedDate) {
            if (hourRotation >= startAngle && hourRotation <= endAngle) {
              setWork(angleWork);
              setduration(`(${angleDuration})`);
              settimeStart(TwelveHourFormat(startTime));
              settimeEnd(TwelveHourFormat(endTime));
              break;
            }
            else if (hourRotation < startAngle || hourRotation > endAngle) {
              setWork('Free Time');
              setduration("");
              settimeStart("");
              settimeEnd("");
            }
          }
        }
      }
      else if (rescheduleStatus == 'rescheduled') {
        for (let index = 0; index < ApiData["Start_Angle"].length; index++) {
          // const uniqueID = data['uniqueID'][index]
          const startAngle = ApiData['Start_Angle'][index];
          const endAngle = ApiData['End_Angle'][index];
          const startTime = ApiData['Start_Timing'][index]
          const endTime = ApiData['End_Timing'][index]
          const angleDuration = angleToTime(endAngle - startAngle)
          const angleWork = ApiData['Work'][index]
          if (hourRotation >= startAngle && hourRotation <= endAngle) {
            setWork(angleWork);
            setduration(`(${angleDuration})`);
            settimeStart(TwelveHourFormat(startTime));
            settimeEnd(TwelveHourFormat(endTime));
            break;
          }
          else if (hourRotation < startAngle || hourRotation > endAngle) {
            setWork('Free Time');
            setduration("");
            settimeStart("");
            settimeEnd("");
          }
        }
      }
    }

    async function ScheduleTableButton () {
      await ScheduleTableSheet.current?.present();
    }

    async function CalenderButton () {
      await CalenderSheet.current?.present();
    }

    const checkAppVersion = async () => {
      // console.log("checkAppVersion is made ran");
      const currentVersion = DeviceInfo.getVersion(); // e.g., "1.0.0"
      try {
        const Fetched_VersionInfo = await fetch('https://rescheduler-server.onrender.com/GetVersionInfo');
        const VersionInfo = await Fetched_VersionInfo.json();

        function ReturningLatestVersion() {
          if (Platform.OS == 'android') {
            const latestVersion: string = VersionInfo[0]["Versions"]["LatestVersion"]
            const forceUpdate: string = VersionInfo[0]["Versions"]["UpdateRequired"]
            return {latestVersion, forceUpdate}
          }
          else if (Platform.OS == 'ios') {
            const latestVersion: string = VersionInfo[1]["Versions"]["LatestVersion"]
            const forceUpdate: string = VersionInfo[1]["Versions"]["UpdateRequired"]
            return {latestVersion, forceUpdate}
          }
          return undefined
        }

        const result = ReturningLatestVersion();

        if (result) {
          const { latestVersion, forceUpdate } = result;
          const isForceUpdate = forceUpdate === "true"; // Convert string to boolean
          if (currentVersion !== latestVersion) {
            const buttons = [
              {
                text: 'Update Now',
                onPress: () => {
                  const storeUrl = Platform.OS === 'ios'
                    ? 'https://apps.apple.com/us/app/rescheduler/id6745407651'
                    : 'https://play.google.com/store/apps/details?id=com.rescheduler';
                  Linking.openURL(storeUrl);
                },
              },
            ]

            // if (isForceUpdate) {
            //   buttons.push({
            //     text: 'Cancel',
            //     onPress: () => console.log('User cancelled'),
            //   });
            // }

            Alert.alert(
              'Update Required',
              'A new version of the app is available. Please update to continue.',
              buttons,
              { cancelable: !isForceUpdate }
            );
          }
        }
      } catch (error) {
        console.log("Unable to Check App Version")
      }
      
    };

    async function IsStatsWorkRegistered() {
      // console.log("IsStatsWorkRegistered is made ran");
      console.log("Previous Date: ", previousDateStringFormat)
      if (ExistingSubjectsArray.length != 0) {
        let totalCountForDelete = 0;
        for (let index = 0; index < ExistingSubjectsArray.length; index++) {
          const foundDate = ExistingSubjectsArray[index]["Dataframe"].find(stat => stat.Date === PrevToPrevDateStringFormat)
          if (!foundDate) {
            totalCountForDelete += 1;
          }
        }
        if (totalCountForDelete == ExistingSubjectsArray.length) {
          console.log("Total Count for Deletion is matching length of ExistingSubjectsArray")
          dispatch(updateStreakInfo("Vanish"));
          try {
            const response = await fetch (
            // Platform.OS === 'ios'? 'http://localhost:5000/UpdateStudent':'http://192.168.131.92:5000/UpdateStudent',
            'https://rescheduler-server.onrender.com/UpdateStudent',
            {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({
                "Type": "uniqueID",
                "Value": StudentInfoData["uniqueID"],
                "Updates": { "Streak": 1 } 
              })
            })
            if (!response.ok) {  // Handle HTTP errors
            throw new Error('Failed to fetch data from the server');
            }
          } catch (error) {
              console.error('Catch Error: ', error);
          }
        }

        let totalCountForBoard = 0;
        for (let index = 0; index < ExistingSubjectsArray.length; index++) {
          const foundDate = ExistingSubjectsArray[index]["Dataframe"].find(stat => stat.Date === previousDateStringFormat)
          if (!foundDate) {
            totalCountForBoard += 1;
          }
        }
        if (totalCountForBoard == ExistingSubjectsArray.length) {
          console.log("Total Count for Board is matching length of ExistingSubjectsArray")
          navigation.navigate('StackScreens', {
            screen: 'TaskCompletionBoardStack',
            params: undefined
          })
        }
      }
    }

    async function RegularStudentInfoUpdate() {
      try {
          const StudentInfoResponse = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/GetStudentInfo':'http://10.0.2.2:5000/GetStudentInfo',
          'https://rescheduler-server.onrender.com/GetStudentInfo',
          { 
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({
              "Value": StudentInfoData["uniqueID"], // Use the uniqueID from StudentInfoData
              "Type": "uniqueID"
          }), // Convert the request payload to JSON.
          })
          
          if (!StudentInfoResponse.ok) {  // Handle HTTP errors
            throw new Error('Failed to add data to the server');
          }
          const fetched_StudentInfo = await StudentInfoResponse.json();
          // console.log("Fetched StudentInfo: ", fetched_StudentInfo)
          dispatch(registerUserInfo(fetched_StudentInfo))
          
      } catch (error) {
          console.error('Catch Error: ', error);
      }
    }

    function TrialValidity() {
      const currentDate = new Date();
      const formatDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
        return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
      };
      if (currentDate >= addDays(formatDate(StudentInfoData?.["Date Joined"] || ''), 7) && StudentInfoData?.["Subscription Type"] == "Free") {
      // if (currentDate >= addDays(formatDate("02/05/2025"), 7) && StudentInfoData["Subscription Type"] == "Free") {
        Alert.alert("Trial Ended", `Your 7 Days Trial Ended. Kindly Subscribe to continue`)
        return false;
      }
    }
    
    // useEffect(() => {
    //   if (TrialValidity() == false) {
    //       navigation.dispatch(
    //           CommonActions.reset({
    //               index: 0,
    //               routes: [
    //                   {
    //                       name: 'DrawerScreens',
    //                       state: {
    //                           routes: [
    //                               {
    //                                   name: 'SubscriptionDrawer',
    //                               },
    //                           ],
    //                       },
    //                   },
    //               ],
    //           })
    //       );
    //   }
    // }, [])

    useEffect(() => {
      roughRescheduleStatus.current = "off"
    }, [])

    useEffect(() => {
      const intervalId = setInterval(() => {
        const d = new Date(); 
        const currentsec = d.getSeconds();
        setFiveSecGap(currentsec)
      }, 5000);
  
      // Clean up the interval on unmount
      return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
      if (rescheduleStatus === 'PriorStage') {
        setDialogTitle('Any Previous Work to Choose ?');
      }
      else if (rescheduleStatus === 'FixingStage') {
        setDialogTitle('Any Work Timing to remain fixed ?');
      }
      else if (rescheduleStatus === 'RemovingStage') {
        setDialogTitle('Any Work ahead to be Removed ?');
      }
    }, [rescheduleStatus]);
    
    useEffect(() => {
      IsStatsWorkRegistered()
    }, [previousDay])
    
    useEffect(() => {
      console.log("Reschedule Status: ", rescheduleStatus)
      console.log("rough Reschedule Status: ", roughRescheduleStatus.current)
    }, [rescheduleStatus])
    
    useEffect(() => {
      console.log("PriorSelectionList: ", PriorSelections)
    }, [PriorSelections]);
    useEffect(() => {
      console.log("FixedSelectionsList: ", FixedSelections)
    }, [FixedSelections]);
    useEffect(() => {
      console.log("RemovingSelectionsList: ", RemovingSelections)
    }, [RemovingSelections]);
    
    // Clearing the Arrays so that on reselection, the index doesn't get double assigned
    useEffect(() => {
      if (rescheduleStatus == 'off') {
        setServerResponseMessage(false)
        setResButtonTitle('Smart Compress');
        setPriorSelections([])
        setFixedSelections([])
        setRemovingSelections([])
        setApiData({} as ApiDataType)
      }

      // const DisplayingSubjects = data['StartAngle']
      // .map((StartAngle: number, index: number) => ({
      //   StartAngle, 
      //   TaskDate: data['TaskDate'][index],
      //   index // Store the original index
      // }))
      // .filter(({TaskDate}) => {
      //   return TaskDate == currentDateStringFormat
      // })
      // .map(({TaskDate, index, StartAngle}, newIndex) => ({  // newIndex is made to index 0, 1 instead of 52, 53 etc.
      //   TaskDate, index, StartAngle, newIndex
      // }))
      // .filter(({index, StartAngle, newIndex}) => {
      // if (rescheduleStatus == 'PriorStage') {
      //   return StartAngle <= hourRotation 
      // }
      // else if (rescheduleStatus == 'FixingStage') {
      //   if (RemovingSelections.includes(newIndex)) {    // Prevent Fixed and Removing list getting common
      //     return StartAngle > hourRotation 
      //   }
      // }
      // else if (rescheduleStatus == 'RemovingStage') {
      //   // if (!FixedSelections.includes(newIndex)) {       // Removed this condition here because I want all angles 
      //                                                       // after current angle
      //     return StartAngle > hourRotation 
      //   // }
      // }});

      // if (DisplayingSubjects.length === 0 && rescheduleStatus === 'RemovingStage') {
      //   Alert.alert("No Work Ahead", `Without any Work Ahead, Schedule cannot be made`, [
      //     {
      //       text: "OK",
      //       onPress: () => {
      //         setRescheduleStatus('RemovingStage')
      //       },
      //       style: "default" // can also be "cancel" or "destructive"
      //     }
      //   ],
      //   { cancelable: true }
      // )}
      // else if (PriorSelections.length == 0 && FixedSelections.length == 0 && RemovingSelections.length == 0 && rescheduleStatus === 'RemovingStage') {
      //   Alert.alert("No Work Selected", `Select out some work to get rescheduled`)
      // }

    }, [rescheduleStatus])

    useEffect(() => {
      LabelChanging();
    }, [ScheduleArray, rescheduleStatus, FiveSecGap])

    // useEffect(() => {
    //   console.log("Today's ScheduleArray: ", TodayScheduleArray)
    // }, [ScheduleArray])

    // useEffect(() => {
    //   console.log("API_DATA: ", JSON.stringify(ApiData))
    // }, [ApiData])

    useEffect(() => {
      console.log("Is Connected in Schedule.tsx: ", isConnected)
      if (isConnected == false) {
        if (Platform.OS == 'android') {
          Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'No Internet',
          textBody: "Please turn on mobile data or Wi-Fi. Don't Worry, we don't show ADs 😌",
          closeOnOverlayTap: false
        })
        }
        else if (Platform.OS == 'ios') {
          function Disconnected() {
            console.log("isConnected: ", isConnected)
            Alert.alert("No Internet", `Please turn on mobile data or Wi-Fi and open the app again 🤧`,
              [
                {
                  text: "OK",
                  onPress: () => Disconnected()
                }
              ],
            )
          }
          Disconnected();
        }
      }
      else {
        Dialog.hide();
      }
    }, [isConnected])

    useEffect(() => {
      checkAppVersion();
    }, [])

    // useEffect(() => {
    //   console.log("DemoNumberHere: ", DemoNumberHere)
    // }, [DemoNumberHere])
    
    
    // Drawer and tab navigators are sibling-level navigators in your app architecture. When you switch from one drawer screen to another, you’re not actually unmounting and remounting the tab screen component — you’re just switching the visible screen. That's when you need to use the useFocusEffect to get the things done which are performed by useEffect.
    
    useFocusEffect(
      useCallback(() => {
        if (Platform.OS === 'android') {
          console.log("Focused on Schedule Screen")
          StatusBar.setBackgroundColor('transparent')
          StatusBar.setTranslucent(true);
        }
        return () => {
          // optional cleanup when screen is unfocused
        };
      }, [])
    );

    return (
      <>
      <View style={styles.safeView}>
      {/* <GestureHandlerRootView>
      <PanGestureHandler> */}
      <StatusBar
        translucent={true}
        backgroundColor="transparent" // Make the status bar transparent
        barStyle="dark-content"
      />
      {/* #BD54EE, 6c099b */}
        <View style={styles.mainStyle}>
          <LinearGradient
            // x = 0 is the left edge of the component.
            // x = 1 is the right edge of the component.
            // y = 0 is the top of the component.
            // y = 1 is the bottom of the component.
            colors={['#a032d3', '#D2CFE4']}
            style={{
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
              }}>
            <Navbar/>
          </LinearGradient>
          <View style={[styles.mainArea, tintstatus === true? styles.overlay : {}]}>
            <UpperArea
              currentDateStringFormat={currentDateStringFormat}
              selectedDate={selectedDate}
              rescheduleStatus={rescheduleStatus}
              currentHourTime={currentHourTime}
              currentMinTime={currentMinTime}
              currentDay={currentDay}
              currentMonth={currentMonth}
              TwelveHourFormat={TwelveHourFormat}
              Work={Work}
              timeStart={timeStart}
              timeEnd={timeEnd}
              duration={duration}
            />
  
            <View style={styles.ClockArea}>
              <Clock/>
              
              <View style={styles.arcAngle}>
                <SingleAngle/>
              </View>
            
            </View>

            <RescheduleButtonArea
             Loading={Loading}
             setLoading={setLoading}
             ResButtonTitle={ResButtonTitle}
             PriorSelections={PriorSelections}
             FixedSelections={FixedSelections}
             RemovingSelections={RemovingSelections}
             currentDateStringFormat={currentDateStringFormat}
             handleOutsidePress={handleOutsidePress}
             rescheduleStatus={rescheduleStatus} 
             DialogBackButton={DialogBackButton} 
             DialogTitle={DialogTitle} 
             data={data} 
             hourRotation={hourRotation} 
             checked={checked} 
             handleCheckboxChange={handleCheckboxChange} 
             RescheduleButtonClick={RescheduleButtonClick}
             selectedDate={selectedDate}
            />

            <BottomOptionsArea
              currentDateStringFormat={currentDateStringFormat}
              ApiData={ApiData}
              rescheduleStatus={rescheduleStatus}
              ScheduleTableButton={ScheduleTableButton}
              ScheduleTableSheet={ScheduleTableSheet}
              CalenderButton={CalenderButton}
              CalenderSheet={CalenderSheet}
              navigation={navigation}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {/* <Taskbar activeState='Schedule'/> */}
          </View>
        </View>
      {/* </PanGestureHandler>
      </GestureHandlerRootView> */}
      </View>
      </>
    );
}

  const styles = StyleSheet.create({
    safeView: {
      flex: 1,
      backgroundColor: 'transparent'
    },
  
    mainStyle: {
      flex: 1,
      backgroundColor: 'white'
    },
  
    mainArea: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#D2CFE4'
    },
  
    UpperArea: {
      flex: 0.7,
      // alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 5
    },
  
    angleInfo: {
      flexDirection: 'row',
      height: 100,
      width: 300,
      backgroundColor: '#0ff3e9',
      borderRadius: 15
    },
  
    angleInfoLeft: {
      backgroundColor: '#f3f30f', 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'flex-end', 
      borderTopLeftRadius: 15, 
      borderBottomLeftRadius: 15, 
      borderColor: '#a7890e',
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderBottomWidth: 3,
    },
  
    angleInfoRight: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      borderColor: '#0a74a2', 
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderBottomWidth: 3, 
      borderTopRightRadius: 15, 
      borderBottomRightRadius: 15,
    },
  
    angleInfoLeftText: {
      fontWeight: 'bold',
      color: '#a7890e',
      fontSize: 15
    },
  
    angleInfoRightText: {
      fontWeight: 'bold',
      color: '#0a74a2',
      fontSize: 15
    },
  
    angleInfoColor: {
      height: 14, 
      width: 14, 
      borderRadius: 15, 
      marginLeft: 10, 
      marginTop: 5                      
    },
    
    ClockArea: {
      flex: 1.7,
      width: 350,
      height: 350,
      // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundColor: '#D2CFE4',
      
      borderRadius: 30,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'relative',
      // borderWidth: 5,
      // borderColor: '#0a74a2',

    },

    Clock: {
      height: 350, 
      width: 350, 
      position: 'absolute', 
      justifyContent: 'center', 
      alignItems: 'center',
      pointerEvents: 'none',
      zIndex: 1
    },
  
    hour: {
      position: 'absolute',
      backgroundColor: '#000000',
      width: 10,
      height: 80,
      borderRadius: 10,
      left: '49%',
      top: 97,
      // top: 0,
      transformOrigin: 'bottom',
    },
  
    minute: {
      position: 'absolute',
      backgroundColor: '#000000',
      width: 5,
      height: 135,
      borderRadius: 10,
      left: '49%',
      top: 41,
      // top: 0,
      transformOrigin: 'bottom'
    },
    
    second: {
      position: 'absolute',
      backgroundColor: '#000000',
      width: 5,
      height: 100,
      borderRadius: 10,
      left: '49%',
      top: 76,
      opacity: 0.5,
      transformOrigin: 'bottom'
    },
  
    compressorOne: {
      position: 'absolute',
      backgroundColor: '#E4EF03',
      width: 2,
      height: 150,
      borderRadius: 10,
      left: '49.7%',
      top: 20,
      // top: 0,
      transformOrigin: 'bottom',
      // justifyContent: 'center',
      alignItems: 'center'
     },
  
    holderOne: {
      height: 20,
      width: 20,
      top: -13,
      // right: 9
     },
  
    arcAngle: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      zIndex: 0
    },

    selectionDialogBox: {
      flexDirection: 'column',
      height: 320,
      width: 320,
      borderRadius: 20,
      overflow: 'hidden'
      // backgroundColor: 'black',       // Disabled because of iOS
      // opacity: 0.85,                  // Disabled because of iOS
    },

    blurStyle: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },

    LowerArea: {
      flex: 0.3,
      // backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },

    RescheduleButton: {
      backgroundColor: '#B020F4',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 60,
      paddingRight: 60,
      borderRadius: 12,
      // marginTop: 5,
      borderRightWidth: 3,
      borderLeftWidth: 3,
      borderBottomWidth: 3,
      borderColor: '#841AB6',
    },

    AddIcon: {
      width: 28,
      height: 28
    },

    overlay: {
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // right: 0,
      // bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      // zIndex: 1000, // Ensure the overlay is on top
    }
  });

export default Schedule