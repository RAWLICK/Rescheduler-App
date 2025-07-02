import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import { useEffect } from 'react'
import Onboarding from 'react-native-onboarding-swiper'
import SignInIcon from '../Images/SignInIcon.png'
import StressedPerson from '../Images/StressedPerson.png'
import ClickHere from '../Images/ClickHere.png'
import TrackingStats from '../Images/TrackingStats.png'
import CheckingTasks from '../Images/CheckingTasks.png'
import React from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
import { updateLocalStorageInfo, updateDemoStatus } from '../../app/Slice';

const OnBoardingScreen = () => {
    const navigation = useNavigation<NavigationProp<any, any>>();
    const dispatch = useDispatch();
    const DemoStatement = useSelector((state: RootState) => state.DemoArraySliceReducer)
    const LocalStorageInfo = useSelector((state: RootState) => state.LocalStorageInfoSliceReducer.LocalStorageInfoInitialState);
    const Done = () => {
        dispatch(updateDemoStatus(true));
        dispatch(updateLocalStorageInfo("FirstLaunch"));
        navigation.navigate('StackScreens', { screen: 'SignInStack' })
    }
    useEffect(() => {
      console.log("DemoStatement", DemoStatement);
    }, [DemoStatement])

    useEffect(() => {
      console.log("LocalStorageInfo", LocalStorageInfo);
    }, [LocalStorageInfo])
    
  return (
      <Onboarding
      onSkip={Done}
      onDone={Done}
        pages={[
            {
            backgroundColor: '#fcec82',
            image: <Image source={StressedPerson} style={{height: 350, width: 350, borderRadius: 30}}/>,
            title: 'Stressed because minor inconveniences of your day disrupts the whole planned Schedule?',
            titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
            subtitle: '',
            subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#d9fc82',
                image: <Image source={ClickHere} style={{height: 350, width: 350, borderRadius: 30}}/>,
                title: 'Now Reschedule your entire routine effortlessly with just one click',
                titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#c882fc',
                image: <Image source={CheckingTasks} style={{height: 350, width: 350, borderRadius: 30}}/>,
                title: 'Choose Pending Tasks and the Rescheduler smartly organizes them, giving you an optimized plan',
                titleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 20},
                subtitle: '',
                subTitleStyles: {fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'}
            },
            {
                backgroundColor: '#fcc682',
                image: <Image source={TrackingStats} style={{height: 350, width: 350, borderRadius: 30}}/>,
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