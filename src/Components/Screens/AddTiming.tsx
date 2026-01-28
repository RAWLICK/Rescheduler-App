import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Switch,
  StatusBar,
  Platform,
  Button,
  Keyboard,
  Alert,
  Dimensions
} from 'react-native';
import React from 'react';
import {useState, useEffect, useRef, memo, useCallback} from 'react';
import ChevronRight from '../Images/ChevronRight.png';
import ChevronLeft from '../Images/ChevronLeft.png';
import RightArrow from '../Images/RightArrow.png';
import LockImage from '../Images/Lock.png'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Sound from "react-native-sound";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  clamp,
  runOnJS,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import ExistingSubjects from './ExistingSubjects';
import PreviousSchedule from './PreviousSchedule';
import SwipeRight from '../Images/swipe-right.png'
import { useDispatch, useSelector } from 'react-redux' 
import { addScheduleObject, removeScheduleObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
// import { nanoid } from 'nanoid';
import { nanoid } from "@reduxjs/toolkit";
import { updateStreakInfo } from '../../app/Slice';
import useInternetCheck from '../Authentication/InternetCheck';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import LinearGradient from 'react-native-linear-gradient';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type PanGesture = ReturnType<typeof Gesture.Pan>;

// Nested Components (Composition)

type TextInputCompProps = {
  onSave: (value: string) => void;
};

type HeaderPanelProps = {
  IsSaved: boolean;
  SaveButton: () => void;
  navigation: CombinedNavigationProp;
};

type AreaOneProps = {
  WorkToDo: string;
  setWorkToDo: SetState<string>;
  AddFromExistingWorkButton: boolean;
  setAddFromExistingWorkButton: SetState<boolean>;
  // AddFromExistingWorkToggleSwitch: () => void;
  navigation: CombinedNavigationProp;
  color: string;
}

type AreaTwoProps = {
  setTaskDate: SetState<string>;
  setStartTime: SetState<string>;
  setEndTime: SetState<string>;
  PrevScheduleStatus: boolean;
  setPrevScheduleStatus: SetState<boolean>;
  navigation: CombinedNavigationProp;
  ScheduleArray: ScheduleArrayItem[];
  Message: string;
  DateTimeState: string;
  setDateTimeState: SetState<string>;
  TaskDate: string;
  StartTime: string;
  EndTime: string;
  Duration: string;
  DurationBoxes: number[];
  DurationTag: string[];
  pan: PanGesture;
  animatedStyles: {
    transform: {
      translateX: number;
    }[];
  };
}

type AreaThreeProps = {
}

const TextInputComp = React.memo((props: TextInputCompProps) => {
  // console.log("TextInputComp is made run");
  // const [WorkToDo, setWorkToDo] = useState('');
  return (
    <TextInput
      style={styles.OptionText}
      // value={WorkToDo}
      onChangeText={props.onSave}
      // onBlur={() => {props.onSave(WorkToDo)}}
      placeholder="Subject Name"
      placeholderTextColor="#666666">
    </TextInput>
  );
});

const HeaderPanel = React.memo((props: HeaderPanelProps) => {
  // console.log("HeaderPanel is made run");
  return (
    <View style={styles.HeaderPanel}>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('DrawerScreens', {
            screen: 'TabsDrawer',
            params: {
              screen: 'ScheduleTab',
              params: undefined
            },
          })
        }
        style={styles.BackButtonBox}>
        <Image source={ChevronLeft} style={styles.BackButtonImage} />
      </TouchableOpacity>
      <View style={styles.SaveButtonArea}>
        <TouchableOpacity
          style={[styles.SaveButtonBox, {backgroundColor: props.IsSaved ? '#83ff91' : '#ACC6FF'}]}
          onPress={props.SaveButton}>
          <Text style={[styles.OptionText, {color: '#093471'}]}>{props.IsSaved ? "Saved" : "Save"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const AreaOne = React.memo((props: AreaOneProps) => {
  // console.log("AreaOne is made run");
  const AddFromExistingWorkToggleSwitch = () => props.setAddFromExistingWorkButton(previousState => !previousState)
  const ExistingSubjectSheet = useRef<TrueSheet>(null);

  async function ExistingSubjectButton () {
    await ExistingSubjectSheet.current?.present();
  }

  const handleTextChange = useCallback((text: string) => {
    props.setWorkToDo(text);
  }, []);

  return (
    <>
    <View style={[styles.areaOne]}>
      <View style={styles.UpperOption}>
        {!props.AddFromExistingWorkButton ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center'
          }}>
            <TextInputComp onSave={handleTextChange}/>
        </View>
        ) : (
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
            onPress={ExistingSubjectButton}
            >
              <Text style={styles.OptionText}>{props.WorkToDo == "" ? "Choose Subject" : props.WorkToDo}</Text>
          </TouchableOpacity>
        )}
        
        {props.AddFromExistingWorkButton && 
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}} onPress={ExistingSubjectButton}>
              <Image source={ChevronRight} style={{height: 17, width: 17}} />
          </TouchableOpacity>
        }
      </View>

      <View style={styles.BottomOption}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={styles.OptionText}>Add from Subjects in Stats</Text>
        </View>
        <TouchableOpacity style={styles.AllDayToggleButtonBox}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={props.AddFromExistingWorkButton ? '#f5dd4b' : '#f4f3f4'}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={AddFromExistingWorkToggleSwitch}
            value={props.AddFromExistingWorkButton}
          />
        </TouchableOpacity>
      </View>
    </View>
    <TrueSheet
      ref={ExistingSubjectSheet}
      detents={['auto']}
      style={{width: Dimensions.get('window').width}}
      cornerRadius={24}
      >
        <ExistingSubjects 
        WorkToDo={props.WorkToDo}
        setWorkToDo={props.setWorkToDo}
        ExistingSubjectSheet={ExistingSubjectSheet}
        />
      </TrueSheet>
    </>
  );
});

const AreaTwo = React.memo((props: AreaTwoProps) => {
  // console.log("AreaTwo is made run");
  const hideDatePicker = () => {
    // console.log("hideDatePicker is made run");
    props.setDateTimeState('off');
  };

  const handleConfirm = (date: Date) => {
    // console.log("handleConfirm is made run");
    // .padStart is added to provide a leading 0 to a singular number
    console.log("Printing Date Parameter from handleConfirm: ", date)
    if (props.DateTimeState == 'date') {
      props.setTaskDate(
        `${
          date.getDate().toString().padStart(2, '0') +
          '/' +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          '/' +
          date.getFullYear()
        }`,
      );
    } else if (props.DateTimeState == 'month') {
      props.setTaskDate(
        `${
          date.getDate().toString().padStart(2, '0') +
          '/' +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          '/' +
          date.getFullYear()
        }`,
      );
    } else if (props.DateTimeState == 'StartTiming') {
      // console.log("handleConfirm Button is clicked for Start Timing")
      props.setStartTime(
        `${
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
        }`,
      );
    } else if (props.DateTimeState == 'EndTiming') {
      props.setEndTime(
        `${
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
        }`,
      );
    }
    hideDatePicker();
  };

  const WordMonth = (date: string) => {
    // console.log("WordMonth is made run");
    let MonthExtract = Number(date.slice(3, 5)) - 1;
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

  const TwelveHourFormat = (time: string) => {
    // console.log("TwelveHourFormat is made run");
    let NumberHour = Number(time.split(':', 1));
    let MinuteHour = Number(time.slice(3, 5));
    if (NumberHour > 12) {
      return `${NumberHour - 12}:${time.slice(3, 5)} PM`;
    } else if (NumberHour == 12 && MinuteHour >= 0) {
      return `${time} PM`;
    } else if (time.length > 5) {
      return time;
    } else {
      return `${time} AM`;
    }
  };

  return (
    <View style={styles.areaTwo}>
      <TouchableOpacity style={styles.UpperOption} onPress={() => props.setPrevScheduleStatus(true)}>
        <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={styles.OptionText}>Previous Schedule</Text>
          <PreviousSchedule
            PrevScheduleStatus={props.PrevScheduleStatus}
            setPrevScheduleStatus={props.setPrevScheduleStatus}
            navigation={props.navigation}
            ScheduleArray={props.ScheduleArray}
            Message={props.Message}
          />
        </View>
        <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-end'}}>
          <Image source={SwipeRight} style={{height: 35, width: 35}}/>
        </View>
      </TouchableOpacity>
      <View style={styles.MiddleOption}>
        <View style={styles.DateHeadingBox}>
          <Text style={styles.OptionText}>Date</Text>
        </View>
        <View style={styles.DateAndMonthNumberArea}>
          <TouchableOpacity
            style={styles.DateNumberBox}
            onPress={() => props.setDateTimeState('date')}>
            <Text style={styles.DateText}>{props.TaskDate.split('/', 1)}</Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'date' ? true : false}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.MonthBox}
            onPress={() => props.setDateTimeState('month')}>
            <Text style={styles.MonthText}>
              {WordMonth(props.TaskDate)}
            </Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'month' ? true : false}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.MiddleOption}>
        <View style={styles.TimingHeadingBox}>
          <Text style={styles.OptionText}>Timing</Text>
        </View>
        <View style={styles.TimingArea}>
          <TouchableOpacity
            style={styles.TimingStartBox}
            onPress={() => props.setDateTimeState('StartTiming')}>
            <Text style={styles.TimingStartText}>
              {TwelveHourFormat(props.StartTime)}
            </Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'StartTiming' ? true : false}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
          <View>
            <Image source={RightArrow} style={styles.ArrowImage} />
          </View>
          <TouchableOpacity
            style={styles.TimingEndBox}
            onPress={() => props.setDateTimeState('EndTiming')}>
            <Text style={styles.TimingEndText}>
              {TwelveHourFormat(props.EndTime)}
            </Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'EndTiming' ? true : false}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.BottomOption,
          {flex: 2, flexDirection: 'column', justifyContent: 'center'},
        ]}>
        <View style={[styles.DurationTagLineBox, props.PrevScheduleStatus == true ? {backgroundColor: 'black'}: {backgroundColor: '#9D9EA0'}]}>
          <Text
            style={[
              styles.OptionText,
              {fontFamily: Platform.OS === 'ios' ? 'FuturaNo2D-DemiBold' : 'futura-no2-d-demibold', color: '#000000'},
            ]}>
            Duration ({props.Duration})
          </Text>
        </View>
        <View style={styles.DurationPiecesTotalBox}>
          {props.DurationBoxes.map((index, i) => {
            return (
              <View
                key={i}
                style={[
                  styles.DurationPerPiece,
                  i == 0
                    ? {borderTopLeftRadius: 4, borderBottomLeftRadius: 4}
                    : {},
                  i == 15
                    ? {borderTopRightRadius: 4, borderBottomRightRadius: 4}
                    : {},
                ]}></View>
            );
          })}
        </View>
        <GestureDetector gesture={props.pan}>
          <Animated.View
            style={[styles.DurationMeterCircularHandle, props.animatedStyles]}
          />
        </GestureDetector>

        <View style={styles.DurationLabelBox}>
          {props.DurationTag.map((tag, i) => {
            return (
              <Text
                key={i}
                style={[
                  styles.DurationLabels,
                  tag != '0h' ? {marginRight: 62} : {},
                ]}>
                {tag}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
});

const AreaThree = React.memo((props: AreaThreeProps) => {
  // console.log("AreaThree is made run");
  return (
    <View style={styles.areaThree}>
      <View style={{marginTop: 10}}>
        <View style={{marginBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#9D9EA0',
          fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee'}}>
          New Inputs will be soon unlocked with Streak
          </Text>
        </View>
        <LinearGradient colors={['#222328', '#1B1B1D']} style={{borderRadius: 10}}>
          <View style={{height: 100, borderRadius: 10, borderColor: '#6B1294', borderTopWidth: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={LockImage} style={{height: 15, width: 15}}/>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
});
 
export interface ScheduleArrayItem {
  uniqueID: string;
  StartTime: string;
  EndTime: string;
  Work: string;
  StartAngle: number;
  EndAngle: number;
  TaskDate: string;
  Slice_Color: string;
}

import {CombinedNavigationProp} from '../../App';
import { random } from 'nanoid';

const AddTiming = () => {
  const isConnected = useInternetCheck();
  const [AddFromExistingWorkButton, setAddFromExistingWorkButton] = useState(false)
  // const AddFromExistingWorkToggleSwitch = () => setAddFromExistingWorkButton(previousState => !previousState)
  const Message = 'Keep Faith';
  const navigation = useNavigation<CombinedNavigationProp>();
  const DurationBoxes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const DurationTag = ['0h', '1h', '2h', '3h', '4h'];
  const [NoteText, setNoteText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [WorkToDo, setWorkToDo] = useState('');
  const [DateTimeState, setDateTimeState] = useState('off');
  const [StartTime, setStartTime] = useState('');
  const [EndTime, setEndTime] = useState('');
  const [TaskDate, setTaskDate] = useState('');
  const [Duration, setDuration] = useState('1h');
  const [StartAngle, setStartAngle] = useState<number>();
  const [EndAngle, setEndAngle] = useState<number>();
  const [colorIndex, setColorIndex] = useState(0);
  const [PrevScheduleStatus, setPrevScheduleStatus] = useState(false)
  const [IsSaved, setIsSaved] = useState(false)
  const dispatch = useDispatch();
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
    "rgba(191, 115, 181, 0.5)",
    "rgba(233, 87, 63, 0.5)",
    "rgba(91, 62, 173, 0.5)",
    "rgba(123, 201, 82, 0.5)",
    "rgba(255, 182, 77, 0.5)",
    "rgba(59, 141, 214, 0.5)",
    "rgba(212, 79, 174, 0.5)",
    "rgba(73, 207, 187, 0.5)",
    "rgba(244, 94, 13, 0.5)",
    "rgba(92, 178, 240, 0.5)",
    "rgba(161, 107, 224, 0.5)",
    "rgba(245, 221, 76, 0.5)",
    "rgba(66, 232, 161, 0.5)",
    "rgba(184, 77, 105, 0.5)",
    "rgba(237, 148, 212, 0.5)",
    "rgba(33, 107, 176, 0.5)",
    "rgba(112, 214, 94, 0.5)",
    "rgba(230, 114, 44, 0.5)",
    "rgba(56, 90, 141, 0.5)",
    "rgba(147, 189, 63, 0.5)",
    "rgba(214, 73, 63, 0.5)",
    "rgba(78, 207, 119, 0.5)",
    "rgba(179, 96, 240, 0.5)",
    "rgba(250, 141, 61, 0.5)",
    "rgba(74, 163, 232, 0.5)",
    "rgba(212, 217, 99, 0.5)",
    "rgba(95, 54, 156, 0.5)",
    "rgba(247, 80, 131, 0.5)",
    "rgba(129, 212, 178, 0.5)",
    "rgba(241, 174, 70, 0.5)",
    "rgba(67, 133, 101, 0.5)"
  ]
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)

  let currentDate = new Date();
  let currentHours = currentDate.getHours().toString().padStart(2, '0');
  let currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
  let currentTime = `${currentHours}:${currentMinutes}`;
  let currentNumDate = currentDate.getDate().toString().padStart(2, '0');
  let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let currentYear = currentDate.getFullYear();
  let currentDateandMonth = `${currentNumDate}/${currentMonth}/${currentYear}`;
  const durationRanges = [
    {max: 17.52, duration: '15 min', boxNum: 0},
    {max: 37.21, duration: '30 min', boxNum: 1},
    {max: 56.26, duration: '45 min', boxNum: 2},
    {max: 75.35, duration: '1h', boxNum: 3},
    {max: 94.29, duration: '1h 15 min', boxNum: 4},
    {max: 113.31, duration: '1h 30 min', boxNum: 5},
    {max: 132.5, duration: '1h 45 min', boxNum: 6},
    {max: 151.58, duration: '2h', boxNum: 7},
    {max: 170.27, duration: '2h 15 min', boxNum: 8},
    {max: 189.25, duration: '2h 30 min', boxNum: 9},
    {max: 208.35, duration: '2h 45 min', boxNum: 10},
    {max: 227.34, duration: '3h', boxNum: 11},
    {max: 246.33, duration: '3h 15 min', boxNum: 12},
    {max: 265.32, duration: '3h 30 min', boxNum: 13},
    {max: 284.31, duration: '3h 45 min', boxNum: 14},
    {max: 310, duration: '4h', boxNum: 15},
  ];

  const StartRadar = useSharedValue<number>(0);
  const MovedRadar = useSharedValue<number>(0);
  const FinalRadar = useSharedValue<number>(75.35);
  const [CoveredDurBoxes, setCoveredDurBoxes] = useState<number[]>([
    0, 1, 2, 3,
  ]);
  // var Sound = require('react-native-sound');
  Sound.setCategory('Playback');

  console.log("AddTiming is made run")

  function elaborateDuration(duration: string) {
    // console.log("elaborateDuration is made run");
    if (duration.includes('min') && !duration.includes('h')) {
        const addingHour = 0
        const addingMinute = Number(duration.split(' ')[0])
        return [addingHour, addingMinute]
    }
    else if (duration.includes('h') && !duration.includes('min')) {
        const addingHour = Number(duration.split('h')[0])
        const addingMinute = 0
        return [addingHour, addingMinute]
    }
    else {
        const addingHour = Number(duration.split('h')[0])
        const addingMinute = Number(duration.slice(3, 5))
        return [addingHour, addingMinute]
    }
  }

  const degreeConverter = (StartTime: string, EndTime: string) => {
    // console.log("degreeConverter is made run");
    let StartTimeHour = Number(StartTime.split(':')[0]);
    let StartTimeMinute = Number(StartTime.split(':')[1]);
    let EndTimeHour = Number(EndTime.split(':')[0]);
    let EndTimeMinute = Number(EndTime.split(':')[1]);
    let StartDegree = StartTimeHour * 30 + StartTimeMinute * 0.5;
    let EndDegree = EndTimeHour * 30 + EndTimeMinute * 0.5;
    setStartAngle(StartDegree);
    setEndAngle(EndDegree);
  };

  function AdjustedEndTime (StartTime: string) {
    // console.log("AdjustedEndTime is made run");
    const StartHour = Number(StartTime.split(":")[0])
    const StartMin = Number(StartTime.split(":")[1])
    const [addHour, addMinute] = elaborateDuration(Duration);
    let EndHour = StartHour + addHour
    let EndMin = StartMin + addMinute
    if (EndMin >= 60) {
        EndHour += 1;
        EndMin -= 60;
    }
    if (EndHour >= 24) {
      EndHour -= 24
    }
    return `${EndHour.toString().padStart(2, '0')}:${EndMin.toString().padStart(2, '0')}`
  }

  const pan = Gesture.Pan()
    .onBegin(() => {
      StartRadar.value = FinalRadar.value;
    })
    .onChange(event => {
      MovedRadar.value = event.translationX;
      FinalRadar.value = StartRadar.value + MovedRadar.value;
      // runOnJS helps in running code on JavaScript thread instead on UI Thread

      const foundRange = durationRanges.find(
        range => FinalRadar.value <= range.max,
      );

      if (foundRange) {
        runOnJS(setDuration)(foundRange.duration);

        // runOnJS(setCoveredDurBoxes)((prevSelections) => {
        //   // Check if the foundRange.boxNum is already in the previous selections
        //   if (!prevSelections.includes(foundRange.boxNum)) {
        //     const newSelections = [...prevSelections, foundRange.boxNum];
        //     console.log("New Selections: ", newSelections)
        //     return newSelections;
        //   }
        //   return prevSelections;
        // })

        // if (!CoveredDurBoxes.includes(foundRange.boxNum)) {
        // runOnJS(setCoveredDurBoxes)((prevSelections) => {
        //   const newSelections = [...prevSelections, foundRange.boxNum]
        //   console.log("New Selections: ", newSelections)
        //   return newSelections;
        // })
        // }
        // playSound();
      }
    })
    .onFinalize(() => {
      // console.log("Pressed onFinalize")
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: clamp(FinalRadar.value, 10, 310)}],
  }));

  function randomColorIndex() {
    // console.log("randomColorIndex is made run");
    const randomIndex = Math.floor(Math.random() * color.length);
    return randomIndex;
  }

  const SaveButton = useCallback (async () => {
    // console.log("SaveButton is made run");
    let newTask = {
      uniqueID: nanoid(10),
      StartTime: StartTime,
      EndTime: EndTime,
      Work: WorkToDo,
      StartAngle: StartAngle ?? 0,
      EndAngle: EndAngle ?? 0,
      TaskDate: TaskDate,
      Slice_Color: color[randomColorIndex()]
    };

    console.log("New Task: ", newTask)

    function MatchingWorks() {
      const foundWorks = ScheduleArray.filter((item) => item.TaskDate == currentDateandMonth)
      for (let index = 0; index < foundWorks.length; index++) {
        const element = foundWorks[index];
        if (element["Work"].toLowerCase() == WorkToDo.toLowerCase()) {
          return true
        }
      }
    }

    function MatchingTimings() {
      const foundWorks = ScheduleArray.filter((item) => item.TaskDate == currentDateandMonth)
      for (let index = 0; index < foundWorks.length; index++) {
        const element = foundWorks[index];
        if (StartAngle && EndAngle) {
          if
           (
            StartAngle > Number(element["StartAngle"]) && StartAngle < Number(element["EndAngle"])
            || EndAngle < Number(element["EndAngle"]) && EndAngle > Number(element["StartAngle"])
            || EndAngle == Number(element["EndAngle"]) && StartAngle == Number(element["StartAngle"])
            || StartAngle == Number(element["StartAngle"]) 
            || EndAngle == Number(element["EndAngle"])
           )
            {
            console.log("StartAngle: ", StartAngle)
            console.log("element StartAngle: ", Number(element["StartAngle"]))
            console.log("EndAngle: ", EndAngle)
            console.log("element EndAngle: ", Number(element["EndAngle"]))
          return true
          }
        }
      }
    }

    MatchingTimings();

    if (StartTime.split(":")[0] > EndTime.split(":")[0]) {
      Alert.alert("Invalid TimeZone", "Your Start Time is ahead of End Time")
    }
    else if (MatchingWorks() == true) {
      Alert.alert("Duplicate Work", `You have a ${WorkToDo} Work already present in today's Schedule`)
    }
    else if (MatchingTimings() == true) {
      Alert.alert("Timings Collided", `This time period is colliding with another time period in today's Schedule`)
    }
    else if (WorkToDo == "") {
      Alert.alert("Empty Subject", `Please enter Subject name`)
    }
    else {
      if (Platform.OS == 'android') {
        var whoosh = new Sound('savebutton_click.mp3', Sound.MAIN_BUNDLE, (error: Error | null) => {
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
      }
      dispatch(addScheduleObject(newTask));
      setIsSaved(true)
      setTimeout(() => {
        setWorkToDo('');
        setIsSaved(false)
      }, 1500)
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
            {"uniqueID": StudentInfoData["uniqueID"],
             "Process": "Add",
             "SubjectInfoObject": newTask
            }
          ), // Convert the request payload to JSON.
        })
  
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data from the server');
        }
      } catch (error) {
        console.error('Catch Error: ', error);
      }
    };
  }, [WorkToDo]);

  useEffect(() => {
    setStartTime(currentTime);
    setTaskDate(currentDateandMonth);
  }, []);

  useEffect(() => {
    setEndTime(AdjustedEndTime(StartTime));
  }, [StartTime, Duration])
  
  useEffect(() => {
    degreeConverter(StartTime, EndTime);
  }, [StartTime, EndTime]);
  
  useEffect(() => {
      console.log("Is Connected from Settings: ", isConnected)
      if (isConnected == false) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'No Internet',
          textBody: "Please turn on mobile data or Wi-Fi. Don't Worry, we don't show ADs 😌",
          closeOnOverlayTap: false
        })
      }
      else {
        Dialog.hide();
      }
  }, [isConnected])

  useEffect(() => {
    console.log("Start Time: ", StartTime)
  }, [])
  
  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar
        animated={true}
        backgroundColor="#1B1B1D"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />
      <GestureHandlerRootView>
        <View style={styles.mainStyle}>
          <HeaderPanel
            IsSaved={IsSaved}
            navigation={navigation}
            SaveButton={SaveButton}
          />

          <ScrollView>
            <AreaOne
              AddFromExistingWorkButton={AddFromExistingWorkButton}
              setAddFromExistingWorkButton={setAddFromExistingWorkButton}
              // AddFromExistingWorkToggleSwitch={AddFromExistingWorkToggleSwitch}
              navigation={navigation}
              WorkToDo={WorkToDo}
              setWorkToDo={setWorkToDo}
              color={color[0]}
            />

            <AreaTwo
              setTaskDate={setTaskDate}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              PrevScheduleStatus={PrevScheduleStatus}
              setPrevScheduleStatus={setPrevScheduleStatus}
              navigation={navigation}
              ScheduleArray={ScheduleArray}
              Message={Message}
              DateTimeState={DateTimeState}
              setDateTimeState={setDateTimeState}
              TaskDate={TaskDate}
              StartTime={StartTime}
              EndTime={EndTime}
              Duration={Duration}
              DurationBoxes={DurationBoxes}
              DurationTag={DurationTag}
              pan={pan}
              animatedStyles={animatedStyles}
            />

            <AreaThree/>
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AllDayToggleButtonBox: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  AllDayFeatureBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  DurationLabels: {
    marginRight: 44,
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    color: '#9D9EA0',
  },
  DurationLabelBox: {flexDirection: 'row', marginTop: 7},
  DurationMeterCircularHandle: {
    backgroundColor: 'white',
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 76,
  },
  DurationPerPiece: {
    backgroundColor: '#9D9EA0',
    height: 10,
    width: '5.7%',
  },
  DurationPiecesTotalBox: {
    flexDirection: 'row',
    columnGap: 2,
  },
  DurationTagLineBox: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9D9EA0',
    marginBottom: 20,
    borderRadius: 10,
  },
  TimingEndText: {
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2D-DemiBold' : 'futura-no2-d-demibold',
    fontSize: 16,
    color: '#9D9EA0',
  },
  TimingEndBox: {
    height: 40,
    width: 85,
    backgroundColor: '#43464D',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  ArrowImage: {height: 17, width: 17},
  TimingStartText: {
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2D-DemiBold' : 'futura-no2-d-demibold',
    fontSize: 16,
    color: '#9D9EA0',
  },
  TimingStartBox: {
    height: 40,
    width: 85,
    backgroundColor: '#43464D',
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  TimingArea: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  TimingHeadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  MonthText: {
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    fontSize: 17,
    color: '#9D9EA0',
  },
  MonthBox: {
    height: 40,
    width: 100,
    backgroundColor: '#43464D',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  DateText: {
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    fontSize: 17,
    color: '#9D9EA0',
  },
  DateNumberBox: {
    height: 40,
    width: 50,
    backgroundColor: '#43464D',
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  DateAndMonthNumberArea: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  DateHeadingBox: {flex: 1, justifyContent: 'center', alignItems: 'flex-start'},
  SaveButtonBox: {
    backgroundColor: '#ACC6FF',
    borderRadius: 20,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  SaveButtonArea: {flex: 1, justifyContent: 'center', alignItems: 'flex-end'},
  BackButtonImage: {height: 20, width: 20},
  BackButtonBox: {flex: 1, justifyContent: 'center', alignItems: 'flex-start'},
  safeView: {
    flex: 1,
    backgroundColor: '#1B1B1D',
  },

  mainStyle: {
    flex: 1,
    backgroundColor: '#1B1B1D',
    paddingTop: StatusBar.currentHeight,
  },

  HeaderPanel: {
    height: 60,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  UpperOption: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    paddingLeft: 20,
    paddingRight: 20,
    //
  },

  MiddleOption: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },

  BottomOption: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },

  OnlyOption: {
    // flex: 1,
    // flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    fontSize: 16,
  },

  areaOne: {
    height: 150,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },

  areaTwo: {
    height: 385,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },

  areaThree: {
    height: 150,
    padding: 10,
    paddingBottom: 15
  },

  angleInfoColor: {
    height: 16,
    width: 16,
    borderRadius: 15,
    marginLeft: 10,
    marginTop: 5,
  },

  OptionText: {
    fontSize: 18,
    color: '#9D9EA0',
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
  },
});

export default AddTiming;
