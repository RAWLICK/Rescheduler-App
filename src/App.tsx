import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Schedule from './Components/Schedule';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddTiming from './Components/AddTiming';
import Calender from './Components/Calender';
import Statistics from './Components/Statistics';
import Notes from './Components/Notes';
import Navbar from './Components/Navbar';
import Taskbar from './Components/Taskbar';


function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Navbar/>
      <Stack.Navigator initialRouteName="Schedule">
        <Stack.Screen name="Schedule" component={Schedule} options={{ headerShown: false }}/>
        <Stack.Screen name="AddTiming" component={AddTiming} options={{ headerShown: false }}/>
        <Stack.Screen name="Calender" component={Calender} options={{ headerShown: false }}/>
        <Stack.Screen name="Statistics" component={Statistics} options={{ headerShown: false }}/>
        <Stack.Screen name="Notes" component={Notes} options={{ headerShown: false }}/>
      </Stack.Navigator>
      <Taskbar/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});

export default App;
