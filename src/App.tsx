import React from 'react';
import { useRef, useEffect } from 'react';
import { NavigationContainer, CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets, StackNavigationProp } from '@react-navigation/stack';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import AddTiming from './Components/Screens/AddTiming';
import Schedule from './Components/Tabs/Schedule';
import Statistics from './Components/Tabs/Statistics';
import TaskCompletionBoard from './Components/Screens/TaskCompletionBoard';
import OtpVerificaton from './Components/Authentication/OtpVerificaton';
import Settings from './Components/Drawer/Settings';
import PartneredLibraries from './Components/Drawer/PartneredLibraries';
import AppDistributor from './Components/Drawer/AppDistributor';
import AdminPanel from './Components/Drawer/AdminPanel';
import RoughComponent from './Components/Rough Work/RoughComponent';
import RoughComponentTwo from './Components/Rough Work/RoughComponentTwo';
import CustomDrawerContent from './Components/Drawer/CustomDrawerContent';
import SignIn from './Components/Authentication/SignIn';
import SignUp from './Components/Authentication/SignUp';
import { View, Text, TouchableOpacity, Button, ImageSourcePropType, StyleSheet, Image, GestureResponderEvent, Platform, Alert} from 'react-native'
import { useState } from 'react';
import RescheduleIcon from './Components/Images/Reschedule.png'
import StatisticsIcon from './Components/Images/StatisticsIcon.png'
import OnBoardingScreen from './Components/Authentication/OnBoardingScreen';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../src/app/Store';
import Subscription from './Components/Drawer/Subscription';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import SplashScreen from 'react-native-splash-screen';
import { addDays } from "date-fns";

// This below code helps prevent systum font overriding on application's font
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  allowFontScaling: false,
};

type StackParamList = {
  AddTimingStack: undefined;
  SignInStack: undefined;
  SignUpStack: undefined;
  OtpVerificationStack: { Process: string, PhoneNumber: string };
  TaskCompletionBoardStack: undefined;
  OnBoardingScreenStack: undefined;
  // RoughComponentStack: undefined;
  // RoughCompTwo: undefined;
};

type DrawerParamList = {
  TabsDrawer: {
   screen: keyof TabParamList;  // Match with TabParamList
   params?: TabParamList[keyof TabParamList];  // Include Tab parameters
  };
  // SettingsDrawer: undefined;
  PartneredLibrariesDrawer: undefined;
  SubscriptionDrawer:  undefined;
  AppDistributorDrawer: undefined;
  AdminPanelDrawer: undefined;
};

type TabParamList = {
  ScheduleTab: undefined;
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

  const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
  const DemoNumberHere = useSelector((state: RootState) => state.DemoArraySliceReducer.DemoArrayInitialState)
  const LocalStorageInfo = useSelector((state: RootState) => state.LocalStorageInfoSliceReducer.LocalStorageInfoInitialState)

  function TrialValidity() {
    // const currentDate = new Date();
    // const formatDate = (dateStr: string) => {
    //   const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
    //   return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
    // };
    // if (currentDate >= addDays(formatDate(StudentInfoData["Date Joined"]), 7) && StudentInfoData["Subscription Type"] == "Free") {
    // // if (currentDate >= addDays(formatDate("02/05/2025"), 7) && StudentInfoData["Subscription Type"] == "Free") {
    //   Alert.alert("Trial Ended", `Your 7 Days Trial Ended. Kindly Subscribe to continue`)
    //   return false;
    // }
    return true;
  }

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, [])

  type CustomTabButtonPropTypes = {
    label: string,
    onPress: ((e: GestureResponderEvent) => void) | undefined,
    Icon: ImageSourcePropType,
    isFocused: boolean | undefined
  }

  function CustomTabButton ({label, onPress, Icon, isFocused}: CustomTabButtonPropTypes) {
    const insets = useSafeAreaInsets();
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center',
        //  paddingBottom: insets.bottom > 0 ? insets.bottom : 4
        }}
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
      // <Stack.Navigator initialRouteName={LocalStorageInfo["IsFirstLaunch"]? "OnBoardingScreenStack": "SignInStack"}>
      <Stack.Navigator initialRouteName={"TaskCompletionBoardStack"}>
        <Stack.Screen name="AddTimingStack" component={AddTiming} options={{ headerShown: false}}/>
        <Stack.Screen name="SignInStack" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpStack" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="OtpVerificationStack" component={OtpVerificaton} options={{ headerShown: false }} />
        <Stack.Screen name="TaskCompletionBoardStack" component={TaskCompletionBoard} options={{ headerShown: false }} />
        <Stack.Screen name="OnBoardingScreenStack" component={OnBoardingScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="RoughCompTwo" component={RoughComponentTwo} options={{ headerShown: false }}/> */}
      </Stack.Navigator>
    );
  };

  function DrawerNav() {
    return (
    <Drawer.Navigator initialRouteName={TrialValidity() == false? "SubscriptionDrawer" : "TabsDrawer"}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
      drawerStyle: {
        backgroundColor: '#111827',
        width: 240,
      },
      // drawerActiveTintColor: '#22d3ee',
      drawerActiveTintColor: '#a150f3',
      drawerInactiveTintColor: '#9ca3af',
      drawerLabelStyle: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold'
      },
    }}
    >
      <Drawer.Screen name="TabsDrawer" component={Tabs} options={{ headerShown: false, title: "Schedule"}}/>
      {/* <Drawer.Screen name="SettingsDrawer" component={Settings} options={{ headerShown: false, title: "Settings"}}/> */}
      <Drawer.Screen name="PartneredLibrariesDrawer" component={PartneredLibraries} options={{ headerShown: false, title: "Partnered Libraries"}}/>
      <Drawer.Screen name="SubscriptionDrawer" component={Subscription} options={{ headerShown: false, title: "Subscription"}}/>
      { (StudentInfoData?.["Type of Account"] == "Distributor" || StudentInfoData?.["Type of Account"] == "Admin") &&
      <Drawer.Screen name="AppDistributorDrawer" component={AppDistributor} options={{ headerShown: false, title: "App Distributor"}}/>
      }
      { StudentInfoData?.["Type of Account"] == "Admin" &&
      <Drawer.Screen name="AdminPanelDrawer" component={AdminPanel} options={{ headerShown: false, title: "Admin Panel"}}/>
      }
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
          const label = route.name === 'ScheduleTab' ? 'Schedule' :
                    route.name === 'StatisticsTab' ? 'Statistics' :
                    route.name;
          let icon;
          if (route.name == 'ScheduleTab') {
            icon = RescheduleIcon;
          }
          else if (route.name == 'StatisticsTab') {
            icon = StatisticsIcon;
          }
          return (
            <CustomTabButton
             label={label}
             Icon={icon}
             isFocused={isFocused}
             onPress={onPress} />
          );
        },

        tabBarStyle: {
          backgroundColor: '#d2cfe4',
          height: Platform.OS == 'ios' ? 70 : 60,
          paddingBottom: Platform.OS == 'ios' ? 8 : 10,
        },
      })}
      >
        <Tab.Screen name="ScheduleTab" component={Schedule} options={{ headerShown: false }}/>
        <Tab.Screen name="StatisticsTab" component={Statistics} options={{ headerShown: false }}/>
        {/* <Tab.Screen name="RoughComp" component={RoughComponent} options={{ headerShown: false }}/> */}
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {/* <NativeStack.Navigator initialRouteName={LocalStorageInfo["IsLoggedIn"]? "DrawerScreens": "StackScreens"}> */}
      <NativeStack.Navigator initialRouteName={"StackScreens"}>
        <NativeStack.Screen name="StackScreens" component={StackScreen} options={{ headerShown: false, animation:'slide_from_left' }}/>
        <NativeStack.Screen name="DrawerScreens" component={DrawerNav} options={{ headerShown: false }}/>
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
