import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import OtpVerificationImage from '../Images/OtpVerificationImage.png'
import ChevronLeftBlack from '../Images/ChevronLeftBlack.png'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { CombinedRouteProp } from '../../App';
import { OtpInput } from "react-native-otp-entry";
import { useState } from 'react';
const { width, height } = Dimensions.get('window');

type HeaderPanelPropsType = {};

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

type VerificationPanelPropsType = {
    PhoneNumber: string | undefined;
    EnteredOTP: string;
    setEnteredOTP: React.Dispatch<React.SetStateAction<string>>;
};

const VerificationPanel = (props: VerificationPanelPropsType) => {
    const navigation = useNavigation<NavigationProp<any, any>>();
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
                    pinCodeTextStyle: {fontFamily: 'sf-pro-display-bold', fontSize: 20, color: 'black'},
                    // focusStickStyle: {borderColor: 'black', backgroundColor: '#aa76df'},
                    // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    // placeholderTextStyle: styles.placeholderText,
                    // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                    // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                }}
            />
            </View>

            <View style={styles.SubmitButtonArea}>
                <TouchableOpacity style={styles.SubmitButtonBox} onPress={() => navigation.navigate('TabScreens')}>
                    <Text style={styles.SubmitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.ResendOTPArea}>
                <View style={styles.ResendOTPBox}>
                    <View>
                        <Text style={styles.ResendOTPTextOne}>Didn't receive the OTP? </Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.ResendOTPTextTwo}>Resend</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const OtpVerificaton = () => {
    const route = useRoute<CombinedRouteProp>();
    let phoneNumber: string | undefined = '';
    if (route.name === 'OtpVerificationStack') {
        phoneNumber = route.params?.PhoneNumber;  // Extracting PhoneNumber
        console.log("Phone Number as OTP will be:", phoneNumber);
    }
    const [EnteredOTP, setEnteredOTP] = useState("")
    return (
        <View style={{ flex: 1 }}>
            <HeaderPanel />
            <VerificationPanel 
                PhoneNumber={phoneNumber}  // Passing PhoneNumber to VerificationPanel
                EnteredOTP={EnteredOTP}  // Passing EnteredOTP to VerificationPanel
                setEnteredOTP={setEnteredOTP}  // Passing setEnteredOTP to VerificationPanel
            />
        </View>
    )
}

export default OtpVerificaton


const styles = StyleSheet.create({
    ResendOTPTextTwo: {
        fontFamily: 'sf-pro-display-bold',
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
        fontFamily: 'sf-pro-display-bold',
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
        fontFamily: 'sf-pro-display-bold',
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
        fontFamily: 'sf-pro-display-heavy',
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