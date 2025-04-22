import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import ScheduleTable from '../Screens/ScheduleTable'
import { useDispatch, useSelector } from 'react-redux' 
import { addScheduleObject, removeScheduleObject } from '../../app/Slice'
import { RootState } from '../../app/Store'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  clamp,
  runOnJS,
} from 'react-native-reanimated';
import useInternetCheck from '../Authentication/InternetCheck';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
// import SpInAppUpdates, {
//   NeedsUpdateResponse,
//   IAUUpdateKind,
//   StartUpdateOptions,
// } from 'sp-react-native-in-app-updates';

// Dispatch, reducer ko use karte hue store me changes karta hai
const Settings = () => {
  const isConnected = useInternetCheck();
  const dispatch = useDispatch();
  const ScheduleArray = useSelector((state: RootState) => state.ScheduleArraySliceReducer.ScheduleArrayInitialState)
  useEffect(() => {
    console.log("Is Connected from Settings: ", isConnected)
    if (isConnected == false) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'No Internet',
        textBody: "Please turn on mobile data or Wi-Fi. Don't Worry, we don't show ADs 😌",
        closeOnOverlayTap: false
      })
    }
    else {
      Dialog.hide();
    }
  }, [isConnected])
  return (
    <GestureHandlerRootView>
      <View style={{flex: 1}}>
        <View style={{flex: 1, paddingTop: 300}}>
          {/* <Text style={{fontSize: 100}}>Settings</Text> */}
          <AlertNotificationRoot>
            <View>
              {/* // dialog box */}
              <Button
                title={'dialog box'}
                onPress={() =>
                  Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Success',
                    textBody: 'Congrats! this is dialog box success',
                    button: 'close'
                    // closeOnOverlayTap: false
                  })
                }
              />
              {/* // toast notification */}
              <Button
                title={'toast notification'}
                onPress={() =>
                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Success',
                    textBody: 'Congrats! this is toast notification success',
                  })
                }
              />
            </View>
        </AlertNotificationRoot>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}


export default Settings

const styles = StyleSheet.create({})