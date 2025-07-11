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
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import SignInIcon from '../Images/SignInIcon.png';
import LinearGradient from 'react-native-linear-gradient';
import SignInDoodleImage from '../Images/SignInDoodle.png';
import GoogleIcon from '../Images/GoogleIcon.png';
import AppleIcon from '../Images/AppleIcon.png';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Auth0 from 'react-native-auth0';
import jwtDecode from 'jwt-decode';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
const { width, height } = Dimensions.get('window');

type LogoSectionPropsType = {};

type CredentialInputScreenPropsType = {
  PhoneNumberSelected: boolean;
  setPhoneNumberSelected: React.Dispatch<React.SetStateAction<boolean>>;
  PhoneNumText: string | undefined;
  setPhoneNumText: React.Dispatch<React.SetStateAction<string>>;
  IsRegistered: string | undefined;
  setIsRegistered: React.Dispatch<React.SetStateAction<string>>;
  Loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

  // For Twilio(Phone Number Authentication)
  const auth0Number = new Auth0({
    domain: 'dev-euawlucdljtesr0z.us.auth0.com',
    clientId: 'MgGS4kNAn4YSeC5lqwlJ9bM3hcCk7Cus',
  }); 
  
  // For Auth0(Email Authentication)
  const auth0Mail = new Auth0({
    domain: 'dev-ohpipjjs64tqo7j8.us.auth0.com',
    clientId: 'nRmEpjXepZqDx39ScNB3qqpGJ5w7ErRg',
  });


  const MatchNumber = async () => {
    try {
        props.setLoading(true)
        const response = await fetch(
        // Platform.OS === 'ios'? 'http://localhost:5000/MatchNumber':'http://192.168.31.141:5000/MatchNumber',
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
        props.setLoading(false)
        console.log("Is Number Registred? : ", fetched_data)
        if (fetched_data === "true") {
          await auth0Number.auth.passwordlessWithSMS({
            phoneNumber: `+91${props.PhoneNumText}`,
            send: 'code',
          });
          console.log(`OTP Sent to +91${props.PhoneNumText}`)
          navigation.navigate('StackScreens', { screen: 'OtpVerificationStack', params: { Process: 'SignIn', PhoneNumber: props.PhoneNumText } });
        } else if (fetched_data === "false") {
            if (Platform.OS === 'android') {
              Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Register Yourself',
                textBody: "You are not registered yet. Please register yourself first.",
                button: 'Register Now',
              })
            }
            else if (Platform.OS === 'ios') {
              Alert.alert(
                "Register Yourself", "You are not registered yet.",
                [{ text: "Register Now" }]
              )
            }
            navigation.navigate('StackScreens', { screen: 'SignUpStack' });
        } else {
            console.log("Invalid Response from Server");
        }
    } catch (error) {
      props.setLoading(false)
        console.error('Catch Error: ', error);
        console.log("Failed to connect to the backend");
    }
  };

  const GoogleLogin = async () => {
    try {
      const credentials = await auth0Mail.webAuth.authorize({
        scope: 'openid profile email',
        // audience: 'https://YOUR_DOMAIN.auth0.com/userinfo',
        redirectUri:
        Platform.OS === 'ios'
          ? 'com.rescheduler://dev-ohpipjjs64tqo7j8.us.auth0.com/callback'
          : 'https://dev-ohpipjjs64tqo7j8.us.auth0.com/android/com.rescheduler/callback', // <-- Match exactly
        connection: 'google-oauth2'
      });

      console.log("ID Token:", credentials.idToken);
      console.log("Access Token:", credentials.accessToken);

      // You can store these in Redux, AsyncStorage, etc.
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const AppleLogin = async () => {
    try {
      const credentials = await auth0Mail.webAuth.authorize({
        scope: 'openid profile email',
        // audience: 'https://YOUR_DOMAIN.auth0.com/userinfo',
        redirectUri:
        Platform.OS === 'ios'
          ? 'com.rescheduler://dev-ohpipjjs64tqo7j8.us.auth0.com/callback'
          : 'https://dev-ohpipjjs64tqo7j8.us.auth0.com/android/com.rescheduler/callback', // <-- Match exactly
        connection: 'apple'
      });

      console.log("ID Token:", credentials.idToken);
      console.log("Access Token:", credentials.accessToken);

      // You can store these in Redux, AsyncStorage, etc.
    } catch (error) {
      console.error("Login error", error);
    }
  };

  function PhoneNumberClicked() {
    props.setPhoneNumberSelected(true)
  }
  
  return (
    <View style={{flex: 0.5, backgroundColor: '#ab7be9'}}>
      <View style={styles.RoundedBox}>
        <View style={[styles.MotiveHeadingBox]}>
          <Text style={styles.MotiveHeading}>Sign In</Text>
        </View>
        <View>
          { props.PhoneNumberSelected && 
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white'}} onPress={() => props.setPhoneNumberSelected(false)}>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: 'black'}}>Continue With </Text>
              <Image source={GoogleIcon} style={{width: 25, height: 25, alignSelf: 'center'}}/>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: 'black'}}>| </Text>
              <Image source={AppleIcon} style={{width: 25, height: 25, alignSelf: 'center'}}/>
          </TouchableOpacity>
          }
          { !props.PhoneNumberSelected && 
          <View>
            <TouchableOpacity style={{height: 50, flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, elevation: 3,
            shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white',
            }} onPress={GoogleLogin}>
                <Image source={GoogleIcon} style={{width: 25, height: 25, alignSelf: 'center'}}/>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: 'black'}}>Continue With Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{height: 50, flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, elevation: 3,
            shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white'
            }} onPress={AppleLogin} >
                <Image source={AppleIcon} style={{width: 25, height: 25, alignSelf: 'center'}}/>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: 'black'}}>Continue With Apple</Text>
            </TouchableOpacity>
          </View>
          }
          { !props.PhoneNumberSelected && 
          <View style={styles.OrSpacingBox}>
            <Text style={styles.OrSpacingText}>OR</Text>
          </View>
          }
          { !props.PhoneNumberSelected && 
          <TouchableOpacity style={[styles.RegisterNewUserBox, {backgroundColor: 'orange'}]} onPress={PhoneNumberClicked}>
            <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 16,
            color: 'white'}}>Continue With Phone Number</Text>
          </TouchableOpacity> 
          }
        </View>
        { props.PhoneNumberSelected &&
        <View>
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

            {props.Loading? 
            <View style={styles.ContinueBox}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
            :
            <TouchableOpacity style={styles.ContinueBox} onPress={MatchNumber}>
              <Text style={styles.ContinueText}>Continue</Text>
            </TouchableOpacity>
            }
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
      }
      </View>
    </View>
  );
};

const SignIn = () => {
  const [PhoneNumText, setPhoneNumText] = useState('');
  const [IsRegistered, setIsRegistered] = useState("")
  const [Loading, setLoading] = useState(false)
  const [PhoneNumberSelected, setPhoneNumberSelected] = useState(false)
  
  function CloseKeyboard() {
    if (PhoneNumText.length === 10) {
      Keyboard.dismiss();
    }
  }

  useEffect(() => {
    CloseKeyboard()
  }, [PhoneNumText])
  
  return (
    <KeyboardAvoidingView 
    style={{flex: 1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* <StatusBar>
      animated={true}
      backgroundColor='#FFFFFF'
      // barStyle={statusBarStyle}
      // showHideTransition={statusBarTransition}
      // hidden={hidden}
      /> */}
      <View style={{flex: 1}}>
        <LogoSection/>
        <CredentialInputSection
          PhoneNumberSelected={PhoneNumberSelected}
          setPhoneNumberSelected={setPhoneNumberSelected}
          IsRegistered={IsRegistered}
          setIsRegistered={setIsRegistered}
          PhoneNumText={PhoneNumText}
          setPhoneNumText={setPhoneNumText}
          Loading={Loading}
          setLoading={setLoading}
        />
      </View>
    </KeyboardAvoidingView>
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
    color: 'black',
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
    alignItems: 'center'
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
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium',
    color: 'black'
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
