import { Modal, StyleSheet, Text, View, Dimensions, TouchableOpacity, ImageBackground, StatusBar, Platform } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react';
import { BlurView } from "@react-native-community/blur";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    PanGestureHandler,
    ScrollView,
  } from 'react-native-gesture-handler';
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    clamp,
    runOnJS,
    withSpring
  } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux' 
import { addExistingSubjectsObject, addExistingSubjectsWorkDoneObject, removeExistingSubjectsObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
import { ExistingSubjectsArrayItem } from '../../app/Slice';
import LottieView from 'lottie-react-native';
import AnimatedFire from '../Images/AnimatedFire.json';
import TickAnimation from '../Images/TickAnimation.json';
import ConfettiAnimation from '../Images/ConfettiAnimation.json';
import LinearGradient from 'react-native-linear-gradient';
import notifee from '@notifee/react-native';
import { AndroidColor } from '@notifee/react-native';
import { TimerPickerModal } from "react-native-timer-picker";
import DemoLandingPage from '../Images/DemoLandingPage.jpeg';
import { demoData } from '../../Functions/Animated-Bar-Chart/constants';
import { set } from 'date-fns';
const { width, height } = Dimensions.get('window');
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type TaskCompletionPopUpPropsType = {
  popUpIsVisible: boolean
  setPopUpIsVisible: SetState<boolean>
  NextPopUpClick: () => void
}
export const TaskCompletionPopUp = (props: TaskCompletionPopUpPropsType) => {
  return (
    <Modal visible={props.popUpIsVisible} animationType='fade'>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <BlurView
          style={styles.blurStyle}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="light"
        />
            <View style={{height: height * 0.17, width: width * 0.8, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'grey', padding: 10}}>
            <BlurView
              style={styles.blurStyle}
              blurType="dark"
              blurAmount={50}
              reducedTransparencyFallbackColor="black"
            />
              <View style={{flex:1, rowGap: 10}}>
                <LinearGradient colors={['#f3b607', '#cdd309']} style={{flex: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 10}}>
                  <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Heavy' : 'sf-pro-display-heavy', color: '#333333', fontSize: 14}}>You just reached a streak of 3 </Text>
                  <LottieView source={AnimatedFire} autoPlay loop style={styles.lottie}></LottieView>
                </LinearGradient>
                <View style={{flex: 3, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <LottieView source={ConfettiAnimation} autoPlay loop style={styles.confettiLottie}></LottieView>
                    <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}> By registering 7/7 works </Text>
                    <LottieView source={ConfettiAnimation} autoPlay loop style={styles.confettiLottie}></LottieView>
                </View>
                <TouchableOpacity style={{flex: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#457fdf', borderRadius: 10}} onPress={props.NextPopUpClick}>
                    <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    </Modal>
  )
}

type DurationBoxPropsType = {
  showPicker: boolean,
  setShowPicker: SetState<boolean>,
  alarmString: string | null
  setAlarmString: SetState<string | null>
  DurationBoxValue: string | null
  setDurationBoxValue: SetState<string | null>
}
// const DurationBox = (props: DurationBoxPropsType) => {
//   const formatTime = (pickedDuration: { hours: number, minutes: number, seconds: number}) => {
//     return `${pickedDuration.hours}hr ${pickedDuration.minutes}min`
//   }
//   return (
//       <TimerPickerModal
//           hideSeconds
//           padHoursWithZero
//           visible={props.showPicker}
//           setIsVisible={props.setShowPicker}
//           onConfirm={(pickedDuration) => {
//             props.setAlarmString(formatTime(pickedDuration));
//             props.setShowPicker(false);
//             props.setDurationBoxValue(formatTime(pickedDuration))
//             console.log("Duration Value: ", props.DurationBoxValue)
//           }}
//           modalTitle="Duration"
//           onCancel={() => props.setShowPicker(false)}
//           closeOnOverlayPress
//           LinearGradient={LinearGradient}
//           styles={{ theme: "dark" }}
//           modalProps={{ overlayOpacity: 0.2 }}
//       />
//   )
// }

const TaskCompletionBoard = () => {
  const dispatch = useDispatch();
  const currentDate = new Date();
  let currentNumDate = currentDate.getDate().toString().padStart(2, '0');
  let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let currentYear = currentDate.getFullYear();
  const [currentMin, setCurrentMin] = useState(currentDate.getMinutes());
  const [boardIsVisible, setBoardIsVisible] = useState(false);
  const [popUpIsVisible, setPopUpIsVisible] = useState(false);
  const DurationBoxes = [0, 1, 2, 3];
  const DurationTag = ['0%', '25%', '50%', '75%', '✓'];
  const [Duration, setDuration] = useState('1h');
  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState<string | null>(null);
  type PercentageArrayType = {
    uniqueID: string,
    percentage: number
  }
  const [PercentageArray, setPercentageArray] = useState<PercentageArrayType[]>([])
  const percentageArrayRef = useRef<number[]>([]);
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
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState)

  function getTimeByPercentage(timeString: string, percentage: number) {
    // Extract hours and minutes from the input string
    const hourMatch = timeString.match(/(\d+)\s*h/);
    const minMatch = timeString.match(/(\d+)\s*min/);
  
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
  
    // Total time in minutes
    const totalMinutes = hours * 60 + minutes;
  
    // Calculate percentage of time
    const resultMinutes = Math.round((totalMinutes * percentage) / 100);
  
    // Convert back to hours and minutes
    const resultHours = Math.floor(resultMinutes / 60);
    const remainingMinutes = resultMinutes % 60;
  
    // Format output string
    let output = '';
    if (resultHours > 0) output += `${resultHours}h `;
    if (remainingMinutes > 0 || resultHours === 0) output += `${remainingMinutes}min`;
  
    return output.trim();
  }

  const updatePercentageArray = (uniqueID: string, percentage: number) => {
    setPercentageArray((prev) => {
      let newArray = [...prev];
      const found = newArray.find((item) => item.uniqueID === uniqueID);
      if (found) {
        found.percentage = percentage;
      }
      else {
        newArray.push({ 
          "uniqueID": uniqueID, 
          "percentage": percentage 
        });
      }
      return newArray;
    });
  };

  const formatTime = (pickedDuration: { hours: number, minutes: number, seconds: number}) => {
    return `${pickedDuration.hours}hr ${pickedDuration.minutes}min`
  }

  const TaskCompletionBoardVisibility = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        const newMin = new Date().getMinutes();
        if (newMin !== currentMin) {
          setCurrentMin(newMin);
          setBoardIsVisible(true);
        }
      }, 1000);

      const timeout = setTimeout(() => {
        setBoardIsVisible(false);
        // setPopUpIsVisible(true);
      }, 15000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }, [currentMin]);

    return boardIsVisible;
  }

  function DisplayingPercentage (uniqueID: string) {
    const found = PercentageArray.find((item) => item.uniqueID === uniqueID);
    if (found) {
      return found.percentage;
    }
    return 0;
  }

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Schedule got Messed Up?',
      body: 'Easily reschedule your messed up routine using Rescheduler ',
      android: {
        channelId,
        // smallIcon: 'appicon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  function DurationClick () {
    setShowPicker(true);
  }

  const OkBoardClick = () => {
    dispatch(addExistingSubjectsWorkDoneObject(PercentageArray));
    onDisplayNotification();
    setBoardIsVisible(false);
    setPopUpIsVisible(true);
    console.log("Existing Subjects Array: ", ExistingSubjectsArray)
  }

  const NextPopUpClick = () => {
    setPopUpIsVisible(false);
  }

  useEffect(() => {
    console.log("Percentage Array: ", PercentageArray)
  }, [PercentageArray])

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ImageBackground
        source={DemoLandingPage}
        style={[styles.ImageBackgroundViewStyle]}
        imageStyle={{resizeMode: 'cover'}}>
        <BlurView
        style={styles.blurStyle}
        blurType="light"
        blurAmount={10}
        // reducedTransparencyFallbackColor="black"
        />
          <View style={{height: height * 0.5, width: width * 0.8, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'grey'}}>
          <BlurView
            style={styles.blurStyle}
            blurType="dark"
            blurAmount={50}
            // reducedTransparencyFallbackColor="black"
          />
            <View style={{flex: 1, borderBottomWidth: 1, borderColor: 'grey', flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>Work Done </Text>
                    <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#af9afb'}}>VS</Text>
                    <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}> Planned</Text>
                </View>
            </View>
            <View style={{flex: 10}}>
            <ScrollView>
                {ExistingSubjectsArray.map((eachSubject, index) => {
                  const StartRadar = useSharedValue<number>(0);
                  const MovedRadar = useSharedValue<number>(0);
                  const FinalRadar = useSharedValue<number>(65);
                  const uniqueID = eachSubject["uniqueID"];
                  const lastPercentage = useSharedValue<number>(25);

                  const pan = Gesture.Pan()
                  .onBegin(() => {
                    StartRadar.value = FinalRadar.value;
                  })
                  .onChange(event => {
                    let newPercentage = lastPercentage.value

                    MovedRadar.value = event.translationX;
                    FinalRadar.value = StartRadar.value + MovedRadar.value;
                    if (MovedRadar.value > 0) {
                      if (FinalRadar.value <= 0) {
                        FinalRadar.value = withSpring(0)
                        newPercentage = 0;
                      }
                      else if (FinalRadar.value > 0 && FinalRadar.value < 65) {
                        FinalRadar.value = withSpring(65)
                        newPercentage = 25;
                      }
                      else if (FinalRadar.value > 65 && FinalRadar.value < 137) {
                        FinalRadar.value = withSpring(137)
                        newPercentage = 50;
                      }
                      else if (FinalRadar.value > 137 && FinalRadar.value < 217) {
                        FinalRadar.value = withSpring(217)
                        newPercentage = 75;
                      }
                      else if (FinalRadar.value > 217 && FinalRadar.value < 292) {
                        FinalRadar.value = withSpring(292)
                        newPercentage = 100;
                      }
                    }
                    else {
                      if (FinalRadar.value > 0 && FinalRadar.value < 65) {
                        FinalRadar.value = withSpring(0)
                        newPercentage = 0;
                      }
                      else if (FinalRadar.value > 65 && FinalRadar.value < 137) {
                        FinalRadar.value = withSpring(65)
                        newPercentage = 25;
                      }
                      else if (FinalRadar.value > 137 && FinalRadar.value < 217) {
                        FinalRadar.value = withSpring(137)
                        newPercentage = 50;
                      }
                      else if (FinalRadar.value > 217 && FinalRadar.value < 292) {
                        FinalRadar.value = withSpring(217)
                        newPercentage = 75;
                      }
                      else if (FinalRadar.value >= 292) {
                        FinalRadar.value = withSpring(292)
                        newPercentage = 100;
                      }
                    }

                    if (newPercentage !== lastPercentage.value) {
                      lastPercentage.value = newPercentage;
                      runOnJS(updatePercentageArray)(uniqueID, newPercentage);
                    }

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
                  transform: [{translateX: clamp(FinalRadar.value, 0, 283)}],
                }));

                return (
                <View key={eachSubject["uniqueID"]} style={{padding: 5, paddingLeft: 15, paddingRight: 15, rowGap: 15, borderBottomWidth: 1, borderColor: 'grey'}}>
                    <View style={{flexDirection: 'row', columnGap: 10, alignItems: 'center', height: 30}}>
                        <View>
                            <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>{eachSubject["Subject"]}</Text>
                        </View>
                        <View style={{backgroundColor: '#43464d', width: 150, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5, flexDirection: 'row'}}>
                          <View>
                            <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', color: '#fff'}}>{DisplayingPercentage(uniqueID)}%  of  </Text>
                          </View>
                          <View style={{backgroundColor: '#646871', borderRadius: 5, padding: 2, paddingLeft: 7, paddingRight: 7}}>
                            <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', color: '#fff'}}>{eachSubject["Current_Duration"]}</Text>
                          </View>
                        </View>
                    </View>
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            {DurationBoxes.map((index, i) => {
                            return (
                                <View
                                key={i}
                                style={[
                                    {
                                    backgroundColor: '#9D9EA0',
                                    height: 10,
                                    width: "25%",
                                    marginRight: 2,
                                    },
                                    i == 0
                                    ? {borderTopLeftRadius: 4, borderBottomLeftRadius: 4}
                                    : {},
                                    i == 3
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
                                top: -4,
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
                                    marginRight: '15%',
                                    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
                                    color: '#9D9EA0',
                                    },
                                    tag != '0%' ? {marginRight: '18%'} : {}
                                ]}>
                                {tag}
                                </Text>
                            );
                            })}
                        </View>
                    </View>
                </View>
              )})}
            </ScrollView>
            <View style={{height: height * 0.057, padding: 10}}>
              <TouchableOpacity onPress= {OkBoardClick} style={{flex: 1, backgroundColor: '#457fdf', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#333333'}}>Done</Text>
              </TouchableOpacity>
            </View>
            </View>
        </View>
      </ImageBackground>
    <TaskCompletionPopUp
      popUpIsVisible={popUpIsVisible}
      setPopUpIsVisible={setPopUpIsVisible}
      NextPopUpClick={NextPopUpClick}
     />
    </GestureHandlerRootView>
  )
}

export default TaskCompletionBoard

const styles = StyleSheet.create({
    blurStyle: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    lottie: {
      width: 20, // Adjust width as needed
      height: 20, // Adjust height as needed
    },
    confettiLottie: {
      width: 35, // Adjust width as needed
      height: 35, // Adjust height as needed
    },
    ImageBackgroundViewStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
})