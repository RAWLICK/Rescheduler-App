import { Modal, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { BlurView } from "@react-native-community/blur";
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
const { width, height } = Dimensions.get('window');

const TaskCompletionBoard = () => {
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
  return (
    <GestureHandlerRootView>
    <Modal visible={false}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <BlurView
          style={styles.blurStyle}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="light"
        />
            <View style={{height: height * 0.5, width: width * 0.8, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'grey'}}>
            <BlurView
              style={styles.blurStyle}
              blurType="dark"
              blurAmount={50}
              reducedTransparencyFallbackColor="black"
            />
                <View style={{flex: 1, borderBottomWidth: 1, borderColor: 'grey', flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 15, fontFamily: 'sf-pro-display-bold', color: '#fff'}}>Work Done VS Planned </Text>
                        <Text style={{fontSize: 15, fontFamily: 'sf-pro-display-bold', color: '#fff'}}>(11)</Text>
                    </View>
                </View>
                <View style={{flex: 10}}>
                    <View style={{padding: 5, paddingLeft: 15, paddingRight: 15, rowGap: 15, borderBottomWidth: 1, borderColor: 'grey'}}>
                        <View style={{flexDirection: 'row', columnGap: 10, alignItems: 'center', height: 30}}>
                            <View>
                                <Text style={{fontSize: 15, fontFamily: 'sf-pro-display-bold', color: '#fff'}}>Chemistry</Text>
                            </View>
                            <View style={{backgroundColor: '#43464d', width: 150, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                                <Text style={{fontSize: 15, fontFamily: 'sf-pro-display-medium', color: '#fff'}}>25%  of  1hr 30m</Text>
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
                </View>
            </View>
        </View>
    </Modal>
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
})