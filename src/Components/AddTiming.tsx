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
  Button,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import ChevronRight from '../Images/ChevronRight.png';
import ChevronLeft from '../Images/ChevronLeft.png';
import RightArrow from '../Images/RightArrow.png';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'react-native-gesture-handler';
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

const AddTiming = () => {
  console.log("Add Timing component is running")
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
  interface ScheduleArrayItem {
    StartTime: string;
    EndTime: string;
    Work: string;
    StartAngle: number;
    EndAngle: number;
  }
  const [ScheduleArray, setScheduleArray] = useState<ScheduleArrayItem[]>([]);

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
    };
    setScheduleArray(prevSelections => {
      const UpdatedScheduleArray = [...prevSelections, newTask];
      return UpdatedScheduleArray.sort((a, b) => a.StartAngle - b.StartAngle);
    });
  };

  useEffect(() => {
    // console.log("ScheduleArray (after Update): ", ScheduleArray)
  }, [ScheduleArray]);

  const saveStateToStorage = async (ScheduleArray: ScheduleArrayItem[]) => {
    try {
      await AsyncStorage.setItem(
        'savedSchedule',
        JSON.stringify(ScheduleArray),
      );
    } catch (error) {
      console.log('Error saving data ', error);
    }
  };

  const loadStateFromStorage = async () => {
    try {
      const savedSchedule = await AsyncStorage.getItem('savedSchedule');
      if (savedSchedule !== null) {
        setScheduleArray(JSON.parse(savedSchedule));
      }
    } catch (error) {
      console.log('Error Loading Data: ', error);
    }
  };

  useEffect(() => {
    return () => {
      saveStateToStorage(ScheduleArray); // Saving Data when component gets unmounted
    };
  }, [ScheduleArray]);

  useEffect(() => {
    loadStateFromStorage();
  }, []);

  // Nested Components
  const HeaderPanel = () => {
    return (
      <View style={styles.HeaderPanel}>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Image source={ChevronLeft} style={{height: 20, width: 20}} />
        </View>
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ACC6FF',
              borderRadius: 20,
              padding: 8,
              paddingLeft: 20,
              paddingRight: 20,
            }}
            onPress={SaveButton}>
            <Text style={[styles.OptionText, {color: '#093471'}]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AreaOne = () => {
    return (
      <View style={styles.areaOne}>
        <TouchableOpacity style={styles.UpperOption}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            {/* <Text style={styles.OptionText}>Work</Text> */}
            <TextInput
              style={styles.OptionText}
              value={WorkToDo}
              onChangeText={setWorkToDo}
              placeholder="Work"></TextInput>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Image source={ChevronRight} style={{height: 17, width: 17}} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.BottomOption}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.OptionText}>Color</Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <View
              style={[
                styles.angleInfoColor,
                {backgroundColor: `${color}`},
              ]}></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const AreaTwo = () => {
    return (
      <View style={styles.areaTwo}>
        <View style={styles.UpperOption}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.OptionText}>Date</Text>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 40,
                width: 50,
                backgroundColor: '#43464D',
                alignItems: 'center',
                marginRight: 5,
                borderRadius: 10,
                justifyContent: 'center',
              }}
              onPress={() => setDateTimeState('date')}>
              <Text
                style={{fontFamily: 'futura-no-2-medium-dee', fontSize: 17}}>
                {TaskDate.split('/', 1)}
              </Text>
              <DateTimePickerModal
                isVisible={DateTimeState == 'date' ? true : false}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                width: 100,
                backgroundColor: '#43464D',
                alignItems: 'center',
                marginLeft: 5,
                borderRadius: 10,
                justifyContent: 'center',
              }}
              onPress={() => setDateTimeState('month')}>
              <Text
                style={{fontFamily: 'futura-no-2-medium-dee', fontSize: 17}}>
                {WordMonth(TaskDate)}
              </Text>
              <DateTimePickerModal
                isVisible={DateTimeState == 'month' ? true : false}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.MiddleOption}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.OptionText}>Timing</Text>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 40,
                width: 85,
                backgroundColor: '#43464D',
                alignItems: 'center',
                marginRight: 5,
                borderRadius: 10,
                justifyContent: 'center',
              }}
              onPress={() => setDateTimeState('StartTiming')}>
              <Text style={{fontFamily: 'futura-no2-d-demibold', fontSize: 16}}>
                {TwelveHourFormat(StartTime)}
              </Text>
              <DateTimePickerModal
                isVisible={DateTimeState == 'StartTiming' ? true : false}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
            <View>
              <Image source={RightArrow} style={{height: 17, width: 17}} />
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                width: 85,
                backgroundColor: '#43464D',
                alignItems: 'center',
                marginLeft: 5,
                borderRadius: 10,
                justifyContent: 'center',
              }}
              onPress={() => setDateTimeState('EndTiming')}>
              <Text style={{fontFamily: 'futura-no2-d-demibold', fontSize: 16}}>
                {TwelveHourFormat(EndTime)}
              </Text>
              <DateTimePickerModal
                isVisible={DateTimeState == 'EndTiming' ? true : false}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.MiddleOption,
            {flex: 2, flexDirection: 'column', justifyContent: 'center'},
          ]}>
          <View
            style={{
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#9D9EA0',
              marginBottom: 20,
              borderRadius: 10,
            }}>
            <Text
              style={[
                styles.OptionText,
                {fontFamily: 'futura-no2-d-demibold', color: '#000000'},
              ]}>
              Duration ({Duration})
            </Text>
          </View>
          {/* 9D9EA0 */}
          <View style={{flexDirection: 'row'}}>
            {DurationBoxes.map((index, i) => {
              return (
                <View
                  key={i}
                  style={[
                    {
                      backgroundColor: '#9D9EA0',
                      height: 10,
                      width: 17,
                      marginRight: 2,
                    },
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
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                {
                  backgroundColor: 'white',
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  position: 'absolute',
                  top: 73,
                },
                animatedStyles,
              ]}
            />
          </GestureDetector>

          <View style={{flexDirection: 'row', marginTop: 7}}>
            {DurationTag.map((tag, i) => {
              return (
                <Text
                  key={i}
                  style={[
                    {
                      marginRight: 44,
                      fontFamily: 'futura-no-2-medium-dee',
                      color: '#9D9EA0',
                    },
                    tag != '0h' ? {marginRight: 62} : {},
                  ]}>
                  {tag}
                </Text>
              );
            })}
          </View>
        </View>

        <View style={styles.BottomOption}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.OptionText}>All Day</Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              // ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
    );
  };

  const AreaThree = () => {
    return (
      <View style={styles.areaThree}>
        <TextInput
          multiline
          numberOfLines={6}
          style={styles.OnlyOption}
          value={NoteText}
          onChangeText={setNoteText}
          placeholder="Add a Note"></TextInput>
      </View>
    );
  };

  module.exports = {ScheduleArray};

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
          <HeaderPanel />

          <ScrollView>
            <AreaOne />

            <AreaTwo/>

            <AreaThree/>
          </ScrollView>
        </View>
        {/* </PanGestureHandler> */}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'white',
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
    fontFamily: 'futura-no-2-medium-dee',
    fontSize: 16,
  },

  areaOne: {
    height: 150,
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
    fontFamily: 'futura-no-2-medium-dee',
    // fontFamily: 'sf-pro-display-medium'
  },
});

export default AddTiming;
