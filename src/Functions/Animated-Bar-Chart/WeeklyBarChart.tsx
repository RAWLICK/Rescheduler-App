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

type WeeklyBarChartPropsType = {
  selectedWeekStart: Date;
  selectedWeekEnd: Date;
}

export default function WeeklyBarChart(props: WeeklyBarChartPropsType) {
  const [WeekChangeImport, setWeekChangeImport ] = useState<number>(0)
  const {WeekChange} = require('../../Components/Tabs/Statistics.tsx')
  const currentDate = new Date();

  const [maxMinThisWeek, setmaxMinThisWeek] = useState<number>(300)

  function StringDateToDateConvert(stringDate: string) {
    // + converts string to number
    let [day, month, year] = stringDate.split('/')
    const createdDate = new Date(Date.UTC(+year, +month - 1, +day))
    return createdDate
  }

  function ExtractingMins(duration: string) {
    const minute = Number(duration.split("min")[0])
    return minute
  }

  let MaxValueGot = 200
  function FindingMaxMinuteOfWeek(selectedWeekStart: Date, selectedWeekEnd: Date) {
    const AllSubjectsMinsOfWeek = [];

    for (let index = 0; index < demoData.length; index++) {
      let AddingDurationArray: string[] = []
      let SumOfAddingDurationArray = 0
      let eachSubjectObj = demoData[index];
      for (let indexTwo = 0; indexTwo < eachSubjectObj['Dataframe'].length; indexTwo++) {
        const eachDataframeObject = eachSubjectObj['Dataframe'][indexTwo];

        if (StringDateToDateConvert(eachDataframeObject["Date"]) >= selectedWeekStart && selectedWeekEnd >= StringDateToDateConvert(eachDataframeObject["Date"])) {
          AddingDurationArray.push(eachDataframeObject["Work-Done-For"])
        }
      }
      for (let index = 0; index < AddingDurationArray.length; index++) {
        const eachDuration = AddingDurationArray[index];
        SumOfAddingDurationArray += ExtractingMins(eachDuration)
      }
      AllSubjectsMinsOfWeek.push(SumOfAddingDurationArray)
    }

    const maxValue = Math.max(...AllSubjectsMinsOfWeek);
    MaxValueGot = maxValue
    setmaxMinThisWeek(maxValue);
  }
  useEffect(() => {
    FindingMaxMinuteOfWeek(props.selectedWeekStart, props.selectedWeekEnd);
    // console.log(MaxValueGot)
  }, [props.selectedWeekStart])

  useEffect(() => {
    console.log("maxMinThisWeek: ", maxMinThisWeek)
  }, [maxMinThisWeek])

  return (
    <>
    <View style={styles.container}>
      {/* Thanks to ChatGPT for this acurate mapped code */}
      {demoData.map((eachSubject, index) => {
        // Filter the Dataframe for dates within the range
        const filteredDataframe = eachSubject.Dataframe.filter((eachDataframeObject) => {
          const date = StringDateToDateConvert(eachDataframeObject.Date);
          return date >= props.selectedWeekStart && date <= props.selectedWeekEnd;
        });
        // console.log("Filtered Dataframe: ", filteredDataframe)
        // Extract Work-Done-For values from filtered Dataframe
        const workDoneValues = filteredDataframe.map((eachDataframeObject) => eachDataframeObject["Work-Done-For"]);

        // You can calculate a specific value (e.g., total, average, etc.)
        const totalWorkDone = workDoneValues.reduce((total, value) => {
          // Convert "60min" to a number (60)
          const numericValue = parseInt(value.replace("min", ""), 10);
          return total + numericValue;
        },0);
        return (
          <View key={index}>
            <SingleBarChart value={totalWorkDone/(maxMinThisWeek + 50)}/>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 7, color: "white" }}>{eachSubject.Subject}</Text>
            </View>
          </View>
        );
      })}
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