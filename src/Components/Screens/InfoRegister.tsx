import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Switch,
  StatusBar,
  Platform,
  Button,
  Keyboard,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator
} from 'react-native';
import React from 'react';
import {useState, useEffect, useRef, memo, useCallback} from 'react';
import GenderIcon from '../Images/Gender.png'
import BookIcon from '../Images/Book.png'
import { BlurView } from "@react-native-community/blur";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import WinkingIcon from '../Images/Winking.png'
import { updateBasicInfo } from '../../app/Slice';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
// import { Picker, DatePicker } from 'react-native-wheel-pick';
import DateTimePicker from '@react-native-community/datetimepicker';

const InfoRegister = () => {
    const [InfoModal, setInfoModal] = useState(true)
    const dispatch = useDispatch()
    const [GenderValue, setGenderValue] = useState("");
    const [isFocus, setIsFocus] = useState(false);
    const [CourseValue, setCourseValue] = useState("")
    const [isCourseFocus, setIsCourseFocus] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState(false);
    const [BirthDate, setBirthDate] = useState<string>("DD/MM/YYYY");
    const [Loading, setLoading] = useState(false);
    const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)

    const GenderData = [
        { label: "Male", value: '1' },
        { label: "Female", value: '2' }
    ];
    const [ActiveGender, setActiveGender] = useState(GenderData?.[0]?.label);
    const CoursesData = [
        { label: "JEE", value: '1' },
        { label: "NEET", value: '2' },
        { label: "UPSC", value: '3' },
        { label: "GATE", value: '4' },
        { label: "CAT", value: '5' },
        { label: "CLAT", value: '6' },
        { label: "SSC", value: '7' },
        { label: "Banking", value: '8' },
        { label: "Other", value: '9' }
    ];
    const [ActiveCourse, setActiveCourse] = useState(CoursesData?.[0]?.label);

    const handleConfirm = (date: Date) => {
        // console.log("handleConfirm is made run");
        // .padStart is added to provide a leading 0 to a singular number
        console.log("Printing Date Parameter from handleConfirm: ", date)
        setBirthDate(
            `${
            date.getDate().toString().padStart(2, '0') +
            '/' +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            '/' +
            date.getFullYear()
            }`,
        );
        setShow(false);
    };

    const formatDOB = (dob: string): string => {
        if (dob === "DD/MM/YYYY") {
            return dob; // Return the default placeholder if the date of birth is not set
        }
        else {
            const [day, month, year] = dob.split('/').map(Number);

            const date = new Date(year, month - 1, day);

            const formatted = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

            return formatted.replace(',', ''); // removes extra comma if needed
        }
    };

    const NextButton = async () => {
        if (GenderValue == "" || CourseValue == "" || BirthDate == "DD/MM/YYYY") {
            Alert.alert("Incomplete Information", "Please fill all the details to proceed");
        }
        else {
            setLoading(true);
            dispatch(updateBasicInfo({
                'Gender': ActiveGender,
                'Birth Date': BirthDate,
                'Course': ActiveCourse
            }));

            try {
                const BasicInfoUpdate = await fetch(
                // Platform.OS === 'ios'? 'http://localhost:5000/IsSubscriptionActive':'http://10.0.2.2:5000/IsSubscriptionActive',
                'https://rescheduler-server.onrender.com/UpdateStudent',
                { 
                method: 'POST', // Specify the request method
                headers: {
                    'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
                },
                body: JSON.stringify({
                    Type: "uniqueID",
                    Value: StudentInfoData["uniqueID"],
                    Updates: {
                        "Gender": ActiveGender,
                        "Birth Date": BirthDate,
                        "Course": ActiveCourse
                    }
                }), // Convert the request payload to JSON.
                })
                
                if (!BasicInfoUpdate.ok) {  // Handle HTTP errors
                throw new Error('Error in UpdateStudent Response');
                }
                const fetched_BasicInfo = await BasicInfoUpdate.json();
                console.log(fetched_BasicInfo);
                setLoading(false);
                setInfoModal(false);
                
            } catch (error) {
                console.error('Catch Error(UpdateStudent): ', error);
                setLoading(false);
                setInfoModal(false);
            }
        }
    };

    return (  
        <Modal transparent= {true} visible={InfoModal} animationType='fade'>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <BlurView
                style={styles.blurStyle}
                blurType="light"
                blurAmount={10}
            />
                <View style={[styles.selectionDialogBox]}>
                <BlurView
                    style={styles.blurStyle}
                    blurType="dark"
                    blurAmount={50}
                    // reducedTransparencyFallbackColor="black"
                />
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: 'grey', flexDirection: 'row', columnGap: 5}}>
                        <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>Let Us Know You</Text>
                        <Image source={WinkingIcon} style={{height: 20, width: 20, tintColor: '#fff'}}/>
                    </View>
                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={styles.container}>
                                <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: '#457fdf', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={GenderData}
                                itemTextStyle={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', height: 20, color: 'grey', fontSize: 12}}
                                itemContainerStyle={{borderRadius: 10, height: 30, justifyContent: 'center'}}
                                containerStyle={{borderRadius: 10, padding: 2}}
                                activeColor="#ebebeb"
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Gender'}
                                searchPlaceholder="Search..."
                                value={GenderValue}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setGenderValue(item.value);
                                    setActiveGender(item.label);
                                    setIsFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <Image
                                    source={GenderIcon}
                                    style={styles.icon}
                                    />
                                )}
                                />
                            </View>
                            <View style={styles.containerTwo}>
                                <Dropdown
                                style={[styles.dropdown, isCourseFocus && { borderColor: '#457fdf', borderWidth: 2 }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={CoursesData}
                                itemTextStyle={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', height: 20, color: 'grey', fontSize: 12}}
                                itemContainerStyle={{borderRadius: 10, height: 30, justifyContent: 'center'}}
                                containerStyle={{borderRadius: 10, padding: 2}}
                                activeColor="#ebebeb"
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={"Preparing for"}
                                searchPlaceholder="Search..."
                                // value={CourseValue == '' ? '1' : CourseValue}
                                value={CourseValue}
                                onFocus={() => setIsCourseFocus(true)}
                                onBlur={() => setIsCourseFocus(false)}
                                onChange={item => {
                                    setCourseValue(item.value);
                                    setActiveCourse(item.label);
                                    setIsFocus(false);
                                }}
                                renderLeftIcon={() => (
                                    <Image
                                    source={BookIcon}
                                    style={styles.icon}
                                    />
                                )}
                                />
                            </View>
                        </View>
                        <View style={{height: 29, width: '90%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 14}}>Birth Date :</Text>
                            </View>
                            <TouchableOpacity style={{width: '58%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 10}} onPress={() => setShow(true)}>
                                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 12}}>{formatDOB(BirthDate)}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={show}
                                date={new Date(2004, 5, 15)}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={() => setShow(false)}
                            />
                        </View>
                    </View>
                    {Loading == false ?
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}} onPress={NextButton}>
                            <Text style={{color: '#457fdf', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>Next</Text>
                        </TouchableOpacity>
                        :
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}}>
                            <ActivityIndicator size="small" color="black" />
                        </View>
                    }
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    icon: {
        marginRight: 15,
        height: 15,
        width: 15,
        tintColor: '#c7c6c6'
      },
    dropdown: {
        height: 30,
        borderWidth: 1,
        paddingHorizontal: 9,
        borderColor: 'grey',
        borderRadius: 10
      },
    placeholderStyle: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        color: 'white'
      },
      selectedTextStyle: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        color: 'white',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
      },
    container: {
        width: '40%',
        backgroundColor: 'transparent',
        marginBottom: 15
    },
    containerTwo: {
        width: '58%',
        backgroundColor: 'transparent',
        marginBottom: 15
    },
    label: {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: 30,
        top: -5,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 11,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        color: 'grey'
    },
    OptionText: {
        height: '100%',
        fontSize: 12,
        color: '#ffffff',
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium',
        textAlignVertical: 'center',   // 🔥 IMPORTANT (Android)
        paddingVertical: 0,            // 🔥 remove internal padding
        includeFontPadding: false,  
        backgroundColor: 'transparent'
    },
    blurStyle: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    selectionDialogBox: {
      flexDirection: 'column',
      height: 200,
      width: 320,
      borderRadius: 20,
      overflow: 'hidden'
      // backgroundColor: 'black',       // Disabled because of iOS
      // opacity: 0.85,                  // Disabled because of iOS
    },
})

export default InfoRegister;