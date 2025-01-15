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
} from 'react-native';
import React from 'react';
import {useState, useEffect, useRef} from 'react';
import ChevronRight from '../Images/ChevronRight.png';
import ChevronLeft from '../Images/ChevronLeft.png';
import RightArrow from '../Images/RightArrow.png';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
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
import { useDispatch, useSelector } from 'react-redux' 
import { addScheduleObject, removeScheduleObject } from '../../app/Slice';
import { RootState } from '../../app/Store';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type PanGesture = ReturnType<typeof Gesture.Pan>;

// Nested Components (Composition)
type GroupPropsType = {
  AddFromExistingWorkButton: boolean;
  setAddFromExistingWorkButton: SetState<boolean>;
  AddFromExistingWorkToggleSwitch: () => void;
  navigation: CombinedNavigationProp;
  ScheduleArray: ScheduleArrayItem[];
  Message: string;
  SaveButton: () => void;
  WorkToDo: string;
  setWorkToDo: SetState<string>;
  color: string;
  DateTimeState: string;
  setDateTimeState: SetState<string>;
  TaskDate: string;
  handleConfirm: (date: Date) => void;
  hideDatePicker: () => void;
  WordMonth: (date: string) => string;
  TwelveHourFormat: (time: string) => string;
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
  isEnabled: boolean;
  toggleSwitch: () => void;
  NoteText: string;
  setNoteText: SetState<string>;
};

const HeaderPanel = (props: GroupPropsType) => {
  return (
    <View style={styles.HeaderPanel}>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('DrawerScreens', {
            screen: 'TabsDrawer',
            params: {
              screen: 'ScheduleTab',
              params: {
                ScheduleArray: props.ScheduleArray,
                Message: props.Message,
              }
            },
          })
        }
        style={styles.BackButtonBox}>
        <Image source={ChevronLeft} style={styles.BackButtonImage} />
      </TouchableOpacity>
      <View style={styles.SaveButtonArea}>
        <TouchableOpacity
          style={styles.SaveButtonBox}
          onPress={props.SaveButton}>
          <Text style={[styles.OptionText, {color: '#093471'}]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AreaOne = (props: GroupPropsType) => {
  const ExistingSubjectSheet = useRef<TrueSheet>(null);

  async function ExistingSubjectButton () {
    await ExistingSubjectSheet.current?.present();
  }
  return (
    <>
    <View style={[styles.areaOne, props.AddFromExistingWorkButton && {height: 150}]}>
      <TouchableOpacity style={styles.UpperOption} onPress={ExistingSubjectButton}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          {!props.AddFromExistingWorkButton ? (
            <TextInput
            style={styles.OptionText}
            value={props.WorkToDo}
            onChangeText={props.setWorkToDo}
            placeholder="Work"
            placeholderTextColor="#9D9EA0"></TextInput>
          ) : (
            <Text style={styles.OptionText}>Work</Text>
          )}
        </View>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          {props.AddFromExistingWorkButton && 
            <Image source={ChevronRight} style={{height: 17, width: 17}} />
          }
        </View>
      </TouchableOpacity>

      {!props.AddFromExistingWorkButton && 
      <TouchableOpacity style={styles.MiddleOption}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={styles.OptionText}>Color Assigned</Text>
        </View>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <View
            style={[
              styles.angleInfoColor,
              {backgroundColor: `${props.color}`},
            ]}></View>
        </View>
      </TouchableOpacity>
      }
      <View style={styles.BottomOption}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={styles.OptionText}>Add from Existing Work</Text>
        </View>
        <TouchableOpacity style={styles.AllDayToggleButtonBox}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={props.AddFromExistingWorkButton ? '#f5dd4b' : '#f4f3f4'}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={props.AddFromExistingWorkToggleSwitch}
            value={props.AddFromExistingWorkButton}
          />
        </TouchableOpacity>
      </View>
    </View>
    <TrueSheet
      ref={ExistingSubjectSheet}
      sizes={['auto', 'large']}
      cornerRadius={24}
      >
        <ExistingSubjects/>
      </TrueSheet>
    </>
  );
};

const AreaTwo = (props: GroupPropsType) => {
  return (
    <View style={styles.areaTwo}>
      <View style={styles.UpperOption}>
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
              onConfirm={props.handleConfirm}
              onCancel={props.hideDatePicker}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.MonthBox}
            onPress={() => props.setDateTimeState('month')}>
            <Text style={styles.MonthText}>
              {props.WordMonth(props.TaskDate)}
            </Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'month' ? true : false}
              mode="date"
              onConfirm={props.handleConfirm}
              onCancel={props.hideDatePicker}
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
              {props.TwelveHourFormat(props.StartTime)}
            </Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'StartTiming' ? true : false}
              mode="time"
              onConfirm={props.handleConfirm}
              onCancel={props.hideDatePicker}
            />
          </TouchableOpacity>
          <View>
            <Image source={RightArrow} style={styles.ArrowImage} />
          </View>
          <TouchableOpacity
            style={styles.TimingEndBox}
            onPress={() => props.setDateTimeState('EndTiming')}>
            <Text style={styles.TimingEndText}>
              {props.TwelveHourFormat(props.EndTime)}
            </Text>
            <DateTimePickerModal
              isVisible={props.DateTimeState == 'EndTiming' ? true : false}
              mode="time"
              onConfirm={props.handleConfirm}
              onCancel={props.hideDatePicker}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.MiddleOption,
          {flex: 2, flexDirection: 'column', justifyContent: 'center'},
        ]}>
        <View style={styles.DurationTagLineBox}>
          <Text
            style={[
              styles.OptionText,
              {fontFamily: Platform.OS === 'ios' ? 'FuturaNo2D-DemiBold' : 'futura-no2-d-demibold', color: '#000000'},
            ]}>
            Duration ({props.Duration})
          </Text>
        </View>
        {/* 9D9EA0 */}
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
                  /*CoveredDurBoxes.includes(i)? {backgroundColor: '#9D9EA0'} : {backgroundColor: '#595a5c'}*/
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

      <View style={styles.BottomOption}>
        <View style={styles.AllDayFeatureBox}>
          <Text style={styles.OptionText}>All Day</Text>
        </View>
        <View style={styles.AllDayToggleButtonBox}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={props.isEnabled ? '#f5dd4b' : '#f4f3f4'}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={props.toggleSwitch}
            value={props.isEnabled}
          />
        </View>
      </View>
    </View>
  );
};

const AreaThree = (props: GroupPropsType) => {
  return (
    <View style={styles.areaThree}>
      <TextInput
        multiline
        numberOfLines={6}
        style={styles.OnlyOption}
        value={props.NoteText}
        onChangeText={props.setNoteText}
        placeholder="Add a Note"
        placeholderTextColor="#9D9EA0"></TextInput>
    </View>
  );
};

export interface ScheduleArrayItem {
  StartTime: string;
  EndTime: string;
  Work: string;
  StartAngle: number;
  EndAngle: number;
  TaskDate: string;
  Slice_Color: string;
}
import {CombinedNavigationProp} from '../../App';

const AddTiming = () => {
  const [AddFromExistingWorkButton, setAddFromExistingWorkButton] = useState(false)
  const AddFromExistingWorkToggleSwitch = () => setAddFromExistingWorkButton(previousState => !previousState)
  const Message = 'Keep Faith';
  const navigation = useNavigation<CombinedNavigationProp>();
  const color = 'blue';
  const DurationBoxes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const DurationTag = ['0h', '1h', '2h', '3h', '4h'];
  const [NoteText, setNoteText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [DateTimeState, setDateTimeState] = useState('off');
  const [StartTime, setStartTime] = useState('');
  const [EndTime, setEndTime] = useState('');
  const [TaskDate, setTaskDate] = useState('');
  const [Duration, setDuration] = useState('1h');
  const [WorkToDo, setWorkToDo] = useState('');
  const [StartAngle, setStartAngle] = useState<number>();
  const [EndAngle, setEndAngle] = useState<number>();
  const dispatch = useDispatch();
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  // const [ScheduleArray, setScheduleArray] = useState<ScheduleArrayItem[]>([]);

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
  // console.log("CoveredDurBoxes" , CoveredDurBoxes)

  const hideDatePicker = () => {
    setDateTimeState('off');
  };

  const WordMonth = (date: string) => {
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

  const handleConfirm = (date: Date) => {
    // .padStart is added to provide a leading 0 to a singular number
    if (DateTimeState == 'date') {
      setTaskDate(
        `${
          date.getDate().toString().padStart(2, '0') +
          '/' +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          '/' +
          date.getFullYear()
        }`,
      );
    } else if (DateTimeState == 'month') {
      setTaskDate(
        `${
          date.getDate().toString().padStart(2, '0') +
          '/' +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          '/' +
          date.getFullYear()
        }`,
      );
    } else if (DateTimeState == 'StartTiming') {
      setStartTime(
        `${
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
        }`,
      );
    } else if (DateTimeState == 'EndTiming') {
      setEndTime(
        `${
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
        }`,
      );
    }
    hideDatePicker();
  };

  const TwelveHourFormat = (time: string) => {
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

  const degreeConverter = (StartTime: string, EndTime: string) => {
    let StartTimeHour = Number(StartTime.split(':')[0]);
    let StartTimeMinute = Number(StartTime.split(':')[1]);
    let EndTimeHour = Number(EndTime.split(':')[0]);
    let EndTimeMinute = Number(EndTime.split(':')[1]);
    let StartDegree = StartTimeHour * 30 + StartTimeMinute * 0.5;
    let EndDegree = EndTimeHour * 30 + EndTimeMinute * 0.5;
    setStartAngle(StartDegree);
    setEndAngle(EndDegree);
  };

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

  useEffect(() => {
    setStartTime(currentTime);
    setEndTime(currentTime);
    setTaskDate(currentDateandMonth);
  }, []);

  useEffect(() => {
    degreeConverter(StartTime, EndTime);
  }, [StartTime, EndTime]);

  const SaveButton = () => {
    let newTask = {
      StartTime: StartTime,
      EndTime: EndTime,
      Work: WorkToDo,
      StartAngle: StartAngle ?? 0,
      EndAngle: EndAngle ?? 0,
      TaskDate: TaskDate,
      Slice_Color: color
    };
    dispatch(addScheduleObject(newTask));
  };

  useEffect(() => {
    console.log('ScheduleArray (AddTiming.tsx): ', ScheduleArray);
  }, [ScheduleArray]);

  // const saveStateToStorage = async (ScheduleArray: ScheduleArrayItem[]) => {
  //   try {
  //     await AsyncStorage.setItem(
  //       'savedSchedule',
  //       JSON.stringify(ScheduleArray),
  //     );
  //   } catch (error) {
  //     console.log('Error saving data ', error);
  //   }
  // };

  // const loadStateFromStorage = async () => {
  //   try {
  //     const savedSchedule = await AsyncStorage.getItem('savedSchedule');
  //     console.log("savedSchedule: ", savedSchedule);
  //     if (savedSchedule !== null) {
  //       // const array = JSON.parse(savedSchedule);
  //       // console.log("Saved Schedule: ", savedSchedule)
  //       // for (let index = 0; index < array.length; index++) {
  //       //   const element = array[index];
  //       //   dispatch(addScheduleObject(element));
  //       // }
  //       dispatch(replaceScheduleArray(JSON.parse(savedSchedule)));
  //     }
  //   } catch (error) {
  //     console.log('Error Loading Data: ', error);
  //   }
  // };

  // useEffect(() => {
  //   return () => {
  //     saveStateToStorage(ScheduleArray); // Saving Data when component gets unmounted
  //   };
  // }, []);

  // useEffect(() => {
  //   loadStateFromStorage();
  // }, []);


  // module.exports = {ScheduleArray};

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
        {/* <PanGestureHandler> */}
        <View style={styles.mainStyle}>
          <HeaderPanel
            AddFromExistingWorkButton={AddFromExistingWorkButton}
            setAddFromExistingWorkButton={setAddFromExistingWorkButton}
            AddFromExistingWorkToggleSwitch={AddFromExistingWorkToggleSwitch}
            NoteText={NoteText}
            setNoteText={setNoteText}
            navigation={navigation}
            ScheduleArray={ScheduleArray}
            Message={Message}
            SaveButton={SaveButton}
            WorkToDo={WorkToDo}
            setWorkToDo={setWorkToDo}
            color={color}
            DateTimeState={DateTimeState}
            setDateTimeState={setDateTimeState}
            TaskDate={TaskDate}
            handleConfirm={handleConfirm}
            hideDatePicker={hideDatePicker}
            WordMonth={WordMonth}
            TwelveHourFormat={TwelveHourFormat}
            StartTime={StartTime}
            EndTime={EndTime}
            Duration={Duration}
            DurationBoxes={DurationBoxes}
            DurationTag={DurationTag}
            pan={pan}
            animatedStyles={animatedStyles}
            isEnabled={isEnabled}
            toggleSwitch={toggleSwitch}
          />

          <ScrollView>
            <AreaOne
              AddFromExistingWorkButton={AddFromExistingWorkButton}
              setAddFromExistingWorkButton={setAddFromExistingWorkButton}
              AddFromExistingWorkToggleSwitch={AddFromExistingWorkToggleSwitch}
              NoteText={NoteText}
              setNoteText={setNoteText}
              navigation={navigation}
              ScheduleArray={ScheduleArray}
              Message={Message}
              SaveButton={SaveButton}
              WorkToDo={WorkToDo}
              setWorkToDo={setWorkToDo}
              color={color}
              DateTimeState={DateTimeState}
              setDateTimeState={setDateTimeState}
              TaskDate={TaskDate}
              handleConfirm={handleConfirm}
              hideDatePicker={hideDatePicker}
              WordMonth={WordMonth}
              TwelveHourFormat={TwelveHourFormat}
              StartTime={StartTime}
              EndTime={EndTime}
              Duration={Duration}
              DurationBoxes={DurationBoxes}
              DurationTag={DurationTag}
              pan={pan}
              animatedStyles={animatedStyles}
              isEnabled={isEnabled}
              toggleSwitch={toggleSwitch}
            />

            <AreaTwo
              AddFromExistingWorkButton={AddFromExistingWorkButton}
              setAddFromExistingWorkButton={setAddFromExistingWorkButton}
              AddFromExistingWorkToggleSwitch={AddFromExistingWorkToggleSwitch}
              NoteText={NoteText}
              setNoteText={setNoteText}
              navigation={navigation}
              ScheduleArray={ScheduleArray}
              Message={Message}
              SaveButton={SaveButton}
              WorkToDo={WorkToDo}
              setWorkToDo={setWorkToDo}
              color={color}
              DateTimeState={DateTimeState}
              setDateTimeState={setDateTimeState}
              TaskDate={TaskDate}
              handleConfirm={handleConfirm}
              hideDatePicker={hideDatePicker}
              WordMonth={WordMonth}
              TwelveHourFormat={TwelveHourFormat}
              StartTime={StartTime}
              EndTime={EndTime}
              Duration={Duration}
              DurationBoxes={DurationBoxes}
              DurationTag={DurationTag}
              pan={pan}
              animatedStyles={animatedStyles}
              isEnabled={isEnabled}
              toggleSwitch={toggleSwitch}
            />

            <AreaThree
              AddFromExistingWorkButton={AddFromExistingWorkButton}
              setAddFromExistingWorkButton={setAddFromExistingWorkButton}
              AddFromExistingWorkToggleSwitch={AddFromExistingWorkToggleSwitch}
              NoteText={NoteText}
              setNoteText={setNoteText}
              navigation={navigation}
              ScheduleArray={ScheduleArray}
              Message={Message}
              SaveButton={SaveButton}
              WorkToDo={WorkToDo}
              setWorkToDo={setWorkToDo}
              color={color}
              DateTimeState={DateTimeState}
              setDateTimeState={setDateTimeState}
              TaskDate={TaskDate}
              handleConfirm={handleConfirm}
              hideDatePicker={hideDatePicker}
              WordMonth={WordMonth}
              TwelveHourFormat={TwelveHourFormat}
              StartTime={StartTime}
              EndTime={EndTime}
              Duration={Duration}
              DurationBoxes={DurationBoxes}
              DurationTag={DurationTag}
              pan={pan}
              animatedStyles={animatedStyles}
              isEnabled={isEnabled}
              toggleSwitch={toggleSwitch}
            />
          </ScrollView>
        </View>
        {/* </PanGestureHandler> */}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AllDayToggleButtonBox: {
    flex: 1,
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
    top: 73,
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
    height: 225,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },

  areaTwo: {
    height: 370,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },

  areaThree: {
    height: 150,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
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
    // fontWeight: 'bold',
    // fontWeight: '',
    color: '#9D9EA0',
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    // fontFamily: 'sf-pro-display-medium'
  },
});

export default AddTiming;
