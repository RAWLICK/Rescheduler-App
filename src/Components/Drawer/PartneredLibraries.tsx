import { StyleSheet, Text, View, Dimensions, TextInput, Image, StatusBar, SafeAreaView, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native'
import React from 'react'
import { useState, useCallback, useEffect , useRef, useMemo} from 'react';
import SearchIcon from '../Images/SearchIcon.png'
import LeftArrow from '../Images/LeftArrow.png';
import {useNavigation} from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import {CombinedNavigationProp} from '../../App';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
import { addDays } from "date-fns";
const { width, height } = Dimensions.get('window');

type DistribtionInfoType = {
  "Distribution Name": string;
  "Local Address": string;
  "City": string
}

const PartneredLibraries = () => {
    const navigation = useNavigation<CombinedNavigationProp>();
    const [LibrarySearch, setLibrarySearch] = useState("")
    const prevCount = useRef('');
    const [AllDistributionsInfo, setAllDistributionsInfo] = useState<DistribtionInfoType[]>()
    const [EditableDistributionsInfo, setEditableDistributionsInfo] = useState<DistribtionInfoType[] | undefined>()
    const [DistributionDataToRender, setDistributionDataToRender] = useState<DistribtionInfoType[] | undefined>()
    
    const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
    // console.log(StudentInfoData)

    async function RenderAllDistributionsInfo() {
      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/GetAllDistrubutionsInfo':'http://10.0.2.2:5000/GetAllDistrubutionsInfo',
          'https://rescheduler-server.onrender.com/GetAllDistrubutionsInfo',
          {
            method: 'GET', // Specify the request method
        })
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data to the server');
        } 
        const fetched_data = await response.json();
        console.log("Fetched Distributions: ", fetched_data)
        setAllDistributionsInfo(fetched_data)
        setEditableDistributionsInfo(fetched_data)
        setDistributionDataToRender(fetched_data)
      } catch (error) {
        console.error('Catch Error: ', error);
    }}

    const filteredData = useMemo(() => {
    return LibrarySearch.length > prevCount.current.length
    ? EditableDistributionsInfo?.filter((item) =>
        item['Local Address'].toLowerCase().includes(LibrarySearch.toLowerCase())
      )
    : AllDistributionsInfo?.filter((item) =>
        item['Local Address'].toLowerCase().includes(LibrarySearch.toLowerCase())
    );
    }, [LibrarySearch, EditableDistributionsInfo]);

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

    useEffect(() => {
      setDistributionDataToRender(filteredData)
    }, [LibrarySearch])
    
    useEffect(() => {
      prevCount.current = LibrarySearch; // Update previous value after the render
    }, [LibrarySearch]);

    useEffect(() => {
      // console.log("EditableDistributionsInfo: ", EditableDistributionsInfo)
      RenderAllDistributionsInfo();
    }, [])
    

    useFocusEffect(
      useCallback(() => {
        // StatusBar.setBackgroundColor("#d6d3da")
        // console.log("EditableDistributionsInfo: ", EditableDistributionsInfo)
        RenderAllDistributionsInfo();
        return () => {
          // optional cleanup when screen is unfocused
        };
      }, [])
    );
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        animated={true}
        backgroundColor="#d6d3da"
      />
      <View style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
        <View style={{height: height * 0.05, backgroundColor: '#d6d3da', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
          <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if (TrialValidity() == false) {
                  navigation.navigate('DrawerScreens', {
                  screen: 'SubscriptionDrawer',
                  params: undefined,
                })
                }
                else {
                  navigation.navigate('DrawerScreens', {
                  screen: 'TabsDrawer',
                  params: {
                    screen: 'ScheduleTab',
                    params: undefined
                  },
                })
                }
              }}
              style={styles.BackButtonBox}>
              <Image source={LeftArrow} style={styles.BackButtonImage} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17, color: 'black'}}>Our Partnered Libraries</Text>
          </View>
          <View style={{flex: 0.1}}>
          </View>
        </View>
        <View style={{padding: 10, paddingRight: width * 0.04, paddingLeft: width * 0.04}}>
          <View style={{rowGap: 10}}>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 23, color: 'black'}}>Get a premium subscription for free</Text>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 17, color: '#525252'}}>Get a premium subscription of Rescheduler absolutely for free by joining our partnered libraries in your area</Text>
          </View>
          <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
              <Image source={SearchIcon} style={{height: 25, width: 25, position: 'absolute', marginLeft: 10}} />
              <TextInput
              style={styles.input}
              onChangeText={setLibrarySearch}
              value={LibrarySearch}
              placeholder='Search "Kapoorthala" '
              placeholderTextColor='#9b999c'
              keyboardType="default"/>
          </View>
          <View style={{height: 400, borderColor: '#d6d3da', borderWidth: 1, borderRadius: 15, marginTop: 10, paddingTop: 5, paddingLeft: 5, paddingRight: 5}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            {DistributionDataToRender?.map((i, index) => (
              <View style={styles.Schedules} key={index}>
                <View style={{flex: 0.8, padding: 10, paddingLeft: 30}}>
                  <View style={{flex: 0.6, justifyContent: 'center'}}>
                    <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 18}}>{i["Distribution Name"]}</Text>
                  </View>
                  <View style={{flex: 0.4, justifyContent: 'center'}}>
                    <Text style={{color: 'black', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 10}}>{i["Local Address"]}, {i["City"]}</Text>
                  </View>
                </View>
              </View>
            ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PartneredLibraries

const styles = StyleSheet.create({
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#d6d3da',
        padding: 10,
        borderRadius: 10,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        fontSize: 16,
        paddingLeft: width * 0.12,
        color: 'black',
    },
    BackButtonBox: {flex: 1, justifyContent: 'center', alignItems: 'flex-start'},
    BackButtonImage: {height: 15, width: 15},
    Schedules: {
      height: 60,
      borderRadius: 15,
      backgroundColor: 'white',
      marginBottom: 5,
      flexDirection: 'row'
    }
})