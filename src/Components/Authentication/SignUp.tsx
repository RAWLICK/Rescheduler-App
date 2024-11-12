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
    TextInput,
} from 'react-native';
import React from 'react';
import { useState } from 'react';
import SignInIcon from '../Images/SignInIcon.png';
import LinearGradient from 'react-native-linear-gradient';
import SignInDoodleImage from '../Images/SignInDoodle.png';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
const { width, height } = Dimensions.get('window');

type LogoSectionPropsType = {};

const LogoSection = () => {
    return (
        <LinearGradient colors={['#ffffff', '#ab7be9']} style={{ flex: 0.5 }}>
            <ImageBackground
                source={SignInDoodleImage}
                style={[styles.ImageBackgroundViewStyle]}
                imageStyle={{ opacity: 0.1 }}>
                <View style={[styles.LogoSectionTextBox]}>
                    <View style={[styles.LogoSectionHeadingBox]}>
                        <Text style={[styles.HeadingText, { color: '#a032d3' }]}>
                            Re
                        </Text>
                        <Text style={[styles.HeadingText, { color: 'black' }]}>
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

type CredentialInputScreenPropsType = {
    PhoneNumText: string | undefined;
    setPhoneNumText: React.Dispatch<React.SetStateAction<string>>;
};

const CredentialInputSection = (props: CredentialInputScreenPropsType) => {
    const navigation = useNavigation<NavigationProp<any, any>>();
    return (
        <View style={{ flex: 0.5, backgroundColor: '#ab7be9' }}>
            <View style={styles.RoundedBox}>
                <View style={[styles.MotiveHeadingBox]}>
                    <Text style={styles.MotiveHeading}>
                        Register Yourself
                    </Text>
                </View>
                <View style={styles.CredentialBox}>
                    <View style={styles.PhoneNumberBox}>
                        <TouchableOpacity style={styles.CountryCodeBox}>
                            <Text style={styles.CountryCodeText}>
                                +91
                            </Text>
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

                    <TouchableOpacity
                        style={styles.ContinueBox}>
                        <Text style={styles.ContinueText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <View
                        style={styles.OrSpacingBox}>
                        <Text style={styles.OrSpacingText}>
                            OR
                        </Text>
                    </View>
                    <TouchableOpacity
                     onPress={()=> navigation.navigate('StackScreens', { screen: 'SignInStack'})}
                        style={styles.SignInBox}>
                        <Text
                            style={styles.SignInText}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const SignUp = () => {
    const [PhoneNumText, setPhoneNumText] = useState('');
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <StatusBar>
      animated={true}
      backgroundColor='#FFFFFF'
      // barStyle={statusBarStyle}
      // showHideTransition={statusBarTransition}
      // hidden={hidden}
      /> */}
            <View style={{ flex: 1 }}>
                <LogoSection />
                <CredentialInputSection
                    PhoneNumText={PhoneNumText}
                    setPhoneNumText={setPhoneNumText}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    SignInText: {
        fontFamily: 'sf-pro-display-bold',
        fontSize: 17,
        color: 'black',
    },
    SignInBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#c096ea',
        elevation: 3,
    },
    OrSpacingText: {
        fontFamily: 'sf-pro-display-bold',
        fontSize: 15,
    },
    OrSpacingBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        marginBottom: 10,
    },
    ContinueText: {
        fontFamily: 'sf-pro-display-bold',
        fontSize: 19,
        color: 'white'
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
        fontFamily: 'sf-pro-display-bold',
        fontSize: 17,
        color: 'black'
    },
    CountryCodeText: {
        fontFamily: 'sf-pro-display-bold',
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
    },
    CredentialBox: { marginBottom: 10 },
    MotiveHeading: {
        fontFamily: 'sf-pro-display-bold',
        fontSize: 20,
        color: 'grey'
    },
    ImageBackgroundViewStyle: {
        flex: 1,
        alignItems: 'center',
    },

    LogoSectionTextBox: {
        // marginTop: 250,
        marginTop: height * 0.3,
        alignItems: 'center',
    },

    LogoSectionHeadingBox: {
        flexDirection: 'row'
    },

    HeadingText: {
        fontFamily: 'coolvetica rg',
        fontSize: 60,
        marginBottom: 5
    },

    SubHeadingText: {
        fontFamily: 'sf-pro-display-medium'
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
        marginBottom: 15
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

export default SignUp;
