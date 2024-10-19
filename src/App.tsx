import React from 'react';
import { useRef } from 'react';
import type {PropsWithChildren} from 'react';
import Schedule from './Components/Schedule';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AddTiming from './Components/AddTiming';
import Calender from './Components/Calender';
import Statistics from './Components/Statistics';
import RoughComponent from './Components/RoughComponent';
import RoughComponentTwo from './Components/RoughComponentTwo';
import ScheduleTable from './Components/ScheduleTable';
import Notes from './Components/Notes';
import Navbar from './Components/Navbar';
import Taskbar from './Components/Taskbar';
import SignIn from './Components/SignIn';
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { useState } from 'react';

type NativeStackParamList = {
  RoughComp: { parentParam: string }; // ParentScreen expects a parameter called 'parentParam'
  RoughCompTwo: undefined; // ChildScreen doesn't need any parameters
};

function App(): React.JSX.Element {

  const Drawer = createDrawerNavigator();
  const NativeStack = createNativeStackNavigator<NativeStackParamList>();
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  function StackScreen() {
    return (
      <Stack.Navigator screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
        <Stack.Screen name="AddTiming" component={AddTiming} initialParams={{ itemId: 42 }} options={{ headerShown: false }}/>
      </Stack.Navigator>
    );
  };

  function DrawerNav() {
    return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Schedule} options={{ headerShown: false}}/>
      <Drawer.Screen name="backh" component={Statistics} options={{ headerShown: false}}/>
      {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
    </Drawer.Navigator>
    )
  }

  function HomeTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Schedule" component={DrawerNav} options={{ headerShown: false}}/>
        <Tab.Screen name="Statistics" component={Statistics} options={{ headerShown: false}}/>
      </Tab.Navigator>
    );
  }


  return (
    <NavigationContainer>
      <NativeStack.Navigator initialRouteName="RoughComp">
        {/* <NativeStack.Screen name="Sched" component={HomeTabs} options={{ headerShown: false }}/> */}
        <NativeStack.Screen name="RoughComp" component={RoughComponent} options={{ headerShown: false }}/>
        <NativeStack.Screen name="RoughCompTwo" component={RoughComponentTwo} options={{ headerShown: false }}/>
        {/* <NativeStack.Screen name="AddTimingStack" component={StackScreen} options={{ headerShown: false }}/> */}
      </NativeStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
