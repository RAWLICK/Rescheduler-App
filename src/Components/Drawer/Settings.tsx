import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import ScheduleTable from '../Screens/ScheduleTable'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {addTodo, removeTodo} from '../../app/Slice'

// Dispatch, reducer ko use karte hue store me changes karta hai
const Settings = () => {
  const dispatch = useDispatch();
  const addToDoHandler = () => {
    dispatch(addTodo("Hello Fucking World"));
  }
  addToDoHandler();
  const todos = useSelector(state => state.todos)
  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 100}}>Settings</Text>
      <ScheduleTable/>
    </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({})