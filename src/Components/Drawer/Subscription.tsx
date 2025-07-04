import { StyleSheet, Text, View, Dimensions, TextInput, Image, StatusBar, SafeAreaView, TouchableOpacity, Platform, ScrollView, Linking, Alert } from 'react-native'
import React from 'react'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import SearchIcon from '../Images/SearchIcon.png'
import LeftArrow from '../Images/LeftArrow.png';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { CombinedNavigationProp } from '../../App';
import ProductivityIcon from '../Images/Productivity.png'
import RescheduleClock from '../Images/RescheduleClock.png'
import Streak from '../Images/Streak.png'
import PieChartShow from '../Images/PieChartShow.png'
import StatisticsIcon from '../Images/StatisticsIcon.png'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
import { addDays } from "date-fns";
import { NavigationProp } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const Subscription = () => {
  const navigation = useNavigation<NavigationProp<any, any>>();
  const insets = useSafeAreaInsets();

  const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
  console.log(StudentInfoData)

  function TrialValidity() {
    const currentDate = new Date();
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
      return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
    };
    if (currentDate >= addDays(formatDate(StudentInfoData["Date Joined"]), 7) && StudentInfoData["Subscription Type"] == "Free") {
    // if (currentDate >= addDays(formatDate("02/05/2025"), 7) && StudentInfoData["Subscription Type"] == "Free" ) {
      return false;
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        console.log("Focused on Subscription Screen")
        StatusBar.setBackgroundColor('#d6d3da')
      }
      return () => {
        // optional cleanup when screen is unfocused
      };
    }, [])
  );
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        backgroundColor="#d6d3da"
      />
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top }}>
        <View style={{ height: height * 0.05, backgroundColor: '#d6d3da', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
            {TrialValidity() == false ?
              <TouchableOpacity onPress={() => navigation.navigate('StackScreens', { screen: 'SignInStack'}) } style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../Images/LogOut.png')} style={{width: 30, height: 30}}/>
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DrawerScreens', {
                    screen: 'TabsDrawer',
                    params: {
                      screen: 'ScheduleTab',
                      params: undefined
                    },
                  })
                }
                style={styles.BackButtonBox}>
                <Image source={LeftArrow} style={styles.BackButtonImage} />
              </TouchableOpacity>
            }
            
          </View>
          <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17, color: 'black' }}>Subscription</Text>
          </View>
          <View style={{ flex: 0.1 }}>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: '#d3bdfa', padding: 15 }}>
        <View style={{ height: 70, backgroundColor: 'white', borderRadius: 20, padding: 10, flexDirection: 'row' }}>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={ProductivityIcon} style={{ height: 35, width: 35 }} />
          </View>
          <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'black', fontSize: 15 }}>Take your productivity to the next level with Rescheduler Premium</Text>
          </View>
        </View>

        <View style={{ height: 300, backgroundColor: 'white', borderRadius: 20, padding: 10, paddingTop: 0, marginTop: 15 }}>
          <View style={{ height: 50, borderBottomWidth: 0.5, borderColor: 'black', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17, color: 'black' }}>Rescheduler Premium - </Text>
            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17, color: '#a06ef8' }}>₹499/Year</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 10, paddingRight: 20, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', height: 120, width: 140, padding: 5, justifyContent: 'center', alignItems: 'center', rowGap: 5 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={RescheduleClock} style={{ height: 40, width: 40 }} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: '#525252', marginLeft: 10 }}>   Unlimited Reschedules</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', height: 120, width: 140, padding: 5, justifyContent: 'center', alignItems: 'center', rowGap: 10 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={StatisticsIcon} style={{ height: 40, width: 40, tintColor: '#a06ef8' }} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: '#525252', marginLeft: 10 }}>   Measure Statistics</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', height: 120, width: 140, padding: 5, justifyContent: 'center', alignItems: 'center', rowGap: 10 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Image source={Streak} style={{ height: 40, width: 40 }} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: '#525252', marginLeft: 10 }}>   Build Streaks</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', height: 120, width: 140, padding: 5, justifyContent: 'center', alignItems: 'center', rowGap: 10 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Image source={PieChartShow} style={{ height: 40, width: 40 }} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 15, color: '#525252', marginLeft: 10 }}>   Schedule in PieChart Form</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={{ height: 50, borderRadius: 17, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a06ef8', marginTop: 20, elevation: 5 }} onPress={() => Linking.openURL('https://rzp.io/rzp/b42Y2qi')}>
          <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'black', fontSize: 16 }}>Get Premium</Text>
        </TouchableOpacity>

        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, marginBottom: 10, marginTop: 10}}>
            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 15, color: 'black'}}>OR</Text>
          </View>
          <TouchableOpacity style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            borderRadius: 17,
            // backgroundColor: '#457fdf',
            backgroundColor: '#508ef5',
            elevation: 3,
          }} onPress={() => navigation.navigate('DrawerScreens', { screen: 'PartneredLibrariesDrawer' })}>
            <Text style={{
              fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
              fontSize: 17,
              color: '#DDDDDD',
            }}>Join Our Partnered Libraries</Text>
          </TouchableOpacity>
      </View>
      </View>
    </View>
  )
}

export default Subscription

const styles = StyleSheet.create({
  BackButtonBox: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },

  BackButtonImage: { height: 15, width: 15 },
})