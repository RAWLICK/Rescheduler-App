import React from 'react'
import { useState, useEffect, memo, useRef, useCallback } from 'react';
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  clamp,
  runOnJS,
  withSpring
} from 'react-native-reanimated';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type ReactCompTwoProps = {
  navigation: StackNavigationProp<
  { 
    RoughComp: { parentParam: string, secondParam: number },
    RoughCompTwo: undefined;
  },
  'RoughCompTwo'>
}

const RoughComponentTwo: React.FC<ReactCompTwoProps> = () => {
  const [PercentageArray, setPercentageArray] = useState<number[]>([38, 67])
  const navigation = useNavigation<NavigationProp<any, any>>();
  console.log("RoughComponent 2 is re-rendering")
  useEffect(() => {
    console.log("Percentage Array: ", PercentageArray)
  }, [PercentageArray])
  return (
    <View style={styles.mainPage}>
      <View style={styles.TitleArea}>
        <Text style={{color: 'black'}}>RoughComponent Two</Text>
      </View>
      <View style={styles.ButtonArea}>
        <Button title='Move back' 
        // onPress={()=> navigation.navigate('RoughComp', { parentParam: 'Bitches Come and Go', secondParam: 18 })}
        // onPress={()=> setPercentageArray((prev) => [...prev, 111])}
        onPress={()=> runOnJS(setPercentageArray)((prev) => [...prev, 111])}
        />
      </View>
    </View>
  )
}

export default RoughComponentTwo

const styles = StyleSheet.create({
    mainPage : {
     flex: 1, 
     justifyContent: 'center', 
     alignItems:'center'
    },

    TitleArea: {
        margin: 10
    },

    ButtonArea: {
        margin: 10
    }
})