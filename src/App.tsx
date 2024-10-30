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
import { View, Text, TouchableOpacity, Button, ImageSourcePropType, StyleSheet, Image, GestureResponderEvent} from 'react-native'
import { useState } from 'react';
import RescheduleIcon from './Images/Reschedule.png'
import StatisticsIcon from './Images/Statistics.png'

type StackParamList = {
  AddTimingStack: undefined;
  // RoughCompTwo: undefined;
};

// type DrawerParamList = {
//   ScheduleDrawer: { ScheduleArray : [] };
// };

type TabParamList = {
  ScheduleTab: { ScheduleArray : [] };
  StatisticsTab: undefined;
  // RoughComp: { parentParam: string, secondParam: number };
};

type NativeStackParamList = {
  StackScreens: undefined;
  // DrawerScreens: undefined;
  TabScreens: undefined;
};

function App(): React.JSX.Element {

  const Stack = createStackNavigator<StackParamList>();
  // const Drawer = createDrawerNavigator<DrawerParamList>();
  const Tab = createBottomTabNavigator<TabParamList>();
  const NativeStack = createNativeStackNavigator<NativeStackParamList>();

  type CustomTabButtonPropTypes = {
    label: string,
    onPress: ((e: GestureResponderEvent) => void) | undefined,
    Icon: ImageSourcePropType,
    isFocused: boolean | undefined
  }
  function CustomTabButton ({label, onPress, Icon, isFocused}: CustomTabButtonPropTypes) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={onPress}>  
        <View style={[styles.IconView,
          {backgroundColor: isFocused ? '#C1BED5' : '#d2cfe4'}
          ]}>
          <Image source={Icon} style={[styles.TaskbarIcons, {tintColor: isFocused ? 'black' : 'grey'}]}/>
        </View>
        <Text style={[styles.IconTitle, {fontFamily: isFocused ? 'sf-pro-display-bold' : 'sf-pro-display-medium'}, {color: isFocused ? 'black' : 'grey'}]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  function StackScreen() {
    return (
      <Stack.Navigator screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
        <Stack.Screen name="AddTimingStack" component={AddTiming} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="RoughCompTwo" component={RoughComponentTwo} options={{ headerShown: false }}/> */}
      </Stack.Navigator>
    );
  };

  // function DrawerNav() {
  //   return (
  //   <Drawer.Navigator initialRouteName="ScheduleDrawer">
  //     <Drawer.Screen name="ScheduleDrawer" component={Schedule} options={{ headerShown: false}}/>
  //   </Drawer.Navigator>
  //   )
  // }

  function Tabs() {
    return (
      <Tab.Navigator initialRouteName="ScheduleTab" screenOptions={ ({route}) => ({
        tabBarButton: (props) => {
          const {onPress, accessibilityState} = props;
          const isFocused = accessibilityState?.selected || false;

          let icon;
          if (route.name == 'ScheduleTab') {
            icon = RescheduleIcon;
          }
          else if (route.name == 'StatisticsTab') {
            icon = StatisticsIcon;
          }
          return (
            <CustomTabButton
             label={route.name}
             Icon={icon}
             isFocused={isFocused}
             onPress={onPress} />
          );
        },

        tabBarStyle: {
          backgroundColor: '#d2cfe4',
          height: 60
          // paddingBottom: 10,
        }
      })}
      >
        <Tab.Screen name="ScheduleTab" component={Schedule} options={{ headerShown: false }}/>
        <Tab.Screen name="StatisticsTab" component={Statistics} options={{ headerShown: false}}/>
        {/* <Tab.Screen name="RoughComp" component={RoughComponent} options={{ headerShown: false }}/> */}
      </Tab.Navigator>
    );
  }


  return (
    <NavigationContainer>
      <NativeStack.Navigator initialRouteName="TabScreens">
        <NativeStack.Screen name="StackScreens" component={StackScreen} options={{ headerShown: false, animation:'slide_from_right' }}/>
        {/* <NativeStack.Screen name="DrawerScreens" component={DrawerNav} options={{ headerShown: false }}/> */}
        <NativeStack.Screen name="TabScreens" component={Tabs} options={{ headerShown: false, animation:'slide_from_right' }}/>
      </NativeStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  IconView: {
    padding: 3,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 20
  },

  TaskbarIcons: {
    height: 25,
    width: 25
  },

  IconTitle: {
    fontSize: 11,
    fontFamily: 'sf-pro-display-medium'
  }
})

export default App;
