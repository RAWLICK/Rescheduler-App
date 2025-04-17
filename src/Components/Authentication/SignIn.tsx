import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  SafeAreaView
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import SignInIcon from '../Images/SignInIcon.png';
import LinearGradient from 'react-native-linear-gradient';
import SignInDoodleImage from '../Images/SignInDoodle.png';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
const { width, height } = Dimensions.get('window');

type LogoSectionPropsType = {};

type CredentialInputScreenPropsType = {
  PhoneNumText: string | undefined;
  setPhoneNumText: React.Dispatch<React.SetStateAction<string>>;
  IsRegistered: string | undefined;
  setIsRegistered: React.Dispatch<React.SetStateAction<string>>;
};

const LogoSection = () => {
  return (
    <LinearGradient colors={['#ffffff', '#ab7be9']} style={{flex: 0.5}}>
      <ImageBackground
        source={SignInDoodleImage}
        style={[styles.ImageBackgroundViewStyle]}
        imageStyle={{opacity: 0.1}}>
        <View style={[styles.LogoSectionTextBox]}>
          <View style={[styles.LogoSectionHeadingBox]}>
            <Text style={[styles.HeadingText, {color: '#a032d3'}]}>Re</Text>
            <Text style={[styles.HeadingText, {color: 'black'}]}>
              scheduler
            </Text>
          </View>
          <Text style={[styles.SubHeadingText]}>
            Imperfection is the new Perfection
          </Text>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

const CredentialInputSection = (props: CredentialInputScreenPropsType) => {
  const navigation = useNavigation<NavigationProp<any, any>>();
  const MatchNumber = async () => {
    try {
        const response = await fetch(
        // Platform.OS === 'ios'? 'http://localhost:5000/MatchNumber':'http://10.0.2.2:5000/MatchNumber',
        'https://rescheduler-server.onrender.com/MatchNumber',
        {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
        },
        body: JSON.stringify(props.PhoneNumText), // Convert the request payload to JSON.
        })

        if (!response.ok) {  // Handle HTTP errors
        throw new Error('Failed to fetch data from the server');
        }

        const fetched_data = await response.json(); // Parse JSON response
        props.setIsRegistered(fetched_data);
        console.log("Is Number Registred? : ", fetched_data)
        if (fetched_data === "true") {
            navigation.navigate('StackScreens', { screen: 'OtpVerificationStack', params: { Process: 'SignIn', PhoneNumber: props.PhoneNumText } });
        } else if (fetched_data === "false") {
            navigation.navigate('StackScreens', { screen: 'SignUpStack' });
        } else {
            console.log("Invalid Response from Server");
        }
    } catch (error) {
        console.error('Catch Error: ', error);
        console.log("Failed to connect to the backend");
    }
  };
  return (
    <View style={{flex: 0.5, backgroundColor: '#ab7be9'}}>
      <View style={styles.RoundedBox}>
        <View style={[styles.MotiveHeadingBox]}>
          <Text style={styles.MotiveHeading}>Sign In</Text>
        </View>
        <View style={styles.CredentialBox}>
          <View style={styles.PhoneNumberBox}>
            <TouchableOpacity style={styles.CountryCodeBox}>
              <Text style={styles.CountryCodeText}>+91</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.PhoneNumberText}
              placeholder="Phone Number"
              placeholderTextColor="#c2c0c7"
              keyboardType="numeric"
              value={props.PhoneNumText}
              onChangeText={props.setPhoneNumText}
            />
          </View>

          <TouchableOpacity style={styles.ContinueBox} onPress={MatchNumber}>
            <Text style={styles.ContinueText}>Continue</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.OrSpacingBox}>
            <Text style={styles.OrSpacingText}>OR</Text>
          </View>
          <TouchableOpacity style={styles.RegisterNewUserBox} onPress={()=> navigation.navigate('StackScreens', { screen: 'SignUpStack'})}>
            <Text style={styles.RegisterNewUserText}>Register New User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const SignIn = () => {
  const [PhoneNumText, setPhoneNumText] = useState('');
  const [IsRegistered, setIsRegistered] = useState("")
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
        <LogoSection />
        <CredentialInputSection
          IsRegistered={IsRegistered}
          setIsRegistered={setIsRegistered}
          PhoneNumText={PhoneNumText}
          setPhoneNumText={setPhoneNumText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  RegisterNewUserText: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    fontSize: 17,
    color: 'black',
  },
  RegisterNewUserBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#c096ea',
    elevation: 3,
  },
  OrSpacingText: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    fontSize: 15,
  },
  OrSpacingBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginBottom: 10,
  },
  ContinueText: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    color: 'white',
    fontSize: 19,
  },
  ContinueBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 10,
    height: 50,
  },
  PhoneNumberText: {
    flex: 0.85,
    paddingLeft: 20,
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    fontSize: 17,
    color: 'black'
  },
  CountryCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    color: 'black',
    fontSize: 17,
  },
  CountryCodeBox: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'grey',
  },
  PhoneNumberBox: {
    borderColor: '#c2c0c7',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    height: 50
  },
  CredentialBox: {marginBottom: 10},
  MotiveHeading: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
    color: 'grey',
    fontSize: 20,
  },
  ImageBackgroundViewStyle: {
    flex: 1,
    alignItems: 'center',
  },

  LogoSectionTextBox: {
    marginTop: height * 0.3,
    alignItems: 'center',
  },

  LogoSectionHeadingBox: {
    flexDirection: 'row',
  },

  HeadingText: {
    fontFamily: Platform.OS === 'ios' ? 'CoolveticaRg-Regular' : 'coolvetica rg',
    fontSize: 60,
    marginBottom: 5,
  },

  SubHeadingText: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium'
  },

  RoundedBox: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#ded8e3',
  },

  MotiveHeadingBox: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  blurStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
});

export default SignIn;
