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
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux' 
import { StudentInfoDataType } from '../../app/Slice';
import { ScheduleArrayItem } from '../Screens/AddTiming';
import { ExistingSubjectsArrayItem } from '../../app/Slice';
import { addWholeScheduleArray, addWholeExistingSubjectsArray, addWholeStudentsDataArray, updateLocalStorageInfo, registerUserInfo
 } from '../../app/Slice';
import { addDays, set, subDays } from "date-fns";
import { CommonActions } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { nanoid } from "@reduxjs/toolkit";
import { RootState } from '../../app/Store';
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
  let fetched_StudentInfo: StudentInfoDataType | null = null
  let fetched_ScheduleArray: ScheduleArrayItem[] | null = null
  let fetched_ExistingSubjectsArray: ExistingSubjectsArrayItem[] | null = null
  let currentDate = new Date();
  let currentNumDate = currentDate.getDate().toString().padStart(2, '0');
  let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let currentYear = currentDate.getFullYear();
  let currentDateandMonth = `${currentNumDate}/${currentMonth}/${currentYear}`;
  const dispatch = useDispatch();
  let currentHourTime = currentDate.getHours();
  const navigation = useNavigation<NavigationProp<any, any>>();
  const [GmailLoading, setGmailLoading] = useState(false);
  const [AppleLoading, setAppleLoading] = useState(false);

  function TrialValidity() {
    const currentDate = new Date();
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
      return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
    };
    if (currentDate >= addDays(formatDate(fetched_StudentInfo?.["Date Joined"] || ''), 7) && fetched_StudentInfo?.["Subscription Type"] == "Free") {
    // if (currentDate >= addDays(formatDate("02/05/2025"), 7) && StudentInfoData["Subscription Type"] == "Free") {
      Alert.alert("Trial Ended", `Your 7 Days Trial Ended. Kindly Subscribe to continue`)
      return false;
    }
  }

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
    if (props.PhoneNumText == '0019') {
      // Fetching Demo Account Student Info
      try {
          const StudentInfoResponse = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/GetStudentInfo':'http://10.0.2.2:5000/GetStudentInfo',
          'https://rescheduler-server.onrender.com/GetStudentInfo',
          { 
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({
              "Value": props.PhoneNumText,
              "Type": "Phone Number"
          }), // Convert the request payload to JSON.
          })
          
          if (!StudentInfoResponse.ok) {  // Handle HTTP errors
            throw new Error('Failed to add data to the server');
          }
          fetched_StudentInfo = await StudentInfoResponse.json();
          // console.log("Fetched StudentInfo: ", fetched_StudentInfo)
          dispatch(registerUserInfo(fetched_StudentInfo))
          dispatch(updateLocalStorageInfo("Login"))
      } catch (error) {
          console.error('Catch Error: ', error);
          props.setLoading(false)
      }

      // Fetching Demo Account Schedule Array
      try {
          const ScheduleArrayResponse = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/GetScheduleArray':'http://192.168.31.141:5000/GetScheduleArray',
          'https://rescheduler-server.onrender.com/GetScheduleArray',
          { 
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({
              "Type": "Phone Number",
              "Value": props.PhoneNumText
          }), // Convert the request payload to JSON.
          })
          
          if (!ScheduleArrayResponse.ok) {  // Handle HTTP errors
            throw new Error('Failed to download data from the server');
          }
          // props.setLoading(false)
          fetched_ScheduleArray = await ScheduleArrayResponse.json();
          // console.log("Fetched ScheduleArray: ", fetched_ScheduleArray)
          dispatch(addWholeScheduleArray(fetched_ScheduleArray))
          // console.log("Student Signed In");
          // navigation.navigate('StackScreens', {screen: 'OnBoardingScreenStack'})
          
      } catch (error) {
          console.error('Catch Error: ', error);
          props.setLoading(false)
      }

      // Fetching Demo Account Existing Subjects Array
      try {
          const ExistingSubjectsResponse = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/GetExistingSubjectsArray':'http://192.168.31.141:5000/GetExistingSubjectsArray',
          'https://rescheduler-server.onrender.com/GetExistingSubjectsArray',
          { 
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({
              "Type": "Phone Number",
              "Value": props.PhoneNumText
          }), // Convert the request payload to JSON.
          })
          
          if (!ExistingSubjectsResponse.ok) {  // Handle HTTP errors
            throw new Error('Failed to download data from the server');
          }
          fetched_ExistingSubjectsArray = await ExistingSubjectsResponse.json();
          // console.log("Fetched ExistingSubjectsArray: ", fetched_ExistingSubjectsArray)
          dispatch(addWholeExistingSubjectsArray(fetched_ExistingSubjectsArray))

          // Fetching Library Students Info
          if (fetched_StudentInfo?.["Type of Account"] === "Distributor" || fetched_StudentInfo?.["Type of Account"] === "Admin") {
              try {
                  const LibraryStudentsResponse = await fetch(
                  // Platform.OS === 'ios'? 'http://localhost:5000/GetAllStudents':'http://192.168.31.141:5000/GetAllStudents',
                  'https://rescheduler-server.onrender.com/GetAllStudents',
                  { 
                  method: 'POST', // Specify the request method
                  headers: {
                      'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
                  },
                  body: JSON.stringify({ "Distribution ID": fetched_StudentInfo?.["Distribution ID"] }), // Convert the request payload to JSON.
                  })
                  
                  if (!LibraryStudentsResponse.ok) {  // Handle HTTP errors
                  throw new Error('Failed to download data from the server');
                  }
                  const fetched_LibraryStudentsResponse = await LibraryStudentsResponse.json();
                  // console.log("Fetched LibraryStudentsResponse: ", fetched_LibraryStudentsResponse)
                  dispatch(addWholeStudentsDataArray(fetched_LibraryStudentsResponse))
              
              } catch (error) {
                  console.error('Catch Error: ', error);
                  props.setLoading(false)
              }
          }
          console.log("Student Signed In");
          props.setLoading(false)
          
      } catch (error) {
          console.error('Catch Error: ', error);
          props.setLoading(false)
      }
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [
              {
                  name: 'DrawerScreens',
                  state: {
                      routes: [
                          {
                          name: 'TabsDrawer',
                          state: {
                              routes: [
                              {
                                  name: 'ScheduleTab',
                              },
                              ],
                          },
                          },
                      ],
                  },
              },
              ],
          })
      );
    }
    else {
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
              Alert.alert(
                "Register Yourself", "You are not registered yet.",
                [{ text: "Register Now" }]
              )
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
    }
  };

  const MatchEmail = async (Email: string) => {
    try {
        const response = await fetch(
        // Platform.OS === 'ios'? 'http://localhost:5000/MatchNumber':'http://192.168.31.141:5000/MatchNumber',
        'https://rescheduler-server.onrender.com/MatchEmail',
        {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
        },
        body: JSON.stringify(Email), // Convert the request payload to JSON.
        })

        if (!response.ok) {  // Handle HTTP errors
        throw new Error('Failed to fetch data from the server');
        }

        const fetched_data = await response.json(); // Parse JSON response
        props.setIsRegistered(fetched_data);
        console.log("Is Email Registred? : ", fetched_data)
        if (fetched_data === "true") {

          // Fetching Student Info
          try {
              const StudentInfoResponse = await fetch(
              // Platform.OS === 'ios'? 'http://localhost:5000/GetStudentInfo':'http://10.0.2.2:5000/GetStudentInfo',
              'https://rescheduler-server.onrender.com/GetStudentInfo',
              { 
                method: 'POST', // Specify the request method
                headers: {
                  'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
                },
                body: JSON.stringify({
                  "Value": Email,
                  "Type": "Email ID"
              }), // Convert the request payload to JSON.
              })
              
              if (!StudentInfoResponse.ok) {  // Handle HTTP errors
                throw new Error('Failed to add data to the server');
              }
              fetched_StudentInfo = await StudentInfoResponse.json();
              // console.log("Fetched StudentInfo: ", fetched_StudentInfo)
              dispatch(registerUserInfo(fetched_StudentInfo))
              
          } catch (error) {
              console.error('Catch Error: ', error);
          }

          // Fetching Schedule Array
          try {
              const ScheduleArrayResponse = await fetch(
              // Platform.OS === 'ios'? 'http://localhost:5000/GetScheduleArray':'http://192.168.31.141:5000/GetScheduleArray',
              'https://rescheduler-server.onrender.com/GetScheduleArray',
              { 
                method: 'POST', // Specify the request method
                headers: {
                  'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
                },
                body: JSON.stringify({
                  "Type": "Email ID",
                  "Value": Email
              }), // Convert the request payload to JSON.
              })
              
              if (!ScheduleArrayResponse.ok) {  // Handle HTTP errors
                throw new Error('Failed to download data from the server');
              }
              fetched_ScheduleArray = await ScheduleArrayResponse.json();
              console.log("Fetched ScheduleArray: ", fetched_ScheduleArray)
              dispatch(addWholeScheduleArray(fetched_ScheduleArray))
              // console.log("Student Signed In");
              // navigation.navigate('StackScreens', {screen: 'OnBoardingScreenStack'})
              
          } catch (error) {
              console.error('Catch Error: ', error);
              props.setLoading(false)
          }

          // Fetching Existing Subjects Array
          try {
              const ExistingSubjectsResponse = await fetch(
              // Platform.OS === 'ios'? 'http://localhost:5000/GetExistingSubjectsArray':'http://192.168.31.141:5000/GetExistingSubjectsArray',
              'https://rescheduler-server.onrender.com/GetExistingSubjectsArray',
              { 
                method: 'POST', // Specify the request method
                headers: {
                  'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
                },
                body: JSON.stringify({
                  "Type": "Email ID",
                  "Value": Email
              }), // Convert the request payload to JSON.
              })
              
              if (!ExistingSubjectsResponse.ok) {  // Handle HTTP errors
                throw new Error('Failed to download data from the server');
              }
              fetched_ExistingSubjectsArray = await ExistingSubjectsResponse.json();
              console.log("Fetched ExistingSubjectsArray: ", fetched_ExistingSubjectsArray)
              dispatch(addWholeExistingSubjectsArray(fetched_ExistingSubjectsArray))

              // Fetching Library Students Info
              if (fetched_StudentInfo?.["Type of Account"] === "Distributor" || fetched_StudentInfo?.["Type of Account"] === "Admin") {
                  try {
                      const LibraryStudentsResponse = await fetch(
                      // Platform.OS === 'ios'? 'http://localhost:5000/GetAllStudents':'http://192.168.31.141:5000/GetAllStudents',
                      'https://rescheduler-server.onrender.com/GetAllStudents',
                      { 
                      method: 'POST', // Specify the request method
                      headers: {
                          'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
                      },
                      body: JSON.stringify({ "Distribution ID": fetched_StudentInfo?.["Distribution ID"] }), // Convert the request payload to JSON.
                      })
                      
                      if (!LibraryStudentsResponse.ok) {  // Handle HTTP errors
                      throw new Error('Failed to download data from the server');
                      }
                      const fetched_LibraryStudentsResponse = await LibraryStudentsResponse.json();
                      // console.log("Fetched LibraryStudentsResponse: ", fetched_LibraryStudentsResponse)
                      dispatch(addWholeStudentsDataArray(fetched_LibraryStudentsResponse))
                  
                  } catch (error) {
                      console.error('Catch Error: ', error);
                      props.setLoading(false)
                  }
              }
              console.log("Student Signed In");
              
          } catch (error) {
              console.error('Catch Error: ', error);
          }

          if (fetched_ScheduleArray?.length === 0) {
              if (currentHourTime > 0 && currentHourTime < 6) {
                  let yesterdayDate = subDays(currentDate, 1);
                  let yesterdayNumDate = yesterdayDate.getDate().toString().padStart(2, '0');
                  let yesterdayMonth = (yesterdayDate.getMonth() + 1).toString().padStart(2, '0');
                  let yesterdayYear = yesterdayDate.getFullYear();
                  let yesterdayDateandMonth = `${yesterdayNumDate}/${yesterdayMonth}/${yesterdayYear}`;
                  const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "23:00",
                      "EndTime": "24:00",
                      "Work": "Hindi",
                      "StartAngle": 690,
                      "EndAngle": 720,
                      "TaskDate": yesterdayDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "01:00",
                      "EndTime": "02:00",
                      "Work": "Physics",
                      "StartAngle": 30,
                      "EndAngle": 60,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "03:00",
                      "EndTime": "04:00",
                      "Work": "Chemistry",
                      "StartAngle": 90,
                      "EndAngle": 120,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "05:00",
                      "EndTime": "06:00",
                      "Work": "Biology",
                      "StartAngle": 150,
                      "EndAngle": 180,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "06:00",
                      "EndTime": "07:00",
                      "Work": "History",
                      "StartAngle": 180,
                      "EndAngle": 210,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "07:00",
                      "EndTime": "08:00",
                      "Work": "English",
                      "StartAngle": 210,
                      "EndAngle": 240,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "09:00",
                      "EndTime": "10:00",
                      "Work": "Maths",
                      "StartAngle": 270,
                      "EndAngle": 300,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
                  ]
                  dispatch(addWholeScheduleArray(TestingSubjects))
              }
              else if (currentHourTime > 6 && currentHourTime < 12) {
                  const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "05:00",
                      "EndTime": "06:00",
                      "Work": "Physics",
                      "StartAngle": 150,
                      "EndAngle": 180,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "07:00",
                      "EndTime": "08:00",
                      "Work": "Chemistry",
                      "StartAngle": 210,
                      "EndAngle": 240,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "09:00",
                      "EndTime": "10:00",
                      "Work": "Biology",
                      "StartAngle": 270,
                      "EndAngle": 300,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "11:00",
                      "EndTime": "12:00",
                      "Work": "History",
                      "StartAngle": 330,
                      "EndAngle": 360,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "12:00",
                      "EndTime": "13:00",
                      "Work": "English",
                      "StartAngle": 360,
                      "EndAngle": 390,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "13:00",
                      "EndTime": "14:00",
                      "Work": "Maths",
                      "StartAngle": 390,
                      "EndAngle": 420,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "15:00",
                      "EndTime": "16:00",
                      "Work": "Hindi",
                      "StartAngle": 450,
                      "EndAngle": 480,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
                  ]
                  dispatch(addWholeScheduleArray(TestingSubjects))
              }
              else if (currentHourTime > 12 && currentHourTime < 18) {
                  const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "11:00",
                      "EndTime": "12:00",
                      "Work": "Physics",
                      "StartAngle": 330,
                      "EndAngle": 360,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "13:00",
                      "EndTime": "14:00",
                      "Work": "Chemistry",
                      "StartAngle": 390,
                      "EndAngle": 420,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "15:00",
                      "EndTime": "16:00",
                      "Work": "Biology",
                      "StartAngle": 450,
                      "EndAngle": 480,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "17:00",
                      "EndTime": "18:00",
                      "Work": "History",
                      "StartAngle": 510,
                      "EndAngle": 540,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "18:00",
                      "EndTime": "19:00",
                      "Work": "English",
                      "StartAngle": 540,
                      "EndAngle": 570,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "19:00",
                      "EndTime": "20:00",
                      "Work": "Maths",
                      "StartAngle": 570,
                      "EndAngle": 600,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "21:00",
                      "EndTime": "22:00",
                      "Work": "Hindi",
                      "StartAngle": 630,
                      "EndAngle": 660,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
                  ]
                  dispatch(addWholeScheduleArray(TestingSubjects))
              }
              else if (currentHourTime > 18 && currentHourTime < 24) {
                  let nextdayDate = addDays(currentDate, 1);
                  let nextdayNumDate = nextdayDate.getDate().toString().padStart(2, '0');
                  let nextdayMonth = (nextdayDate.getMonth() + 1).toString().padStart(2, '0');
                  let nextdayYear = nextdayDate.getFullYear();
                  let nextdayDateandMonth = `${nextdayNumDate}/${nextdayMonth}/${nextdayYear}`;
                  const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "17:00",
                      "EndTime": "18:00",
                      "Work": "Physics",
                      "StartAngle": 510,
                      "EndAngle": 540,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "19:00",
                      "EndTime": "20:00",
                      "Work": "Chemistry",
                      "StartAngle": 570,
                      "EndAngle": 600,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "21:00",
                      "EndTime": "22:00",
                      "Work": "Biology",
                      "StartAngle": 630,
                      "EndAngle": 660,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "23:00",
                      "EndTime": "24:00",
                      "Work": "History",
                      "StartAngle": 690,
                      "EndAngle": 720,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "00:00",
                      "EndTime": "01:00",
                      "Work": "English",
                      "StartAngle": 0,
                      "EndAngle": 30,
                      "TaskDate": nextdayDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "01:00",
                      "EndTime": "02:00",
                      "Work": "Maths",
                      "StartAngle": 30,
                      "EndAngle": 60,
                      "TaskDate": nextdayDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "03:00",
                      "EndTime": "04:00",
                      "Work": "Hindi",
                      "StartAngle": 90,
                      "EndAngle": 120,
                      "TaskDate": nextdayDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
                  ]
                  dispatch(addWholeScheduleArray(TestingSubjects))
              }
          }

          if (fetched_ExistingSubjectsArray?.length === 0) {
              const TestingStatsSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "Subject": "Physics",
                      "Current_Duration": "1h 0min",
                      "Dataframe": []
                  },
                  {
                      "uniqueID": nanoid(10),
                      "Subject": "Chemistry",
                      "Current_Duration": "1h 0min",
                      "Dataframe": []
                  },
                  {
                      "uniqueID": nanoid(10),
                      "Subject": "Maths",
                      "Current_Duration": "1h 0min",
                      "Dataframe": []
                  },
                  {
                      "uniqueID": nanoid(10),
                      "Subject": "History",
                      "Current_Duration": "1h 0min",
                      "Dataframe": []
                  }
              ]
              dispatch(addWholeExistingSubjectsArray(TestingStatsSubjects))
          }

          dispatch(updateLocalStorageInfo("Login"));

          // Resetting the navigation stack to SignInStack. Now the history of the previous screens will be cleared.
          // This is done to prevent the user from going back to the otp screens after logging in.
          // here state are nested navigtators
          // First come state and inside there are routes which then create new navigation stack
          // routes[0] is 'DrawerScreens', so it becomes the active root screen. It means: “Activate the first screen (at position 0) from the routes array.”
          if (TrialValidity() == false) {
              navigation.dispatch(
                  CommonActions.reset({
                      index: 0,
                      routes: [
                          {
                              name: 'DrawerScreens',
                              state: {
                                  routes: [
                                      {
                                          name: 'SubscriptionDrawer',
                                      },
                                  ],
                              },
                          },
                      ],
                  })
              );
          }
          else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                    {
                        name: 'DrawerScreens',
                        state: {
                            routes: [
                                {
                                name: 'TabsDrawer',
                                state: {
                                    routes: [
                                    {
                                        name: 'ScheduleTab',
                                    },
                                    ],
                                },
                                },
                            ],
                        },
                    },
                    ],
                })
            );
          }     
        }
        else if (fetched_data === "false") {
          let NewStudent = {
              "uniqueID": nanoid(),
              "Name": "",
              "Phone Number": "",
              "Date Joined": currentDateandMonth,
              "Email ID": Email,
              "Gender": "",
              "Streak": 1,
              "Subscription Type": "Free",
              "Distribution Name": "",
              "Distribution Branch": "",
              "Distribution ID": "",
              "City": "",
              "State": "",
              "Country": "",
              "Type of Account": "User",
              "RescheduledTimes": 0
          }
          try {
            const response = await fetch(
              // Platform.OS === 'ios'? 'http://localhost:5000/AddStudent':'http://10.0.2.2:5000/AddStudent',
              'https://rescheduler-server.onrender.com/AddStudent',
              { 
              method: 'POST', // Specify the request method
              headers: {
                'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
              },
              body: JSON.stringify(NewStudent), // Convert the request payload to JSON.
            })
      
            if (!response.ok) {  // Handle HTTP errors
              throw new Error('Failed to add data to the server');
            }
            const fetched_data = await response.json();
            console.log("Fetched Data: ", fetched_data)
            dispatch(registerUserInfo(NewStudent))
            if (currentHourTime > 0 && currentHourTime < 6) {
              let yesterdayDate = subDays(currentDate, 1);
              let yesterdayNumDate = yesterdayDate.getDate().toString().padStart(2, '0');
              let yesterdayMonth = (yesterdayDate.getMonth() + 1).toString().padStart(2, '0');
              let yesterdayYear = yesterdayDate.getFullYear();
              let yesterdayDateandMonth = `${yesterdayNumDate}/${yesterdayMonth}/${yesterdayYear}`;
              const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "23:00",
                      "EndTime": "24:00",
                      "Work": "Hindi",
                      "StartAngle": 690,
                      "EndAngle": 720,
                      "TaskDate": yesterdayDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "01:00",
                      "EndTime": "02:00",
                      "Work": "Physics",
                      "StartAngle": 30,
                      "EndAngle": 60,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "03:00",
                      "EndTime": "04:00",
                      "Work": "Chemistry",
                      "StartAngle": 90,
                      "EndAngle": 120,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "05:00",
                      "EndTime": "06:00",
                      "Work": "Biology",
                      "StartAngle": 150,
                      "EndAngle": 180,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "06:00",
                      "EndTime": "07:00",
                      "Work": "History",
                      "StartAngle": 180,
                      "EndAngle": 210,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "07:00",
                      "EndTime": "08:00",
                      "Work": "English",
                      "StartAngle": 210,
                      "EndAngle": 240,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "09:00",
                      "EndTime": "10:00",
                      "Work": "Maths",
                      "StartAngle": 270,
                      "EndAngle": 300,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
              ]
              dispatch(addWholeScheduleArray(TestingSubjects))
            }
            else if (currentHourTime > 6 && currentHourTime < 12) {
              const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "05:00",
                      "EndTime": "06:00",
                      "Work": "Physics",
                      "StartAngle": 150,
                      "EndAngle": 180,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "07:00",
                      "EndTime": "08:00",
                      "Work": "Chemistry",
                      "StartAngle": 210,
                      "EndAngle": 240,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "09:00",
                      "EndTime": "10:00",
                      "Work": "Biology",
                      "StartAngle": 270,
                      "EndAngle": 300,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "11:00",
                      "EndTime": "12:00",
                      "Work": "History",
                      "StartAngle": 330,
                      "EndAngle": 360,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "12:00",
                      "EndTime": "13:00",
                      "Work": "English",
                      "StartAngle": 360,
                      "EndAngle": 390,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "13:00",
                      "EndTime": "14:00",
                      "Work": "Maths",
                      "StartAngle": 390,
                      "EndAngle": 420,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "15:00",
                      "EndTime": "16:00",
                      "Work": "Hindi",
                      "StartAngle": 450,
                      "EndAngle": 480,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
              ]
              dispatch(addWholeScheduleArray(TestingSubjects))
            }
            else if (currentHourTime > 12 && currentHourTime < 18) {
              const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "11:00",
                      "EndTime": "12:00",
                      "Work": "Physics",
                      "StartAngle": 330,
                      "EndAngle": 360,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "13:00",
                      "EndTime": "14:00",
                      "Work": "Chemistry",
                      "StartAngle": 390,
                      "EndAngle": 420,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "15:00",
                      "EndTime": "16:00",
                      "Work": "Biology",
                      "StartAngle": 450,
                      "EndAngle": 480,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "17:00",
                      "EndTime": "18:00",
                      "Work": "History",
                      "StartAngle": 510,
                      "EndAngle": 540,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "18:00",
                      "EndTime": "19:00",
                      "Work": "English",
                      "StartAngle": 540,
                      "EndAngle": 570,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "19:00",
                      "EndTime": "20:00",
                      "Work": "Maths",
                      "StartAngle": 570,
                      "EndAngle": 600,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "21:00",
                      "EndTime": "22:00",
                      "Work": "Hindi",
                      "StartAngle": 630,
                      "EndAngle": 660,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
              ]
              dispatch(addWholeScheduleArray(TestingSubjects))
            }
            else if (currentHourTime > 18 && currentHourTime < 24) {
              let nextdayDate = addDays(currentDate, 1);
              let nextdayNumDate = nextdayDate.getDate().toString().padStart(2, '0');
              let nextdayMonth = (nextdayDate.getMonth() + 1).toString().padStart(2, '0');
              let nextdayYear = nextdayDate.getFullYear();
              let nextdayDateandMonth = `${nextdayNumDate}/${nextdayMonth}/${nextdayYear}`;
              const TestingSubjects = [
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "17:00",
                      "EndTime": "18:00",
                      "Work": "Physics",
                      "StartAngle": 510,
                      "EndAngle": 540,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(175, 193, 85, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "19:00",
                      "EndTime": "20:00",
                      "Work": "Chemistry",
                      "StartAngle": 570,
                      "EndAngle": 600,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(182, 108, 239, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "21:00",
                      "EndTime": "22:00",
                      "Work": "Biology",
                      "StartAngle": 630,
                      "EndAngle": 660,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(78, 161, 40, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "23:00",
                      "EndTime": "24:00",
                      "Work": "History",
                      "StartAngle": 690,
                      "EndAngle": 720,
                      "TaskDate": currentDateandMonth,
                      "Slice_Color": "rgba(71, 214, 63, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "00:00",
                      "EndTime": "01:00",
                      "Work": "English",
                      "StartAngle": 0,
                      "EndAngle": 30,
                      "TaskDate": nextdayDateandMonth,
                      "Slice_Color": "rgba(19, 249, 16, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "01:00",
                      "EndTime": "02:00",
                      "Work": "Maths",
                      "StartAngle": 30,
                      "EndAngle": 60,
                      "TaskDate": nextdayDateandMonth,
                      "Slice_Color": "rgba(69, 221, 118, 0.5)"
                  },
                  {
                      "uniqueID": nanoid(10),
                      "StartTime": "03:00",
                      "EndTime": "04:00",
                      "Work": "Hindi",
                      "StartAngle": 90,
                      "EndAngle": 120,
                      "TaskDate": nextdayDateandMonth,
                      "Slice_Color": "rgba(17, 150, 214, 0.5) "
                  }
              ]
              dispatch(addWholeScheduleArray(TestingSubjects))
            }
            const TestingStatsSubjects = [
              {
                  "uniqueID": nanoid(10),
                  "Subject": "Physics",
                  "Current_Duration": "1h 0min",
                  "Dataframe": []
              },
              {
                  "uniqueID": nanoid(10),
                  "Subject": "Chemistry",
                  "Current_Duration": "1h 0min",
                  "Dataframe": []
              },
              {
                  "uniqueID": nanoid(10),
                  "Subject": "Maths",
                  "Current_Duration": "1h 0min",
                  "Dataframe": []
              },
              {
                  "uniqueID": nanoid(10),
                  "Subject": "History",
                  "Current_Duration": "1h 0min",
                  "Dataframe": []
              }
            ]
            dispatch(addWholeExistingSubjectsArray(TestingStatsSubjects))
            console.log("Student Registered");
            dispatch(updateLocalStorageInfo("Login"));
            // Resetting the navigation stack to SignInStack. Now the history of the previous screens will be cleared.
              // This is done to prevent the user from going back to the otp screens after logging in.
              // here state are nested navigtators
              // First come state and inside there are routes which then create new navigation stack
              // routes[0] is 'DrawerScreens', so it becomes the active root screen. It means: “Activate the first screen (at position 0) from the routes array.”
            navigation.dispatch(
              CommonActions.reset({
                  index: 0,
                  routes: [
                  {
                      name: 'DrawerScreens',
                      state: {
                          routes: [
                              {
                              name: 'TabsDrawer',
                              state: {
                                  routes: [
                                  {
                                      name: 'ScheduleTab',
                                  },
                                  ],
                              },
                              },
                          ],
                      },
                  },
                  ],
              })
          );
          } catch (error) {
            console.error('Catch Error: ', error);
          }
        }
        else {
          console.log("Invalid Response from Server");
        }
    } catch (error) {
      console.error('Catch Error: ', error);
      console.log("Failed to connect to the backend");
    }
  };

  const {authorize, clearSession, user, getCredentials, error, isLoading} = useAuth0();

  const GoogleLogin = async () => {
    setGmailLoading(true);
    try {
      const credentials = await auth0Mail.webAuth.authorize({
        scope: 'openid profile email',
        // audience: 'https://YOUR_DOMAIN.auth0.com/userinfo',
        redirectUri:
        Platform.OS === 'ios'
          ? 'com.rescheduler://dev-ohpipjjs64tqo7j8.us.auth0.com/ios/com.rescheduler/callback'
          : 
          'https://dev-ohpipjjs64tqo7j8.us.auth0.com/android/com.rescheduler/callback', // <-- Match exactly
          // 'com.rescheduler://dev-ohpipjjs64tqo7j8.us.auth0.com/android/com.rescheduler/callback', // <-- Match exactly          

        connection: 'google-oauth2'
      });

      console.log("ID Token:", credentials.idToken);
      console.log("Access Token:", credentials.accessToken);
      if (credentials.idToken) {
        const userInfo: any = jwtDecode(credentials.idToken); // idToken from Auth0
        console.log(userInfo);
        await MatchEmail(userInfo.email);
        setGmailLoading(false);
      }
    } catch (error) {
      console.error("Login error", error);
      setGmailLoading(false);
    }
  };

  const AppleLogin = async () => {
    Alert.alert("Apple Server Down", "Apple Login Services are still down. Please use Google Login.");
    // setAppleLoading(true);
    // try {
    //   const credentials = await auth0Mail.webAuth.authorize({
    //     scope: 'openid profile email',
    //     // audience: 'https://YOUR_DOMAIN.auth0.com/userinfo',
    //     redirectUri:
    //     Platform.OS === 'ios'
    //       ? 'com.rescheduler://dev-ohpipjjs64tqo7j8.us.auth0.com/ios/com.rescheduler/callback'
    //       : 'https://dev-ohpipjjs64tqo7j8.us.auth0.com/android/com.rescheduler/callback', // <-- Match exactly
    //     connection: 'apple'
    //   });

    //   console.log("ID Token:", credentials.idToken);
    //   console.log("Access Token:", credentials.accessToken);
    //   if (credentials.idToken) {
    //     const userInfo: any = jwtDecode(credentials.idToken); // idToken from Auth0
    //     console.log(userInfo);
    //     await MatchEmail(userInfo.email);
    //     setAppleLoading(false);
    //   }

    //   // You can store these in Redux, AsyncStorage, etc.
    // } catch (error) {
    //   console.error("Login error", error);
    //   setAppleLoading(false);
    // }
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
        {/* <View>
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
            { GmailLoading ? 
            <View style={{height: 50, flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, elevation: 3,
            shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white',
            }}>
                <ActivityIndicator size="small" color="black" />
            </View>
            :
            <TouchableOpacity style={{height: 50, flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, elevation: 3,
            shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white',
            }} onPress={GoogleLogin}>
                <Image source={GoogleIcon} style={{width: 25, height: 25, alignSelf: 'center'}}/>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: 'black'}}>Continue With Google</Text>
            </TouchableOpacity>
            }
            { AppleLoading ? 
            <View style={{height: 50, flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, elevation: 3,
            shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white'
            }}>
                <ActivityIndicator size="small" color="black"/>
            </View>
            :
            <TouchableOpacity style={{height: 50, flexDirection: 'row', borderWidth: 1, borderColor: '#c2c0c7', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center', columnGap: 15, elevation: 3,
            shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2, backgroundColor: 'white'
            }} onPress={AppleLogin} >
                <Image source={AppleIcon} style={{width: 25, height: 25, alignSelf: 'center'}}/>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: 'black'}}>Continue With Apple</Text>
            </TouchableOpacity>
            }
          </View>
          }
          { !props.PhoneNumberSelected && 
          <View style={styles.OrSpacingBox}>
            <Text style={styles.OrSpacingText}>OR</Text>
          </View>
          }
          { !props.PhoneNumberSelected && 
          <TouchableOpacity style={[styles.RegisterNewUserBox, {backgroundColor: 'orange', elevation: 0}]} onPress={PhoneNumberClicked}>
            <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 16,
            color: 'white'}}>Continue With Phone Number</Text>
          </TouchableOpacity> 
          }
        </View> */}
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
  const [PhoneNumberSelected, setPhoneNumberSelected] = useState(true)
  const navigation = useNavigation<NavigationProp<any, any>>();
  const LocalStorageInfo = useSelector((state: RootState) => state.LocalStorageInfoSliceReducer.LocalStorageInfoInitialState)
  
  function CloseKeyboard() {
    if (PhoneNumText.length === 10) {
      Keyboard.dismiss();
    }
  }

  useEffect(() => {
    CloseKeyboard()
  }, [PhoneNumText])

  useEffect(() => {
    if (LocalStorageInfo["IsFirstLaunch"] == true) {
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [
                  {
                      name: 'StackScreens',
                      state: {
                          routes: [
                              {
                                  name: 'OnBoardingScreenStack',
                              },
                          ],
                      },
                  },
              ],
          })
      );
    }
  }, [])
  
  return (
    <KeyboardAvoidingView 
    style={{flex: 1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
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
    shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 2
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
