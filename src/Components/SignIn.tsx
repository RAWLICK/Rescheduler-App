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
    Dimensions
  } from 'react-native';
import React from 'react'
import SignInIcon from '../Images/SignInIcon.png'

const SignIn = () => {
  return (
    <SafeAreaView>
    {/* <StatusBar
    animated={true}
    backgroundColor='#FFFFFF'
    // barStyle={statusBarStyle}
    // showHideTransition={statusBarTransition}
    // hidden={hidden}
    /> */}
    <View>
        {/* <Image style={{height: 250, width: 250}} source={PassKey}/> */}
        <Image style={{height: 250, width: 250}} source={SignInIcon}/>
        <Text style={{color: 'black', fontFamily: 'coolvetica rg', fontSize: 60}}>Rescheduler</Text>
    </View>
    </SafeAreaView>
  )
}

export default SignIn