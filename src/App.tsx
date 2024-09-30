import React from 'react';
import type {PropsWithChildren} from 'react';
import Schedule from './Components/Schedule';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AddTiming from './Components/AddTiming';
import Calender from './Components/Calender';
import Statistics from './Components/Statistics';
import ScheduleTable from './Components/ScheduleTable'
import Notes from './Components/Notes';
import Navbar from './Components/Navbar';
import Taskbar from './Components/Taskbar';
import SignIn from './Components/SignIn';

function App(): React.JSX.Element {
  const ModalStack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const NativeStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

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

  function ModalNav() {
    return (
    <ModalStack.Navigator>
      <ModalStack.Group screenOptions={{ presentation: 'modal' }}>
        <ModalStack.Screen name='ScheduleTable' component={ScheduleTable} options={{ headerShown: false }}/>
      </ModalStack.Group>
    </ModalStack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <NativeStack.Navigator initialRouteName="Sched">
        <NativeStack.Screen name="Sched" component={HomeTabs} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="Stats" component={HomeTabs} options={{ headerShown: false }}/> */}
        <NativeStack.Screen name="AddTiming" component={AddTiming} options={{ headerShown: false }}/>
        <NativeStack.Screen name="HandlingModals" component={ModalNav} options={{ headerShown: false }}/>
      </NativeStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
