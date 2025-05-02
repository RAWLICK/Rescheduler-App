import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import SignInIcon from '../Images/SignInIcon.png'
import React from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const OnBoardingScreen = () => {
    const navigation = useNavigation<NavigationProp<any, any>>();
    const Done = () => {
    navigation.navigate('DrawerScreens', {
        screen: 'TabsDrawer',
        params: {
            screen: 'ScheduleTab',
            params: undefined
        },
    })
    }
  return (
      <Onboarding
      onDone={Done}
        pages={[
            {
            backgroundColor: '#fcec82',
            image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
            title: 'Stressed because minor inconveniences of your day disrupts the whole planned Schedule?',
            titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
            subtitle: '',
            subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#d9fc82',
                image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
                title: 'Now Reschedule your entire routine effortlessly with just one click',
                titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#c882fc',
                image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
                title: 'Choose Pending Tasks and the Rescheduler smartly organizes them, giving you an optimized plan',
                titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#fcc682',
                image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
                title: 'Boost your streak by tracking daily progress, instantly updating your stats for each subject',
                titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            }
        ]}
      />
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({})