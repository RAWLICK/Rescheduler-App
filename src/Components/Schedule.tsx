import React from 'react';
import { useState } from 'react';
// import ClockImage from '../Images/AnalogClockImage.png'
import ClockImage from '../Images/AnalogClockImage.png'
// import Holder from '../Images/Holder.png'
import AddIcon from '../Images/AddIcon.png'
import 'react-native-gesture-handler'
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import Sound from 'react-native-sound';
// import ChainSound from '../Sounds/ChainSound.mp3'
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import Navbar from './Navbar';
import Taskbar from './Taskbar';

const Schedule = () => {
    const [hourRotation, setHourRotation] = useState(0)
    const [minuteRotation, setMinuteRotation] = useState(0)
    const [secondRotation, setSecondRotation] = useState(0)
  
    setTimeout(() => {
      let d = new Date();
      let hTime = d.getHours();
      let mTime = d.getMinutes();
      let sTime = d.getSeconds();
      let hRotation = 30*hTime + 0.5*mTime;
      let mRotation = 6*mTime;
      let sRotation = 6*sTime;
  
      setHourRotation(hRotation);
      setMinuteRotation(mRotation);
      setSecondRotation(sRotation);
    }, 1000);
    
    const navigation = useNavigation<NavigationProp<any, any>>();
    const angle = useSharedValue(0);
    const startAngle = useSharedValue(0);
    
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
    
    const pan = Gesture.Pan()
      .onBegin(() => {
        startAngle.value = angle.value;
        console.log("Pressed onBegin")
      })
      .onStart(() => {
        startAngle.value = angle.value;
        console.log("Pressed onStart")
      })
      .onChange((event) => {
        console.log("Pressed onChange")
        const x = event.translationX;
        const y = event.translationY;
        const newAngle = Math.atan2(y, x);
        angle.value = startAngle.value + newAngle;
        // playSound();
      })
      .onFinalize(() => {
        console.log("Pressed onFinalize")
      });
                                                                                                                   
      const animatedStyles = useAnimatedStyle(() => ({
        transform: [
          { rotate: `${angle.value}rad` }]
      }));
  
    const data = {
      "Start_": [300.0, 325.5, 351.0, 357.5, 383.0, 389.5, 390.0, 420.0, 445.0, 458.0, 496.5, 510.0, 540.0, 552.0, 565.0],
      "End_": [325.5, 351.0, 357.5, 383.0, 389.5, 390.0, 420.0, 445.0, 458.0, 496.5, 510.0, 540.0, 552.0, 565.0, 590.5],
      "Time_Start": ['10:00:00', '10:51:00', '11:42:00', '11:55:00', '12:46:00', '12:59:00', '13:00:00', '14:00:00', '14:50:00', '15:16:00', '16:33:00', '17:00:00', '18:00:00', '18:24:00', '18:50:00', '19:41:00', '22:00:00', '22:30:00', '22:44:00', '00:00:00'],
      "Time_End": ['10:51:00', '11:42:00', '11:55:00', '12:46:00', '12:59:00', '13:00:00', '14:00:00', '14:50:00', '15:16:00', '16:33:00', '17:00:00', '18:00:00', '18:24:00', '18:50:00', '19:41:00', '22:00:00', '22:30:00', '22:44:00', '00:00:00', '05:00:00'],
      "Duration": [51, 51, 13, 51, 13, 1, 60, 50, 26, 77, 27, 60, 24, 26, 51, 139, 30, 14, 76, 300],
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
      "rgba(191, 115, 181, 0.5)"],
      "Work": ['Work 1', 'Work 2', 'Work 2 Break', 'Work 3', 'Work 3 Break', 'Work 4', 'Work 4 Break','Sona', 'Work 5', 'Work 5 Break', 'Work 6', 'Free 1', 'Work 7', 'Work 8', 'Work 9']
    };
  
    const [isVisible, setIsVisible] = useState(false)
    const [timeStart, settimeStart] = useState('')
    const [timeEnd, settimeEnd] = useState('')
    const [duration, setduration] = useState<number>()
    const [Work, setWork] = useState('')
    const [angleColor, setangleColor] = useState('')
  
    const SingleAngle = () => {
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
          {data['Start_'].map((startAngle, i) => {
            const endAngle = data['End_'][i];
            const sectorColor = data['Slice_Color'][i];
            const startTime = data['Time_Start'][i]
            const endTime = data['Time_End'][i]
            const angleDuration = data['Duration'][i]
            const angleWork = data['Work'][i]
  
            const angleOnPress = () => {
              console.log('Pressed onOP');
              console.log(startAngle);
              console.log(endAngle);
              setIsVisible(true);
              settimeStart(startTime);
              settimeEnd(endTime)
              setWork(angleWork)
              setduration(angleDuration)
              setangleColor(sectorColor)
              console.log(angleColor)
            };
  
            const anglePressOut = () => {
              setIsVisible(false)
            }
            return(
              <Path
                key={i}
                d={getSingleAnglePath(hardRadius, hardRadius, hardRadius, endAngle, startAngle)}
                fill={sectorColor}  
                onPressIn={()=> angleOnPress()}
                onPressOut={()=> anglePressOut()}
              />
          )})}
        </Svg>
      );
    };
  
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
    
    return (
      <SafeAreaView style={styles.safeView}>
      {/* <GestureHandlerRootView>
      <PanGestureHandler> */}
        <View style={styles.mainStyle}>
          {/* <Navbar/> */}
          <View style={styles.mainArea}>
            <View style={styles.UpperArea}>
              {isVisible && (
                <AngleInfo/>
              )}
            </View>
  
            <View style={styles.ClockArea}>
              <ImageBackground source={ClockImage}  style={styles.Clock}>
                <View style={[styles.hour, { transform: [{ rotate: `${hourRotation}deg` }] }]}></View>
                <View style={[styles.minute, { transform: [{ rotate: `${minuteRotation}deg` }] }]}></View>
                <View style={[styles.second, { transform: [{ rotate: `${secondRotation}deg` }] }]}></View>
              </ImageBackground>
              {/* <GestureDetector gesture={pan}>
              <Animated.View 
                style={[styles.compressorOne, animatedStyles]}>
                <Image style={styles.holderOne} source={Holder}/> 
              </Animated.View>
              </GestureDetector> */}
              <View style={styles.arcAngle}>
                <SingleAngle/>
              </View>
            </View>
            <View style={styles.LowerArea}>
               {/* <Text>3rd Flex</Text> */}
            </View>
            <View style={{flex: 0.4, alignItems: 'flex-end', marginRight: 20}}>
              <TouchableOpacity style={{backgroundColor: '#bd54ee', padding: 15, borderRadius: 30}} 
              onPress={()=> navigation.navigate('AddTiming')}>
                <Image style={styles.AddIcon} source={AddIcon}/>
              </TouchableOpacity>
            </View>
            {/* <Taskbar/> */}
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
      // alignItems: 'center',
      // justifyContent: 'center',
      // backgroundColor: '#10a5dd',
      backgroundColor: '#FFFFFF',
    },
  
    UpperArea: {
      flex: 0.7,
      alignItems: 'center',
      justifyContent: 'center'
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
      // backgroundColor: '#0d750b',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'relative'
      // borderWidth: 5,
      // borderColor: '#0a74a2'
    },

    Clock: {
      height: 350, 
      width: 350, 
      position: 'absolute', 
      justifyContent: 'center', 
      alignItems: 'center',
      pointerEvents: 'none'
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
    zIndex: -1
    },
  
    over: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1
    },

    LowerArea: {
      flex: 0.4,
      // backgroundColor: 'black'
    },

    AddIcon: {
      width: 30,
      height: 30,
      
    }
  });

export default Schedule