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
    Modal,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Button,
    Dimensions
  } from 'react-native';
  import { BlurView } from "@react-native-community/blur";
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
import { ScheduleArrayItem } from './AddTiming';
import { nanoid} from "@reduxjs/toolkit";
import { addScheduleObject, removeScheduleObject } from '../../app/Slice';
import { CombinedNavigationProp } from '../../App';
import LeftArrow from '../Images/LeftArrow.png'
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type PreviousSchedulePropsType = {
    PrevScheduleStatus: boolean
    setPrevScheduleStatus: SetState<boolean>
    navigation: CombinedNavigationProp
    ScheduleArray: ScheduleArrayItem[];
    Message: string;
}

const PreviousSchedule = (props: PreviousSchedulePropsType) => {
  // const navigation = useNavigation<CombinedNavigationProp>();
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  const dispatch = useDispatch();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const currentDateStringFormat = (`${currentDay.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`)
  const data = {
    "uniqueID": ScheduleArray.map((item: ScheduleArrayItem) => item.uniqueID),
    "StartTime": ScheduleArray.map((item: ScheduleArrayItem) => item.StartTime),
    "EndTime": ScheduleArray.map((item: ScheduleArrayItem) => item.EndTime),
    "Work": ScheduleArray.map((item: ScheduleArrayItem) => item.Work),
    "StartAngle": ScheduleArray.map((item: ScheduleArrayItem) => item.StartAngle),
    "EndAngle": ScheduleArray.map((item: ScheduleArrayItem) => item.EndAngle),
    "TaskDate": ScheduleArray.map((item: ScheduleArrayItem) => item.TaskDate),
    "Slice_Color": [
    "rgba(175, 193, 85, 0.5)",
    "rgba(182, 108, 239, 0.5)",
    "rgba(78, 161, 40, 0.5)",
    "rgba(71, 214, 63, 0.5)",
    "rgba(19, 249, 16, 0.5)",
    "rgba(69, 221, 118, 0.5)", 
    "rgba(17, 150, 214, 0.5) ",
    "rgba(174, 182, 155, 0.5)",
    "rgba(54, 147, 187, 0.5) ",
    "rgba(49, 107, 93, 0.5)",
    "rgba(12, 248, 250, 0.5) ",
    "rgba(146, 120, 43, 0.5)", 
    "rgba(38, 3, 93, 0.5)",
    "rgba(240, 19, 80, 0.5)",
    "rgba(227, 127, 0, 0.5)",
    "rgba(38, 131, 56, 0.5)",
    "rgba(57, 190, 200, 0.5)",
    "rgba(28, 79, 20, 0.5)",
    "rgba(82, 176, 27, 0.5)",
    "rgba(191, 115, 181, 0.5)"
    ],
  }

  const colorArray = [
    "rgba(175, 193, 85, 0.5)",
    "rgba(182, 108, 239, 0.5)",
    "rgba(78, 161, 40, 0.5)",
    "rgba(71, 214, 63, 0.5)",
    "rgba(19, 249, 16, 0.5)",
    "rgba(69, 221, 118, 0.5)", 
    "rgba(17, 150, 214, 0.5) ",
    "rgba(174, 182, 155, 0.5)",
    "rgba(54, 147, 187, 0.5) ",
    "rgba(49, 107, 93, 0.5)",
    "rgba(12, 248, 250, 0.5) ",
    "rgba(146, 120, 43, 0.5)", 
    "rgba(38, 3, 93, 0.5)",
    "rgba(240, 19, 80, 0.5)",
    "rgba(227, 127, 0, 0.5)",
    "rgba(38, 131, 56, 0.5)",
    "rgba(57, 190, 200, 0.5)",
    "rgba(28, 79, 20, 0.5)",
    "rgba(82, 176, 27, 0.5)",
    "rgba(191, 115, 181, 0.5)"
  ]

  // const dmyFormatConverter = (date: string) => {
  //   const [year, month, day] = date.split('-');
  //   return `${day}/${month}/${year}`;
  // }
  function randomColorIndex() {
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return randomIndex;
  }

  const ymdFormatConverter = (date: string) => {
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
  }

  function PastMostRecentDate(targetDate: string, dateArray: string[]) {
    let remainingDate = []
    for (let index = 0; index < dateArray.length; index++) {
      const element = new Date(ymdFormatConverter(dateArray[index]));
      if (element < new Date(ymdFormatConverter(targetDate))) {
          remainingDate.push(element)
      }
    }
    const latestDate = new Date(Math.max(...remainingDate.map(date => date.getTime())));
    const day = latestDate.getDate()
    const month = latestDate.getMonth()
    const fullYear = latestDate.getFullYear()
    const convertedLatestDate = `${day.toString().padStart(2, '0')}/${(month+1).toString().padStart(2, '0')}/${fullYear}`
    return convertedLatestDate
  }

  const MostRecentDate = PastMostRecentDate(currentDateStringFormat, data["TaskDate"])

  const TwelveHourFormat = (time: string) => {
    let NumberHour = Number(time.split(':', 1));
    let MinuteHour = Number(time.slice(3, 5));
    if (NumberHour > 12) {
      return `${NumberHour - 12}:${time.slice(3, 5)} PM`;
    } else if (NumberHour == 12 && MinuteHour >= 0) {
      return `${time} PM`;
    } else if (time.length > 5) {
      return time;
    } else {
      return `${time} AM`;
    }
  };

  const RecentDayWorksList: ScheduleArrayItem[] = []

  function ApplyButton() {
    for (let index = 0; index < RecentDayWorksList.length; index++) {
      const eachWork = RecentDayWorksList[index];
      dispatch(addScheduleObject(eachWork));
    }
    props.setPrevScheduleStatus(false)
    props.navigation.navigate('DrawerScreens', {
      screen: 'TabsDrawer',
      params: {
        screen: 'ScheduleTab',
        params: undefined
      },
    })
  }

  return (
    <Modal transparent= {true} visible={props.PrevScheduleStatus} animationType='fade'>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BlurView
          style={styles.blurStyle}
          blurType="dark"
          blurAmount={10}
          // reducedTransparencyFallbackColor="light"
        />
        <View style={[styles.selectionDialogBox]}>
            <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={50}
            // reducedTransparencyFallbackColor="black"
            />
            <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'grey'}}>
            <TouchableOpacity onPress={() => props.setPrevScheduleStatus(false)} style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={LeftArrow} style={{height: 17, width: 17}}/>
            </TouchableOpacity>
            <View style={{flex: 0.8, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>Previous Schedule</Text>
            </View>
            <View style={{flex: 0.1}}>

            </View>
            </View>
            <View style={{flex: 7, paddingLeft: 10,paddingRight: 10, paddingTop: 10}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {data['TaskDate']
            .map((TaskDate:string, index:number) => ({TaskDate, index}))
            .filter(({TaskDate}) => TaskDate === MostRecentDate)
            .map(({index}) => {
              const uniqueID = data['uniqueID'][index]
              const startTime = data['StartTime'][index]
              const endTime = data['EndTime'][index]
              const angleWork = data['Work'][index]
              const StartAngle = data['StartAngle'][index]
              const EndAngle = data['EndAngle'][index]
              const TaskDate = data['TaskDate'][index]
              const color = colorArray[randomColorIndex()]
              let newTask = {
                uniqueID: nanoid(10),
                StartTime: startTime,
                EndTime: endTime,
                Work: angleWork,
                StartAngle: StartAngle ?? 0,
                EndAngle: EndAngle ?? 0,
                TaskDate: currentDateStringFormat,
                Slice_Color: color
              };
              RecentDayWorksList.push(newTask)
                return (
                <View key={uniqueID} style={{height: 40, borderRadius: 10, backgroundColor: '#8a8a8a', flexDirection: 'row', paddingLeft: 20, paddingRight: 10, marginBottom: 5}}>
                    <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>{angleWork}</Text>
                    </View>
                    <View style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white'}}>{TwelveHourFormat(startTime)} - {TwelveHourFormat(endTime)}</Text>
                    </View>
                </View>
            )})}
            </ScrollView>
            </View>
            {/* 457fdf */}
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}}>
                <TouchableOpacity onPress={ApplyButton}>
                    <Text style={{color: '#548ff0', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  )
}

export default PreviousSchedule

const styles = StyleSheet.create({
    blurStyle: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    selectionDialogBox: {
        flexDirection: 'column',
        height: 400,
        width: 320,
        borderRadius: 20,
        overflow: 'hidden'
        // backgroundColor: 'black',       // Disabled because of iOS
        // opacity: 0.85,                  // Disabled because of iOS
    },
})