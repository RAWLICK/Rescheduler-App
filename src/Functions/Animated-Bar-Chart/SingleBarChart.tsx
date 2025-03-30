import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BACKGROUND_COLOR, data } from './constants.ts'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type SingleBarChartProps = {
    value: number
}
export default function SingleBarChart(props: SingleBarChartProps) {
    const MAX_BAR_HEIGHT = 150;
    const animatedStyles = useAnimatedStyle(() => {
    return {
        height: withTiming(MAX_BAR_HEIGHT * props.value),
        opacity: withTiming(props.value),
    }
    }, [props.value]);
  return (
      <Animated.View style={[{width: 35, backgroundColor: 'white', margin: 7, borderRadius: 12}, animatedStyles]}>
      </Animated.View>
  )
}

const styles = StyleSheet.create({})