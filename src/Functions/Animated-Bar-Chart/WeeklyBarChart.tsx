import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BACKGROUND_COLOR, data } from './constants.ts'
import SingleBarChart from './SingleBarChart.tsx'
import { demoData } from './constants.ts'
type DemoDataItemPropsType = {
  uniqueID: string;
  Subject: string;
  Current_Duration: string;
  Dataframe: {
      Date: string;
      Percentage: string;
      Duration: string;
      "Work-Done-For": string;
  }[];
}

export default function WeeklyBarChart() {
  const [WeekChangeImport, setWeekChangeImport ] = useState<number>(0)
  const {WeekChange} = require('../../Components/Tabs/Statistics.tsx')
  useEffect(() => {
    setWeekChangeImport(WeekChange);
    console.log("Week Change Import", WeekChangeImport)
  }, [WeekChange])
  

  return (
    <>
    <View style={styles.container}>
      {data[3 + WeekChangeImport].map((subject, index)  => {
        return(
          <View key={index}>
            <SingleBarChart value={subject.value}/>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 7, color: 'white'}}>{subject.name}</Text>
            </View>
          </View>
        )
      })}
      {/* {demoData.map((eachItem: DemoDataItemPropsType, index: number) => ({eachItem, index}))
      .filter(({eachItem}) => eachItem["Dataframe"]["Date"] ) => {
        return (

        )
      }} */}
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderRadius: 10
    }
})