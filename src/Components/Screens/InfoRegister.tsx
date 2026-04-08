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
  Modal
} from 'react-native';
import React from 'react';
import {useState, useEffect, useRef, memo, useCallback} from 'react';
import GenderIcon from '../Images/Gender.png'
import BookIcon from '../Images/Book.png'
import { BlurView } from "@react-native-community/blur";
import { Dropdown } from 'react-native-element-dropdown';
// import { Picker, DatePicker } from 'react-native-wheel-pick';
import DateTimePicker from '@react-native-community/datetimepicker';

const InfoRegister = () => {
    const [InfoModal, setInfoModal] = useState(true)
    const [value, setValue] = useState("");
    const [isFocus, setIsFocus] = useState(false);
    const [CourseValue, setCourseValue] = useState("")
    const [isCourseFocus, setIsCourseFocus] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

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
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: 'grey'}}>
                        <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>Let Us Know You</Text>
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
                                placeholder={!isFocus ? 'Select item' : '...'}
                                searchPlaceholder="Search..."
                                value={value == '' ? '1' : value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.value);
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
                                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 12}}>15 September, 2004</Text>
                            </TouchableOpacity>
                            {show && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="spinner" // iOS-like wheel OR "default"
                                    onChange={(event, selectedDate) => {
                                    setShow(false);
                                    if (selectedDate) setDate(selectedDate);
                                    }}
                                    maximumDate={new Date()} // prevent future DOB
                                />
                            )}
                        </View>
                    </View>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}}>
                        <Text style={{color: '#457fdf', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>Next</Text>
                    </TouchableOpacity>
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