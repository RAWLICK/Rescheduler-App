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
    Dimensions,
    TextInput
  } from 'react-native';
import React from 'react'
import { useState } from 'react';
import SignInIcon from '../Images/SignInIcon.png'
import LinearGradient from 'react-native-linear-gradient';

type LogoSectionPropsType = {
  
}

const LogoSection = () => {
  return (
    <LinearGradient colors={['#ffffff', '#ab7be9']} style={{flex: 0.5, alignItems: 'center'}}>
      <View style={{marginTop: 250, alignItems: 'center'}}>
          <Text style={{color: 'black', fontFamily: 'coolvetica rg', fontSize: 60, marginBottom: 5}}>Rescheduler</Text>
          <Text style={{fontFamily: 'sf-pro-display-medium'}}>Imperfection is the new Perfection</Text> 
      </View>
    </LinearGradient>
  );
};

type CredentialInputScreenPropsType = {
  PhoneNumText: string | undefined,
  setPhoneNumText: React.Dispatch<React.SetStateAction<string>>
}

const CredentialInputSection = (props: CredentialInputScreenPropsType) => {
  return (
    <View style={{flex: 0.5, padding: 20}}>
      <View style={{}}>
        <View style={{borderColor: '#c2c0c7', borderWidth: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
          <TouchableOpacity style={{flex: 0.15, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: 'grey'}}>
            <Text style={{fontFamily: 'sf-pro-display-bold', color: 'black', fontSize: 17}}>+91</Text>
          </TouchableOpacity>
          <TextInput style={{flex: 0.85, paddingLeft: 20, fontFamily: 'sf-pro-display-bold', fontSize: 17}} placeholder='Phone Number' placeholderTextColor='#c2c0c7' keyboardType='numeric' value={props.PhoneNumText} onChangeText={props.setPhoneNumText}/>
        </View>

        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange', borderRadius: 10, height: 50}}>
          <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 19}}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SignIn = () => {
  const [PhoneNumText, setPhoneNumText] = useState('')
  return (
    <SafeAreaView style={{flex: 1}}>
    {/* <StatusBar>
    animated={true}
    backgroundColor='#FFFFFF'
    // barStyle={statusBarStyle}
    // showHideTransition={statusBarTransition}
    // hidden={hidden}
    /> */}
    <View style={{flex: 1}}>
        <LogoSection/>
        <CredentialInputSection PhoneNumText={PhoneNumText} setPhoneNumText={setPhoneNumText}/>
    </View>
    </SafeAreaView>
  )
}

export default SignIn