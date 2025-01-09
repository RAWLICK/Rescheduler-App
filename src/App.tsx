import React from 'react';
import { useRef } from 'react';
import type {PropsWithChildren} from 'react';
import Schedule from './Components/Tabs/Schedule';
import { NavigationContainer, CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets, StackNavigationProp } from '@react-navigation/stack';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import AddTiming from './Components/Screens/AddTiming';
import Calender from './Components/Screens/CalenderView';
import Statistics from './Components/Tabs/Statistics';
import OtpVerificaton from './Components/Authentication/OtpVerificaton';
import Settings from './Components/Drawer/Settings';
import PartneredLibraries from './Components/Drawer/PartneredLibraries';
import RoughComponent from './Components/Rough Work/RoughComponent';
import RoughComponentTwo from './Components/Rough Work/RoughComponentTwo';
import Navbar from './Components/Navbar/Navbar';
import SignIn from './Components/Authentication/SignIn';
import SignUp from './Components/Authentication/SignUp';
import { View, Text, TouchableOpacity, Button, ImageSourcePropType, StyleSheet, Image, GestureResponderEvent} from 'react-native'
import { useState } from 'react';
import RescheduleIcon from './Components/Images/Reschedule.png'
import StatisticsIcon from './Components/Images/Statistics.png'
import { ScheduleArrayItem } from './Components/Screens/AddTiming';

import { ManualScheduleTable } from './Components/Screens/ScheduleTable';
import { CompressedScheduleTable } from './Components/Screens/ScheduleTable';
import ScheduleTable from './Components/Screens/ScheduleTable';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Store, persistor } from './app/Store'
import AppDistributor from './Components/Drawer/AppDistributor';

// This below code helps prevent systum font overriding on application's font
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  allowFontScaling: false,
};

type StackParamList = {
  AddTimingStack: undefined;
  SignInStack: undefined;
  SignUpStack: undefined;
  OtpVerificationStack: undefined;
  // RoughCompTwo: undefined;
};

type DrawerParamList = {
  TabsDrawer: {
   screen: keyof TabParamList;  // Match with TabParamList
   params?: TabParamList[keyof TabParamList];  // Include Tab parameters
  };
  SettingsDrawer: undefined;
  PartneredLibrariesDrawer: undefined;
  AppDistributor: undefined;
};

type TabParamList = {
  ScheduleTab: { ScheduleArray : ScheduleArrayItem[], Message: string };
  StatisticsTab: undefined;
  // RoughComp: { parentParam: string, secondParam: number };
};

type TopTabParamList = {
  ManualTable: undefined;
  RescheduledTable: undefined;
}

type NativeStackParamList = {
  StackScreens: undefined;
  DrawerScreens: {
    screen: keyof DrawerParamList; // Ex- TabsDrawer, SettingsDrawer, PartneredLib
    params?: {
      screen: keyof TabParamList;  // Ex- Schedule Tabs, Statistics Tab
      params: TabParamList[keyof TabParamList];
    };
  };
  TopTabScreens: undefined;
};

export type CombinedNavigationProp =
  CompositeNavigationProp<
    NativeStackNavigationProp<NativeStackParamList>,
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList>,
      CompositeNavigationProp<
        DrawerNavigationProp<DrawerParamList>,
        CompositeNavigationProp<
        MaterialTopTabNavigationProp<TopTabParamList>,
        StackNavigationProp<StackParamList>
       > 
    >   
  >
>;

export type CombinedRouteProp = RouteProp<StackParamList, keyof StackParamList> | RouteProp<DrawerParamList, keyof DrawerParamList> | RouteProp<TabParamList, keyof TabParamList> | RouteProp<NativeStackParamList, keyof NativeStackParamList>

function App(): React.JSX.Element {
  const Stack = createStackNavigator<StackParamList>();
  const Drawer = createDrawerNavigator<DrawerParamList>();
  const Tab = createBottomTabNavigator<TabParamList>();
  const NativeStack = createNativeStackNavigator<NativeStackParamList>();
  const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

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
      <Stack.Navigator initialRouteName='AddTimingStack'>
        <Stack.Screen name="AddTimingStack" component={AddTiming} options={{ headerShown: false }}/>
        <Stack.Screen name="SignInStack" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpStack" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="OtpVerificationStack" component={OtpVerificaton} options={{ headerShown: false }} />
        {/* <Stack.Screen name="RoughCompTwo" component={RoughComponentTwo} options={{ headerShown: false }}/> */}
      </Stack.Navigator>
    );
  };

  function DrawerNav() {
    return (
    <Drawer.Navigator initialRouteName="TabsDrawer">
      <Drawer.Screen name="TabsDrawer" component={Tabs} options={{ headerShown: false, title: "Schedule"}}/>
      <Drawer.Screen name="SettingsDrawer" component={Settings} options={{ headerShown: false, title: "Settings"}}/>
      <Drawer.Screen name="PartneredLibrariesDrawer" component={PartneredLibraries} options={{ headerShown: false, title: "Partnered Libraries"}}/>
      <Drawer.Screen name="AppDistributor" component={AppDistributor} options={{ headerShown: false, title: "App Distributor"}}/>
    </Drawer.Navigator>
    )
  }

  function Tabs() {
    return (
      <Tab.Navigator initialRouteName="ScheduleTab"
       screenOptions={ ({route}) => ({
        tabBarButton: (props) => {
          const {onPress, accessibilityState} = props;
          const isFocused = accessibilityState?.selected || false;
          // const label = route.options?.tabBarLabel || route.name

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
        <Tab.Screen name="ScheduleTab" component={Schedule} options={{ headerShown: false, tabBarLabel: "Schedule" }}/>
        <Tab.Screen name="StatisticsTab" component={Statistics} options={{ headerShown: false, tabBarLabel: "Statistics"}}/>
        {/* <Tab.Screen name="RoughComp" component={RoughComponent} options={{ headerShown: false }}/> */}
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <NativeStack.Navigator initialRouteName="DrawerScreens">
            <NativeStack.Screen name="StackScreens" component={StackScreen} options={{ headerShown: false, animation:'slide_from_left' }}/>
            <NativeStack.Screen name="DrawerScreens" component={DrawerNav} options={{ headerShown: false }}/>
            {/* <NativeStack.Screen name="TabScreens" component={Tabs} options={{ headerShown: false }}/> */}
            {/* <NativeStack.Screen name="TopTabScreens" component={ScheduleTable} options={{ headerShown: false, animation:'slide_from_right' }}/> */}
          </NativeStack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
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
