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
import Video from 'react-native-video';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import ConsitencyVideo from '../Images/Consistensy_Video.mp4'
const { height, width } = Dimensions.get("window");


type TestingPropsType = {
  TestingHeading: string
  TestingButton: () => void
}
const Testing = (props: TestingPropsType) => {
  return (
    <Modal visible={false}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{height: 100, width: 300, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{margin: 5}}>
            <Text>{props.TestingHeading}</Text>
          </View>
          <View>
            <Button title='Testing Button' onPress={props.TestingButton}/>
          </View>
        </View>
        </View>
    </Modal>
  );
};

type RoughCompProps = {
  route: RouteProp<
  {
    RoughComp: { parentParam: string, secondParam: number },
    RoughCompTwo: undefined;
  },
  'RoughComp'>;
};

const RoughComponent: React.FC<RoughCompProps> = ({ route }) => {
  const { parentParam, secondParam } = route.params ?? '';

  const [TestingHeading, setTestingHeading] = useState("Fuck Off")
  const navigation = useNavigation<NavigationProp<any, any>>();
  console.log("Rough Component is re-rendering");

  function TestingButton () {
    TestingHeading == "Fuck Off" && setTestingHeading('Fuck You Off To');
    TestingHeading == "Fuck You Off To" && setTestingHeading('Fuck Off');
  }

  return (
    <View style={styles.mainPage}>
      {/* <View style={styles.TitleArea}>
        <Text style={{color: 'black'}}>RoughComponent</Text>
        <Text style={{color: 'black'}}>Imported Value: {parentParam}</Text>
        <Text style={{color: 'black'}}>Imported Number: {secondParam}</Text>
      </View>

      <Testing TestingHeading={TestingHeading} TestingButton={TestingButton}/>

      <View style={styles.ButtonArea}>
        <Button title='Move to RoughComp2' onPress={()=> navigation.navigate('StackScreens', {screen: 'RoughCompTwo'})}/>
      </View> */}
      <Video source={{uri: ConsitencyVideo}}
       style={styles.VideoStyle}   // ✅ fill screen like reels
        muted={false}
        controls={false}    // hide controls for reels effect
        playWhenInactive={false}
        playInBackground={false}
       />
    </View>
  )
}

export default RoughComponent

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
  },
  
  VideoStyle: {
    ...StyleSheet.absoluteFillObject, // makes video cover entire screen
    width: width,
    height: height, 
  }
})