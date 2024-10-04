import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import Remove from '../Images/Remove.png'

const ScheduleTable = () => {
  interface ScheduleArrayItems {
    StartTime: string,
    EndTime: string,
    Work: string,
    StartAngle: number,
    EndAngle: number
  }
  const {ScheduleArray} = require('./AddTiming')
  const safeScheduleArray : [] = ScheduleArray ?? []
  // const [safeScheduleArray, setSafeScheduleArray] = useState<[]>(ScheduleArray ?? [])

  function setScheduleArrayFunction() {
    return safeScheduleArray
  }

  const data = {
    "StartTime": safeScheduleArray.map((item: ScheduleArrayItems) => item.StartTime),
    "EndTime": safeScheduleArray.map((item: ScheduleArrayItems) => item.EndTime),
    "Work": safeScheduleArray.map((item: ScheduleArrayItems) => item.Work),
    "StartAngle": safeScheduleArray.map((item: ScheduleArrayItems) => item.StartAngle),
    "EndAngle": safeScheduleArray.map((item: ScheduleArrayItems) => item.EndAngle),
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

  const TwelveHourFormat = (time: string) => {
    let NumberHour = Number(time.split(':', 1))
    let MinuteHour = Number(time.slice(3, 5))
    if (NumberHour > 12) {
      return `${NumberHour - 12}:${time.slice(3, 5)} PM`
    }
    else if (NumberHour == 12 && MinuteHour >= 0) {
      return `${time} PM`
    }
    else if (time.length > 5) {
      return time
    }
    else {
      return `${time} AM`
    }
  }

  useEffect(() => {
    console.log("safeScheduleArray in Time Table", safeScheduleArray)
  }, [])

  function DeleteTask(name: string) {
    let EditedArray = safeScheduleArray.filter((obj: ScheduleArrayItems) => obj.Work !== name)
    // setSafeScheduleArray(EditedArray)
    console.log("Edited Array: ", EditedArray)
  }
  return (
    <View style={{backgroundColor: '#e7e7e7'}}>
      <View style={styles.HeadingArea}>
        <Text style={styles.Heading}>Schedule Table</Text>
      </View>
      <View style={styles.ScheduleArea}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {data['StartAngle'].map((startAngle, index) => { 
          const startTime = data['StartTime'][index]
          const endTime = data['EndTime'][index]
          const angleWork = data['Work'][index]
          return (
          <View style={styles.Schedules} key={index}>
            <View style={{flex: 0.8, padding: 10, paddingLeft: 30}}>
              <View style={{flex: 0.6, justifyContent: 'center'}}>
                <Text style={{color: 'black', fontFamily: 'sf-pro-display-medium', fontSize: 18}}>{angleWork}</Text>
              </View>
              <View style={{flex: 0.4, justifyContent: 'center'}}>
                <Text style={{color: 'black', fontFamily: 'sf-pro-display-medium', fontSize: 10}}>{TwelveHourFormat(startTime)} - {TwelveHourFormat(endTime)}</Text>
              </View>
            </View>
            <TouchableOpacity style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}} onPress={() => DeleteTask(angleWork)}>
              <Image source={Remove} style={{height: 20, width: 20}}/>
            </TouchableOpacity>
          </View>
          )
        })}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  HeadingArea: {
    height: 50,
    // justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: 0.5,
    borderColor: '#d3d3d3',
    paddingTop: 15
  },

  Heading: {
    color: 'black',
    fontFamily: 'sf-pro-display-bold',
    fontSize: 20
  },

  ScheduleArea: {
    margin: 15
  },

  Schedules: {
    height: 60,
    borderRadius: 15,
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row'
  }
})

export default ScheduleTable