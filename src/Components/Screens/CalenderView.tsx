import { View, Text } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
// import Navbar from './Navbar'
import {Calendar, CalendarList, Agenda, DateData} from 'react-native-calendars';
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type CalenderViewProps = {
  selectedDate: string
  setSelectedDate: SetState<string>
}
const CalenderView = (props: CalenderViewProps) => {
  const [selected, setSelected] = useState('');
  const dmyFormatConverter = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // Putted it in useEffect to avoid infinite loop or "Unable to update a component while rendering a different component" error
  useEffect(() => {
    if (selected != '') {
      props.setSelectedDate(dmyFormatConverter(selected));
    }
  }, [selected])
  
  return (
    <View>
      <Calendar
      onDayPress={(day: DateData) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
      style={{
        borderWidth: 1,
        borderColor: 'gray',
        height: 350,
      }}
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#00adf5',
        dayTextColor: '#2d4150',
        textDisabledColor: '#dd99ee',
        textDayFontFamily: 'sf-pro-display-medium',
        textMonthFontFamily: 'sf-pro-display-bold',
        textDayHeaderFontFamily: 'sf-pro-display-bold',
        // 'stylesheet.day.basic': {
        //   container: {
        //     backgroundColor: 'grey'
        //   }
        // }
      }}
      />
    </View>
  )
}

export default CalenderView