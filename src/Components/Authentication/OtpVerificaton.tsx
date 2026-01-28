import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import OtpVerificationImage from '../Images/OtpVerificationImage.png'
import ChevronLeftBlack from '../Images/ChevronLeftBlack.png'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { CombinedRouteProp } from '../../App';
import { OtpInput } from "react-native-otp-entry";
import { nanoid } from "@reduxjs/toolkit";
import { useState, useEffect } from 'react';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux' 
import { registerUserInfo } from '../../app/Slice';
import { addWholeScheduleArray, addWholeExistingSubjectsArray, addWholeStudentsDataArray, updateLocalStorageInfo
} from '../../app/Slice';
import { RootState } from '../../app/Store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Auth0 from 'react-native-auth0';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { StudentInfoDataType } from '../../app/Slice';
import { ScheduleArrayItem } from '../Screens/AddTiming';
import { ExistingSubjectsArrayItem } from '../../app/Slice';
import { addDays, subDays } from "date-fns";
import { CommonActions } from '@react-navigation/native';
import Video from 'react-native-video';
import ConsitencyVideo from '../Images/Consistensy_Video.mp4'
const { width, height } = Dimensions.get('window');
type HeaderPanelPropsType = {};

type VerificationPanelPropsType = {
    // confirmCode: () => Promise<void>;
    // StudentInfoData: StudentInfoDataType | undefined;
    // setStudentInfoData: React.Dispatch<React.SetStateAction<StudentInfoDataType | undefined>>;
    Process : string | undefined;
    PhoneNumber: string | undefined;
    EnteredOTP: string;
    setEnteredOTP: React.Dispatch<React.SetStateAction<string>>;
    Loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConceptVideo = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
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

const HeaderPanel = () => {
    const navigation = useNavigation<NavigationProp<any, any>>();
    return (
        <View style={{ flex: 0.5 }}>
            <View style={styles.BackButtonArea}>
                <TouchableOpacity style={styles.BackButtonBox} onPress={() => navigation.navigate('StackScreens', { screen: 'SignInStack' })}>
                    <Image source={ChevronLeftBlack} style={styles.BackButtonIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.MailSendingArtArea}>
                <Image source={OtpVerificationImage} style={styles.MailSendingArtImage} />
            </View>
        </View>
    )
}

const VerificationPanel = (props: VerificationPanelPropsType) => {  
    const [Countdown, setCountdown] = useState<number>(60)
    const [ResendStatus, setResendStatus] = useState(false)
    const dispatch = useDispatch();
    const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
    let currentDate = new Date();
    let currentNumDate = currentDate.getDate().toString().padStart(2, '0');
    let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let currentYear = currentDate.getFullYear();
    let currentDateandMonth = `${currentNumDate}/${currentMonth}/${currentYear}`;
    let currentHourTime = currentDate.getHours();
    let currentMinTime = currentDate.getMinutes();
    let currentSecTime = currentDate.getSeconds();
    let fetched_StudentInfo: StudentInfoDataType | null = null
    let fetched_ScheduleArray: ScheduleArrayItem[] | null = null
    let fetched_ExistingSubjectsArray: ExistingSubjectsArrayItem[] | null = null
    const navigation = useNavigation<NavigationProp<any, any>>();
    const auth0 = new Auth0({
        domain: 'dev-euawlucdljtesr0z.us.auth0.com',
        clientId: 'MgGS4kNAn4YSeC5lqwlJ9bM3hcCk7Cus',
    });  

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

    async function VerifyButton() {
        props.setLoading(true)
        if (props.EnteredOTP.length === 4 && props.Process == 'SignIn') {
            try {
                const credentials = await auth0.auth.loginWithSMS({
                    phoneNumber: `+91${props.PhoneNumber}`,
                    code: props.EnteredOTP,
                });
                console.log("OTP Verified");

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
                        "Value": props.PhoneNumber,
                        "Type": "Phone Number"
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
                    props.setLoading(false)
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
                        "Type": "Phone Number",
                        "Value": props.PhoneNumber
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
                        "Type": "Phone Number",
                        "Value": props.PhoneNumber
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
                            "Work": "Demo Hindi",
                            "StartAngle": 690,
                            "EndAngle": 720,
                            "TaskDate": yesterdayDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "01:00",
                            "EndTime": "02:00",
                            "Work": "Demo Physics",
                            "StartAngle": 30,
                            "EndAngle": 60,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "03:00",
                            "EndTime": "04:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 90,
                            "EndAngle": 120,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "05:00",
                            "EndTime": "06:00",
                            "Work": "Demo Biology",
                            "StartAngle": 150,
                            "EndAngle": 180,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "06:00",
                            "EndTime": "07:00",
                            "Work": "Demo History",
                            "StartAngle": 180,
                            "EndAngle": 210,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "07:00",
                            "EndTime": "08:00",
                            "Work": "Demo English",
                            "StartAngle": 210,
                            "EndAngle": 240,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "09:00",
                            "EndTime": "10:00",
                            "Work": "Demo Maths",
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
                            "Work": "Demo Physics",
                            "StartAngle": 150,
                            "EndAngle": 180,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "07:00",
                            "EndTime": "08:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 210,
                            "EndAngle": 240,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "09:00",
                            "EndTime": "10:00",
                            "Work": "Demo Biology",
                            "StartAngle": 270,
                            "EndAngle": 300,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "11:00",
                            "EndTime": "12:00",
                            "Work": "Demo History",
                            "StartAngle": 330,
                            "EndAngle": 360,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "12:00",
                            "EndTime": "13:00",
                            "Work": "Demo English",
                            "StartAngle": 360,
                            "EndAngle": 390,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "13:00",
                            "EndTime": "14:00",
                            "Work": "Demo Maths",
                            "StartAngle": 390,
                            "EndAngle": 420,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "15:00",
                            "EndTime": "16:00",
                            "Work": "Demo Hindi",
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
                            "Work": "Demo Physics",
                            "StartAngle": 330,
                            "EndAngle": 360,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "13:00",
                            "EndTime": "14:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 390,
                            "EndAngle": 420,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "15:00",
                            "EndTime": "16:00",
                            "Work": "Demo Biology",
                            "StartAngle": 450,
                            "EndAngle": 480,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "17:00",
                            "EndTime": "18:00",
                            "Work": "Demo History",
                            "StartAngle": 510,
                            "EndAngle": 540,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "18:00",
                            "EndTime": "19:00",
                            "Work": "Demo English",
                            "StartAngle": 540,
                            "EndAngle": 570,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "19:00",
                            "EndTime": "20:00",
                            "Work": "Demo Maths",
                            "StartAngle": 570,
                            "EndAngle": 600,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "21:00",
                            "EndTime": "22:00",
                            "Work": "Demo Hindi",
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
                            "Work": "Demo Physics",
                            "StartAngle": 510,
                            "EndAngle": 540,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "19:00",
                            "EndTime": "20:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 570,
                            "EndAngle": 600,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "21:00",
                            "EndTime": "22:00",
                            "Work": "Demo Biology",
                            "StartAngle": 630,
                            "EndAngle": 660,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "23:00",
                            "EndTime": "24:00",
                            "Work": "Demo History",
                            "StartAngle": 690,
                            "EndAngle": 720,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "00:00",
                            "EndTime": "01:00",
                            "Work": "Demo English",
                            "StartAngle": 0,
                            "EndAngle": 30,
                            "TaskDate": nextdayDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "01:00",
                            "EndTime": "02:00",
                            "Work": "Demo Maths",
                            "StartAngle": 30,
                            "EndAngle": 60,
                            "TaskDate": nextdayDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "03:00",
                            "EndTime": "04:00",
                            "Work": "Demo Hindi",
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
                            "Subject": "Demo Physics",
                            "Current_Duration": "1h 0min",
                            "Dataframe": []
                        },
                        {
                            "uniqueID": nanoid(10),
                            "Subject": "Demo Chemistry",
                            "Current_Duration": "1h 0min",
                            "Dataframe": []
                        },
                        {
                            "uniqueID": nanoid(10),
                            "Subject": "Demo Maths",
                            "Current_Duration": "1h 0min",
                            "Dataframe": []
                        },
                        {
                            "uniqueID": nanoid(10),
                            "Subject": "Demo History",
                            "Current_Duration": "1h 0min",
                            "Dataframe": []
                        }
                    ]
                    dispatch(addWholeExistingSubjectsArray(TestingStatsSubjects))
                }

                dispatch(updateLocalStorageInfo("Login"));

                <ConceptVideo/>

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
            catch (error: any) {
                console.log("Error: ", error);
                console.log("Error Line: ", error.stack);
                props.setLoading(false)
                if (Platform.OS === 'android') {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Incorrect OTP',
                    textBody: "Please Enter correct OTP",
                    button: 'Ok',
                })
                }
                else if (Platform.OS === 'ios') {
                Alert.alert(
                    "Incorrect OTP", "Please Enter correct OTP",
                    [{ text: "Ok" }]
                )
                }
                console.log("OTP is incorrect");
            }
        } 
        else if (props.EnteredOTP.length === 4 && props.Process == 'SignUp') {
            try {
                const credentials = await auth0.auth.loginWithSMS({
                    phoneNumber: `+91${props.PhoneNumber}`,
                    code: props.EnteredOTP,
                });
                console.log("OTP Verified");
                let NewStudent = {
                    "uniqueID": nanoid(),
                    "Name": "",
                    "Phone Number": props.PhoneNumber,
                    "Date Joined": currentDateandMonth,
                    "Email ID": "",
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
                  props.setLoading(false)
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
                            "Work": "Demo Hindi",
                            "StartAngle": 690,
                            "EndAngle": 720,
                            "TaskDate": yesterdayDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "01:00",
                            "EndTime": "02:00",
                            "Work": "Demo Physics",
                            "StartAngle": 30,
                            "EndAngle": 60,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "03:00",
                            "EndTime": "04:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 90,
                            "EndAngle": 120,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "05:00",
                            "EndTime": "06:00",
                            "Work": "Demo Biology",
                            "StartAngle": 150,
                            "EndAngle": 180,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "06:00",
                            "EndTime": "07:00",
                            "Work": "Demo History",
                            "StartAngle": 180,
                            "EndAngle": 210,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "07:00",
                            "EndTime": "08:00",
                            "Work": "Demo English",
                            "StartAngle": 210,
                            "EndAngle": 240,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "09:00",
                            "EndTime": "10:00",
                            "Work": "Demo Maths",
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
                            "Work": "Demo Physics",
                            "StartAngle": 150,
                            "EndAngle": 180,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "07:00",
                            "EndTime": "08:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 210,
                            "EndAngle": 240,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "09:00",
                            "EndTime": "10:00",
                            "Work": "Demo Biology",
                            "StartAngle": 270,
                            "EndAngle": 300,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "11:00",
                            "EndTime": "12:00",
                            "Work": "Demo History",
                            "StartAngle": 330,
                            "EndAngle": 360,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "12:00",
                            "EndTime": "13:00",
                            "Work": "Demo English",
                            "StartAngle": 360,
                            "EndAngle": 390,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "13:00",
                            "EndTime": "14:00",
                            "Work": "Demo Maths",
                            "StartAngle": 390,
                            "EndAngle": 420,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "15:00",
                            "EndTime": "16:00",
                            "Work": "Demo Hindi",
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
                            "Work": "Demo Physics",
                            "StartAngle": 330,
                            "EndAngle": 360,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "13:00",
                            "EndTime": "14:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 390,
                            "EndAngle": 420,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "15:00",
                            "EndTime": "16:00",
                            "Work": "Demo Biology",
                            "StartAngle": 450,
                            "EndAngle": 480,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "17:00",
                            "EndTime": "18:00",
                            "Work": "Demo History",
                            "StartAngle": 510,
                            "EndAngle": 540,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "18:00",
                            "EndTime": "19:00",
                            "Work": "Demo English",
                            "StartAngle": 540,
                            "EndAngle": 570,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "19:00",
                            "EndTime": "20:00",
                            "Work": "Demo Maths",
                            "StartAngle": 570,
                            "EndAngle": 600,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "21:00",
                            "EndTime": "22:00",
                            "Work": "Demo Hindi",
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
                            "Work": "Demo Physics",
                            "StartAngle": 510,
                            "EndAngle": 540,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(175, 193, 85, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "19:00",
                            "EndTime": "20:00",
                            "Work": "Demo Chemistry",
                            "StartAngle": 570,
                            "EndAngle": 600,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(182, 108, 239, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "21:00",
                            "EndTime": "22:00",
                            "Work": "Demo Biology",
                            "StartAngle": 630,
                            "EndAngle": 660,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(78, 161, 40, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "23:00",
                            "EndTime": "24:00",
                            "Work": "Demo History",
                            "StartAngle": 690,
                            "EndAngle": 720,
                            "TaskDate": currentDateandMonth,
                            "Slice_Color": "rgba(71, 214, 63, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "00:00",
                            "EndTime": "01:00",
                            "Work": "Demo English",
                            "StartAngle": 0,
                            "EndAngle": 30,
                            "TaskDate": nextdayDateandMonth,
                            "Slice_Color": "rgba(19, 249, 16, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "01:00",
                            "EndTime": "02:00",
                            "Work": "Demo Maths",
                            "StartAngle": 30,
                            "EndAngle": 60,
                            "TaskDate": nextdayDateandMonth,
                            "Slice_Color": "rgba(69, 221, 118, 0.5)"
                        },
                        {
                            "uniqueID": nanoid(10),
                            "StartTime": "03:00",
                            "EndTime": "04:00",
                            "Work": "Demo Hindi",
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
                        "Subject": "Demo Physics",
                        "Current_Duration": "1h 0min",
                        "Dataframe": []
                    },
                    {
                        "uniqueID": nanoid(10),
                        "Subject": "Demo Chemistry",
                        "Current_Duration": "1h 0min",
                        "Dataframe": []
                    },
                    {
                        "uniqueID": nanoid(10),
                        "Subject": "Demo Maths",
                        "Current_Duration": "1h 0min",
                        "Dataframe": []
                    },
                    {
                        "uniqueID": nanoid(10),
                        "Subject": "Demo History",
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
                    props.setLoading(false)
                    console.error('Catch Error: ', error);
                }
            }
            catch (error) {
                props.setLoading(false)
                if (Platform.OS === 'android') {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Incorrect OTP',
                    textBody: "Please Enter correct OTP",
                    button: 'Ok',
                })
                }
                else if (Platform.OS === 'ios') {
                Alert.alert(
                    "Incorrect OTP", "Please Enter correct OTP",
                    [{ text: "Ok" }]
                )
                }
                console.log("OTP is incorrect");
            }
        }
        else {
            props.setLoading(false)
            console.log("Please enter a valid OTP");
        }
    }

    async function ResendClicked() {
        await auth0.auth.passwordlessWithSMS({
            phoneNumber: `+91${props.PhoneNumber}`,
            send: 'code',
        });
        setCountdown(10)
        setResendStatus(true);
    }

    // useEffect(() => {
    //     console.log("Student Details: ", StudentInfoData[0]["Date Joined"])
    // }, [StudentInfoData[0]])
    
    useEffect(() => {
        if (Countdown === 0) {
            setResendStatus(false)
            return;
        }

        const interval = setInterval(() => {
        setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [Countdown]);

    return (
        <View style={{ flex: 0.5 }}>
            <View style={styles.MotiveTextArea}>
                <View>
                    <Text style={styles.MotiveHeading}>OTP Verification</Text>
                </View>
                <View style={styles.MotiveSubHeadingArea}>
                    <Text style={styles.MotiveSubHeadingTextOne}>Enter the OTP sent to </Text>
                    <Text style={styles.MotiveSubHeadingTextTwo}>+91 {props.PhoneNumber}</Text>
                </View>
            </View>

            <View style={styles.OTPNumberArea}>
            <OtpInput
                numberOfDigits={4}
                focusColor='#aa76df'
                autoFocus={false}
                hideStick={true}
                placeholder=""
                blurOnFilled={true}
                disabled={false}
                type="numeric"
                secureTextEntry={false}
                focusStickBlinkingDuration={500}
                onFocus={() => console.log("Focused")}
                onBlur={() => console.log("Blurred")}
                onTextChange={(text) => {
                    console.log(text)
                    props.setEnteredOTP(text)
                }}
                onFilled={(text) => {
                    console.log(`OTP is ${text}`)
                    props.setEnteredOTP(text)
                }}
                textInputProps={{
                    accessibilityLabel: "One-Time Password",
                }}
                textProps={{
                    accessibilityRole: "text",
                    accessibilityLabel: "OTP digit",
                    allowFontScaling: false,
                }}
                theme={{
                    containerStyle: {justifyContent: 'center', alignItems: 'center', columnGap: 13},
                    pinCodeContainerStyle: {width: width * 0.18,
                        height: height * 0.06,
                        borderWidth: 1.5,
                        borderRadius: 10,},
                    pinCodeTextStyle: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 20, color: 'black'},
                    // focusStickStyle: {borderColor: 'black', backgroundColor: '#aa76df'},
                    // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    // placeholderTextStyle: styles.placeholderText,
                    // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                    // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                }}
            />
            </View>
            
            {props.Loading?
            <View style={styles.SubmitButtonArea}>
                <TouchableOpacity style={styles.SubmitButtonBox} onPress={VerifyButton}>
                    <ActivityIndicator size="small" color="#ffffff" />
                </TouchableOpacity>
            </View>
            :
            <View style={styles.SubmitButtonArea}>
                <TouchableOpacity style={styles.SubmitButtonBox} onPress={VerifyButton}>
                    <Text style={styles.SubmitButtonText}>Verify</Text>
                </TouchableOpacity>
            </View>
            }

            <View style={styles.ResendOTPArea}>
                <View style={styles.ResendOTPBox}>
                    <View>
                        <Text style={styles.ResendOTPTextOne}>Didn't receive the OTP? </Text>
                    </View>
                    {ResendStatus? 
                        <TouchableOpacity>
                            <Text style={styles.ResendOTPTextTwo}>{Countdown}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={ResendClicked}>
                            <Text style={styles.ResendOTPTextTwo}>Resend</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    )
}

const OtpVerificaton = () => {
    const route = useRoute<CombinedRouteProp>();
    const navigation = useNavigation<NavigationProp<any, any>>();
    const [EnteredOTP, setEnteredOTP] = useState("")
    const [Loading, setLoading] = useState(false)
    const insets = useSafeAreaInsets();
    // const [StudentInfoData, setStudentInfoData] = useState<StudentInfoDataType>()
    
    // Halting the whole process because of Firebase Auth requiring version of 2.1.0 of kotlin but I think react-native-truesheet is only compatible with 1.9.0 or max 2.0.0. I was following playlist of a female youtuber named "Tech with Muskan". The link is:
    // "https://www.youtube.com/watch?v=hLqpxBC6m-o&list=PL0kn01TUe2p-XxCrIwRHeSfc4NTEknlt2&index=2"
    // Previously I was following "Engineer with CodeWala" channel but it's firebase video was 2 years old and the documentation of firebase has changed a lot since then. So I switched to this channel.

    
    // If null, no SMS has been sent
    // const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

    // function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    //     // Purpose of onAuthStateChanged():
    //     // It’s automatically triggered when:
    //     //  •A user successfully logs in (via OTP, email, or any other Firebase method)
    //     //  •A user logs out
    //     //  •On app startup, if a user was already signed in before
    //     if (user) {
    //         console.log("✅ User is logged in:", user.phoneNumber);

    //         // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
    //         // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
    //         // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
    //         // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    //     }
    // }

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    // // Handle the button press
    // async function signInWithPhoneNumber(phoneNumber: string | undefined) {
    //     if (!phoneNumber) {
    //         console.log('Phone number is undefined');
    //         return;
    //     }
    //     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    //     setConfirm(confirmation);
    // }

    // async function confirmCode() {
    //     if (!confirm) {
    //         console.log('No confirmation result');
    //         return;
    //     }
    //     try {
    //         await confirm.confirm(EnteredOTP);
    //         // Don't need to navigate manually here — onAuthStateChanged will handle that
    //     } catch (error) {
    //         console.log('Invalid code.');
    //     }
    // }

    let phoneNumber: string | undefined = '';
    let Process: string | undefined = '';
    if (route.name === 'OtpVerificationStack') {
        Process = route.params?.Process;  // Extracting Process
        phoneNumber = route.params?.PhoneNumber;  // Extracting PhoneNumber
        // signInWithPhoneNumber(phoneNumber);
        // console.log("Phone Number as OTP will be:", phoneNumber);
        console.log("Phone Number as OTP will be:", phoneNumber);
    }

    return (
        <KeyboardAvoidingView 
        style={{ flex: 1, paddingTop: Platform.OS === 'ios'? insets.top : 0}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <HeaderPanel />
            <VerificationPanel 
                // confirmCode={confirmCode}   // Passing confirmCode to VerificationPanel
                // StudentInfoData={StudentInfoData}
                // setStudentInfoData={setStudentInfoData}
                Process={Process}            // Passing Process to VerificationPanel
                PhoneNumber={phoneNumber}      // Passing PhoneNumber to VerificationPanel
                EnteredOTP={EnteredOTP}        // Passing EnteredOTP to VerificationPanel
                setEnteredOTP={setEnteredOTP}  // Passing setEnteredOTP to VerificationPanel
                setLoading={setLoading}
                Loading={Loading}
            />
        </KeyboardAvoidingView>
    )
}

export default OtpVerificaton


const styles = StyleSheet.create({
    VideoStyle: {
        ...StyleSheet.absoluteFillObject, // makes video cover entire screen
        width: width,
        height: height
    },
    ResendOTPTextTwo: {
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        fontSize: 13,
        color: '#b57eea',
    },
    ResendOTPTextOne: {
        fontFamily: 'sf-pro-display-medium',
        fontSize: 13,
        color: 'grey',
    },
    ResendOTPBox: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    ResendOTPArea: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SubmitButtonText: {
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        fontSize: 17,
        color: '#e9e9e9',
    },
    SubmitButtonBox: {
        height: height * 0.06,
        width: width * 0.82,
        backgroundColor: '#b57eea',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    SubmitButtonArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    OTPNumberBox: {
        width: width * 0.18,
        height: height * 0.06,
        borderWidth: 1,
        borderColor: '#d7cfdf',
        borderRadius: 10,
    },
    OTPNumberArea: {
        flex: 1,
        // flexDirection: 'row',
        // columnGap: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MotiveSubHeadingTextTwo: {
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        fontSize: 13,
        color: 'black',
    },
    MotiveSubHeadingTextOne: {
        fontFamily: 'sf-pro-display-medium',
        fontSize: 13,
        color: 'grey'
    },
    MotiveSubHeadingArea: { flexDirection: 'row', },
    MotiveHeading: {
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Heavy' : 'sf-pro-display-heavy',
        fontSize: 25,
        color: 'black',
    },
    MotiveTextArea: {
        flex: 1,
        padding: 20,
        paddingLeft: width * 0.1,
        rowGap: 15,
    },
    MailSendingArtImage: {
        height: height * 0.4,
        width: width * 0.8
    },
    MailSendingArtArea: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    BackButtonIcon: {
        height: 20,
        width: 20,
    },
    BackButtonBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dfd9e6',
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    BackButtonArea: {
        flex: 0.2,
        justifyContent: 'center',
        paddingLeft: 20,
    },

})