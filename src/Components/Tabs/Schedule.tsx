import React from 'react';
import { useState, useEffect, memo, useRef, useCallback } from 'react';
import ClockImage from '../Images/AnalogClockImage.png'
// import Holder from '../Images/Holder.png'
import AddIcon from '../Images/Add.png'
import LeftArrow from '../Images/LeftArrow.png'
import ScheduleTableIcon from '../Images/ScheduleTable.png'
import CalenderIcon from '../Images/Calender.png'
import Doodle from '../Images/Doodle.jpg'
import 'react-native-gesture-handler'
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, Stop } from 'react-native-svg';
import Sound from 'react-native-sound';
// import ChainSound from '../Sounds/ChainSound.mp3'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from "@react-native-community/blur";
import BouncyCheckbox from "react-native-bouncy-checkbox";
// import Carousel from 'react-native-reanimated-carousel';
import {PythonShell} from 'python-shell';
import LinearGradient from 'react-native-linear-gradient';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { RouteProp } from '@react-navigation/native';
import { CombinedNavigationProp, CombinedRouteProp } from '../../App';

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
  Modal,
  Button,
  Dimensions
} from 'react-native';
import Navbar from '../Navbar/Navbar';
import ScheduleTable from '../Screens/ScheduleTable'
import CalenderView from '../Screens/CalenderView'
import TaskCompletionBoard from '../Screens/TaskCompletionBoard';
import { ScheduleArrayItem } from '../Screens/AddTiming';

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

      const hRotation = 30 * hTime + 0.5 * mTime;
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

type LowerAreaPropsType = {
  rescheduleStatus: string, 
  DialogBackButton: () => void, 
  DialogTitle: string, 
  data: {
    StartTime: string[];
    EndTime: string[];
    Work: string[];
    StartAngle: number[];
    EndAngle: number[];
    Slice_Color: string[];
  }, 
  hourRotation: number, 
  checked: boolean, 
  handleCheckboxChange: (index: number) => void, 
  RescheduleButtonClick: () => void
}

// Reschedule Button wala
const LowerArea = (props: LowerAreaPropsType) => {
  return (
    <View style={[styles.LowerArea]}>
      <TouchableOpacity style={[styles.RescheduleButton]} onPress={() => props.RescheduleButtonClick()}>
        <Text style={[{fontFamily: 'Geizer', fontSize: 30, color: 'white'}]}>Reschedule</Text>
      </TouchableOpacity>
      <Modal visible={props.rescheduleStatus !== 'off'}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BlurView
          style={styles.blurStyle}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="light"
        />
        <Animated.View style={[styles.selectionDialogBox]}>
        <BlurView
          style={styles.blurStyle}
          blurType="dark"
          blurAmount={50}
          reducedTransparencyFallbackColor="black"
        />
        <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'grey'}}>
          <TouchableOpacity onPress={props.DialogBackButton} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={LeftArrow} style={{height: 17, width: 17}}/>
          </TouchableOpacity>
          <View style={{flex: 8, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 15, fontFamily: 'sf-pro-display-bold', color: '#fff'}}>{props.DialogTitle}</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={{flex: 5, paddingLeft: 20, paddingBottom: 5}}>
          <ScrollView>
          {props.data['StartAngle'].filter((Start: number) => {
          if (props.rescheduleStatus == 'PriorStage') {
            return Start <= props.hourRotation
          }
          else{
            return Start > props.hourRotation
          }}
          ).map((Start:number, i:number) => {
            return(
              <View style={{margin: 5}} key={i}>
                <BouncyCheckbox
                  size={25}
                  isChecked={props.checked}
                  fillColor="#2173BD"
                  // unFillColor="#FFFFFF"
                  text={String(props.data['Work'][i])}
                  iconStyle={{ borderColor: "red" }}
                  innerIconStyle={{ borderWidth: 2 }}
                  textStyle={{ fontFamily: "sf-pro-display-medium", color: '#fff', textDecorationLine: 'none' }}
                  // onPress={(isChecked: boolean) => {console.log(isChecked)}}
                  onPress={() => props.handleCheckboxChange(i)}
                />
              </View>
            )})}
            </ScrollView>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}}>
            <TouchableOpacity onPress={() => props.RescheduleButtonClick()}>
              <Text style={{color: '#457fdf', fontFamily: 'sf-pro-display-bold', fontSize: 17}}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
    </View>
  )
};

const Schedule: React.FC = () => {
    const route = useRoute<CombinedRouteProp>();
    const navigation = useNavigation<NavigationProp<any, any>>();
    const [hourRotation, setHourRotation] = useState(0)
    const angle = useSharedValue(0);
    const startAngle = useSharedValue(0);
    const [infoVisible, setInfoVisible] = useState(false)
    const [timeStart, settimeStart] = useState('')
    const [timeEnd, settimeEnd] = useState('')
    const [duration, setduration] = useState<number>()
    const [Work, setWork] = useState('')
    const [angleColor, setangleColor] = useState('')
    const [tintstatus, setTintStatus] = useState(false)
    const [strokeStatus, setStrokeStatus] = useState(false)
    const [rescheduleStatus, setRescheduleStatus] = useState('off')
    // const rescheduleStatus = useRef('off')
    const [DialogTitle, setDialogTitle] = useState('')
    const [checked, setChecked] = useState(false);
    // const width = Dimensions.get('window').width;  // For Carousel
    const [serverResponseMessage, setServerResponseMessage] = useState('')
    const ScheduleTableSheet = useRef<TrueSheet>(null);
    const CalenderSheet = useRef<TrueSheet>(null);

    let ScheduleArray: ScheduleArrayItem[] = [];
    let Message: string = '';

    if (route.params && 'ScheduleArray' in route.params && 'Message' in route.params) {
      // const { ScheduleArray, Message } = route.params ?? '';
      ScheduleArray = route.params.ScheduleArray;
      Message = route.params.Message;
      
    } else {
      console.log("ScheduleArray or Message is not available in route params.");
    }
    
    const safeScheduleArray: ScheduleArrayItem[] = ScheduleArray ?? []
    console.log("Safe Schedule Array [Schedule.tsx]: ", ScheduleArray)

    const data = {
      "StartTime": safeScheduleArray.map((item: ScheduleArrayItem) => item.StartTime),
      "EndTime": safeScheduleArray.map((item: ScheduleArrayItem) => item.EndTime),
      "Work": safeScheduleArray.map((item: ScheduleArrayItem) => item.Work),
      "StartAngle": safeScheduleArray.map((item: ScheduleArrayItem) => item.StartAngle),
      "EndAngle": safeScheduleArray.map((item: ScheduleArrayItem) => item.EndAngle),
      "Slice_Color": [
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
    ],
    }
    
    interface ApiDataType {
      "Durations": string;
      "End_Timing": string;
      "Start_Timing": string;
      "Work": string;
    }
    const [ApiData, setApiData] = useState<ApiDataType>({
      "Durations": "[]",
      "End_Timing": "[]", 
      "Start_Timing": "[]", 
      "Work": "[]"
    })
    
    const [PriorSelections, setPriorSelections] = useState<number[]>([])
    const [FixedSelections, setFixedSelections] = useState<number[]>([])
    const [RemovingSelections, setRemovingSelections] = useState<number[]>([])

    useEffect(() => {
      const intervalId = setInterval(() => {
        const d = new Date();
        const hTime = d.getHours();
        const mTime = d.getMinutes();
  
        const hRotation = 30 * hTime + 0.5 * mTime;
  
        setHourRotation(hRotation);
      }, 3600000);
  
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
    
    const SingleAngle = useCallback(() => {
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
          {data['StartAngle'].map((startAngle:number, i:number) => {
            const endAngle = data['EndAngle'][i];
            const sectorColor = data['Slice_Color'][i];
            const startTime = data['StartTime'][i]
            const endTime = data['EndTime'][i]
            // const angleDuration = data['Duration'][i]
            const angleWork = data['Work'][i]
  
            const angleOnPress = () => {
              console.log('Pressed onOP');
              console.log(startAngle);
              console.log(endAngle);
              setInfoVisible(true);
              settimeStart(startTime);
              settimeEnd(endTime);
              setWork(angleWork);
              // setduration(angleDuration);
              setangleColor(sectorColor);
              setStrokeStatus(true);
              console.log(angleColor);
            };
  
            const anglePressOut = () => {
              setInfoVisible(false)
            }
            return(
              <Path
                key={i}
                d={getSingleAnglePath(hardRadius, hardRadius, hardRadius, endAngle, startAngle)}
                fill={sectorColor}  
                onPressIn={()=> angleOnPress()}
                onPressOut={()=> anglePressOut()}
                // stroke={strokeStatus? '#000000' : 'none'}
                // strokeDasharray="5,10"  // 10 units of stroke, 5 units of gap
                // strokeDashoffset="0"    // Start from the beginning of the path

                // stroke="url(#grad)"     //<Defs> Part
                // strokeWidth="4"
              />
          )})}
          {tintstatus && (
            <Path
            d={getSingleAnglePath(hardRadius, hardRadius, hardRadius, data["EndAngle"][14], hourRotation)}
            fill= "rgba(0, 0, 0, 0.5)"
          />
          )}
        </Svg>
      );
    }, [ScheduleArray]);
  
    const AngleInfo = () => {
      return(
        <View style={styles.angleInfo}>
          <View style={styles.angleInfoLeft}>
            <Text style={styles.angleInfoLeftText}>Timing:  </Text>
            <Text style={styles.angleInfoLeftText}>Work:  </Text>
            <Text style={styles.angleInfoLeftText}>Duration:  </Text>
            <Text style={styles.angleInfoLeftText}>Color:  </Text>
          </View>
          <View style={styles.angleInfoRight}>
            <Text style={styles.angleInfoRightText}> {timeStart} - {timeEnd}</Text>
            <Text style={styles.angleInfoRightText}> {Work}</Text>
            <Text style={styles.angleInfoRightText}> {duration}mins</Text>
            <View style={[styles.angleInfoColor, {backgroundColor: `${angleColor}`}]}></View>
          </View>
        </View>
      );
    } 
    
    useEffect(() => {
      if (rescheduleStatus === 'PriorStage') {
        setDialogTitle('Choose Prior Work');
      }
      else if (rescheduleStatus === 'FixingStage') {
        setDialogTitle('Choose the ones to be Fixed');
      }
      else if (rescheduleStatus === 'RemovingStage') {
        setDialogTitle('Choose Removing Work');
      }
    }, [rescheduleStatus]);

    // In the backend API case, ensure to have a 3rd device to share the same network in both PC and real device emulator and also ensure that Windows Firewall is closed.

    const sendNameToBackend = async () => {
      try {
        const response = await fetch('http://192.168.95.92:5000/', {  // Replace localhost with your computer's IP address if testing on a real device
          method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
          },
          body: JSON.stringify({ "Time": "4/11/23 10:00:00", "Prev": "2,4", "Remov": "10,14,17,19"}), // Convert the request payload to JSON.
        })
  
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data from the server');
        }
  
        const fetched_data = await response.json(); // Parse JSON response
        setApiData(fetched_data)
        setServerResponseMessage(fetched_data.message);  // Update state with server response
        console.log("API_DATA: ", JSON.stringify(ApiData))
      } catch (error) {
        console.error('Catch Error: ', error);
        setServerResponseMessage('Failed to connect to the backend');  // Handle network error
      }
    };

    const DialogBackButton = () => {
      setRescheduleStatus('off');
      setTintStatus(false);
    }

    const RescheduleButtonClick = () => {
      console.log("Reschedule Button is being clicked")
      rescheduleStatus === 'off' && setRescheduleStatus('PriorStage') 
      rescheduleStatus === 'PriorStage' && setRescheduleStatus('FixingStage')
      rescheduleStatus === 'FixingStage' && setRescheduleStatus('RemovingStage')
      rescheduleStatus === 'RemovingStage' && sendNameToBackend();
      // console.log("ScheduleArray (In Schedule.tsx): ",ScheduleArray)
    }

    const handleCheckboxChange = (index: number) => {
      if (rescheduleStatus == 'PriorStage') {
        setPriorSelections((prevSelections) => {
          const newSelections = [...prevSelections, index]
          return newSelections;
        })
        console.log("PriorSelectionList: ", PriorSelections)
      }
      else if (rescheduleStatus == 'FixingStage') {
        setFixedSelections((prevSelections) => {
          const newSelections = [...prevSelections, index]
          return newSelections;
        })
        console.log("FixedSelectionList: ", FixedSelections)
      }
      else if (rescheduleStatus == 'RemovingStage') {
        setRemovingSelections((prevSelections) => {
          const newSelections = [...prevSelections, index]
          return newSelections;
        })
        console.log("RemovingSelectionList: ", RemovingSelections)
      }
    };

    async function ScheduleTableButton () {
      await ScheduleTableSheet.current?.present();
    }

    async function CalenderButton () {
      await CalenderSheet.current?.present();
    }

    // Nested Components (Composition)
    const UpperArea = () => {
      return (
        <View style={styles.UpperArea}>
          <View style={{flex: 0.5, backgroundColor: '#FFFFFF', marginBottom: 3, flexDirection: 'row', borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, elevation: 5}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderRightColor: 'grey', borderRightWidth: 0.5}}>
              <Text style={{color: 'black', fontFamily: 'sf-pro-display-bold', fontSize: 17}}>08:24 AM</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'black', fontFamily: 'sf-pro-display-bold', fontSize: 17}}>September 24</Text>
            </View>
          </View>

          <View style={{flex: 1, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 5, borderTopLeftRadius: 5, elevation: 5}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'grey',  borderBottomWidth: 0.5}}>
              <Text style={{color: 'black', fontFamily: 'sf-pro-display-bold', fontSize: 17}}>Chemistry Work (1h 21mins)</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
              <Text style={{color: 'black', fontFamily: 'sf-pro-display-bold', fontSize: 17}}>09:21 AM - 10:30 AM</Text>
            </View>
          </View>
          {/* {infoVisible && (
            <AngleInfo/>
          )} */}
        </View>
      )
    };

    // Sabse niche wala
    const BottomArea = () => {
      return (
        <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginRight: 60, marginLeft: 60}}>
          <View style={{backgroundColor: '#BFB8E9', flexDirection: 'row', paddingTop: 8, paddingBottom: 8, borderRadius: 10, elevation: 5}}>
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={ScheduleTableButton}>
              <Image source={ScheduleTableIcon} style={{width: 35, height: 35}}/>
            </TouchableOpacity>
            <TrueSheet
              ref={ScheduleTableSheet}
              // sizes={['auto', 'large']}
              sizes={['auto', 'large']}
              cornerRadius={24}
            >
              <ScheduleTable/>
            </TrueSheet>

            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={CalenderButton}>
              <Image source={CalenderIcon} style={{width: 29, height: 29}}/>
            </TouchableOpacity>
            <TrueSheet
            ref={CalenderSheet}
            sizes={['auto', 'large']}
            cornerRadius={24}
            >
              <CalenderView/>
            </TrueSheet>

            <TouchableOpacity style={[{ flex: 1, justifyContent: 'center', alignItems: 'center'}]} 
            onPress={()=> navigation.navigate('StackScreens', {screen: 'AddTimingStack'})}>
              <View style={{}}>
                <Image style={styles.AddIcon} source={AddIcon}/>
              </View>
            </TouchableOpacity>
          </View>
          <TaskCompletionBoard/>
        </View>
      )
    };

    // useEffect(() => {
    //   ClockArea();
    // }, [ScheduleArray])
    

    return (
      <SafeAreaView style={styles.safeView}>
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
            style={{paddingTop: StatusBar.currentHeight}}>
            <Navbar/>
          </LinearGradient>
          <View style={[styles.mainArea, tintstatus === true? styles.overlay : {}]}>
            <UpperArea/>
  
            <View style={styles.ClockArea}>
              <Clock/>
              
              <View style={styles.arcAngle}>
                <SingleAngle/>
              </View>
            
            </View>

            <LowerArea rescheduleStatus={rescheduleStatus} DialogBackButton={DialogBackButton} DialogTitle={DialogTitle} data={data} hourRotation={hourRotation} checked={checked} handleCheckboxChange={handleCheckboxChange} RescheduleButtonClick={RescheduleButtonClick}/>

            <BottomArea/>
            {/* <Taskbar activeState='Schedule'/> */}
          </View>
        </View>
      {/* </PanGestureHandler>
      </GestureHandlerRootView> */}
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safeView: {
      flex: 1,
      backgroundColor: 'white'
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
      backgroundColor: 'black',
      height: 320,
      width: 320,
      borderRadius: 20,
      opacity: 0.85,
      overflow: 'hidden'
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
      // backgroundColor: 'black'
    },

    RescheduleButton: {
      backgroundColor: '#B020F4',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 60,
      marginRight: 60,
      borderRadius: 12,
      marginTop: 5,
      borderRightWidth: 3,
      borderLeftWidth: 3,
      borderBottomWidth: 3,
      borderColor: '#841AB6'
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