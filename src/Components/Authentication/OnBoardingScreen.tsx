import { StyleSheet, Text, View, Image } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import SignInIcon from '../Images/SignInIcon.png'
import React from 'react'

const OnBoardingScreen = () => {
  return (
      <Onboarding
        pages={[
            {
            backgroundColor: '#fcec82',
            image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
            title: 'Stressed because minor inconveniences of your day disrupts the whole planned Schedule?',
            titleStyles: {fontFamily: 'sf-pro-display-medium', fontSize: 20},
            subtitle: '',
            subTitleStyles: {fontFamily: 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#d9fc82',
                image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
                title: 'Now Reschedule your entire routine effortlessly with just one click',
                titleStyles: {fontFamily: 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#c882fc',
                image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
                title: 'Choose Pending Tasks and the Rescheduler smartly organizes them, giving you an optimized plan',
                titleStyles: {fontFamily: 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#fcc682',
                image: <Image source={SignInIcon} style={{height: 350, width: 350}}/>,
                title: 'Boost your streak by tracking daily progress, instantly updating your stats for each subject',
                titleStyles: {fontFamily: 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: 'sf-pro-display-bold'}
            }
        ]}
      />
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({})