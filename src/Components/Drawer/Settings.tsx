import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ScheduleTable from '../Screens/ScheduleTable'
import { useDispatch, useSelector } from 'react-redux' 
import { addScheduleObject, removeScheduleObject } from '../../app/Slice'
import { RootState } from '../../app/Store'
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
} from 'react-native-reanimated';

// Dispatch, reducer ko use karte hue store me changes karta hai
const Settings = () => {
  const dispatch = useDispatch();
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  const DurationBoxes = [0, 1, 2, 3];
    const DurationTag = ['0%', '25%', '50%', '75%', '✓'];
    const [Duration, setDuration] = useState('1h');
    const StartRadar = useSharedValue<number>(0);
    const MovedRadar = useSharedValue<number>(0);
    const FinalRadar = useSharedValue<number>(75.35);
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
        }
      })
  
      .onFinalize(() => {
        // console.log("Pressed onFinalize")
      });
  
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [{translateX: clamp(FinalRadar.value, 10, 310)}],
    }));
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 100}}>Settings</Text>
        {/* <ScheduleTable/> */}
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
                          fontFamily: 'futura-no-2-medium-dee',
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
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}


export default Settings

const styles = StyleSheet.create({})