import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Modal,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Button,
    Dimensions
  } from 'react-native';
  import { BlurView } from "@react-native-community/blur";
import React from 'react'
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type PreviousSchedulePropsType = {
    PrevScheduleStatus: boolean
    setPrevScheduleStatus: SetState<boolean>
}

const PreviousSchedule = (props: PreviousSchedulePropsType) => {
  const handleOutsidePress = () => {
    // Keyboard.dismiss();                // Close keyboard if open
    // props.setPrevScheduleStatus(false)        // Close modal
  };
  return (
    <Modal transparent= {true} visible={props.PrevScheduleStatus} animationType='fade'>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BlurView
          style={styles.blurStyle}
          blurType="dark"
          blurAmount={10}
          // reducedTransparencyFallbackColor="light"
        />
        <View style={[styles.selectionDialogBox]}>
            <BlurView
            style={styles.blurStyle}
            blurType="light"
            blurAmount={50}
            // reducedTransparencyFallbackColor="black"
            />
            <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'grey'}}>
            <View style={{flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#fff'}}>Previous Schedule</Text>
            </View>
            </View>
            <View style={{flex: 7, paddingLeft: 10,paddingRight: 10, paddingTop: 10}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {new Array(100).fill(null).map(( _, weekIndex) => {
                return (
                <View key={weekIndex} style={{height: 40, borderRadius: 10, backgroundColor: '#8a8a8a', flexDirection: 'row', paddingLeft: 20, paddingRight: 10, marginBottom: 5}}>
                    <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white'}}>Physics</Text>
                    </View>
                    <View style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white'}}>09:00 AM - 10:00 AM</Text>
                    </View>
                </View>
            )})}
            </ScrollView>
            </View>
            {/* 457fdf */}
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: 'grey'}}>
                <TouchableOpacity onPress={() => props.setPrevScheduleStatus(false)}>
                    <Text style={{color: '#548ff0', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17}}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
    </Modal>
  )
}

export default PreviousSchedule

const styles = StyleSheet.create({
    blurStyle: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    selectionDialogBox: {
        flexDirection: 'column',
        height: 400,
        width: 320,
        borderRadius: 20,
        overflow: 'hidden'
        // backgroundColor: 'black',       // Disabled because of iOS
        // opacity: 0.85,                  // Disabled because of iOS
    },
})