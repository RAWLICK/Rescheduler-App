import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import React from 'react';
import { useState } from 'react';
import ChevronLeft from '../Images/ChevronLeft.png';
import { useDispatch, useSelector } from 'react-redux' 
import { addExistingSubjectsObject, removeExistingSubjectsObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
import LinearGradient from 'react-native-linear-gradient';
import { TimerPickerModal } from "react-native-timer-picker";
import { nanoid} from "@reduxjs/toolkit";
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type DurationBoxPropsType = {
  showPicker: boolean,
  setShowPicker: SetState<boolean>,
  durationString: string | null
  setDurationString: SetState<string | null>
}

const DurationBox = (props: DurationBoxPropsType) => {
  const formatTime = (pickedDuration: { hours: number, minutes: number, seconds: number}) => {
    return `${pickedDuration.hours}h ${pickedDuration.minutes}min`
  }
  return (
      <TimerPickerModal
          hideSeconds
          padHoursWithZero
          visible={props.showPicker}
          setIsVisible={props.setShowPicker}
          onConfirm={(pickedDuration) => {
            props.setDurationString(formatTime(pickedDuration));
            props.setShowPicker(false);
          }}
          modalTitle="Duration"
          onCancel={() => props.setShowPicker(false)}
          closeOnOverlayPress
          LinearGradient={LinearGradient}
          styles={{ theme: "dark" }}
          modalProps={{ overlayOpacity: 0.2 }}
      />
  )
}

const AddingSubjects = () => {
  const dispatch = useDispatch();
  const [SubjectName, setSubjectName] = useState('');
  const [IsSaved, setIsSaved] = useState(false);
  const color = 'blue';
  const [showPicker, setShowPicker] = useState(false);
  const [durationString, setDurationString] = useState<string | null>('1h 0min');
  const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState);

  const ExistingSubjectSaveButton = async () => {
    const newExistingSubject = {
      "uniqueID": nanoid(10),
      "Subject": SubjectName,
      "Current_Duration": durationString,
      "Dataframe": []
    }
    function MatchingWorks() {
      for (let index = 0; index < ExistingSubjectsArray.length; index++) {
        const element = ExistingSubjectsArray[index];
        if (element["Subject"].toLowerCase() == SubjectName.toLowerCase()) {
          return true
        }
      }
    }
    if (MatchingWorks() == true) {
      Alert.alert("Duplicate Subject", `You have a ${SubjectName} Work already present in Statistics`)
    }
    else if (SubjectName == "") {
      Alert.alert("Empty Subject", `Please enter Subject name`)
    }
    else {
      dispatch(addExistingSubjectsObject(newExistingSubject));
      setIsSaved(true)
      setTimeout(() => {
        setSubjectName('');
        setIsSaved(false)
      }, 1500)
      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/UpdateExistingSubjectsArray':'http://192.168.131.92:5000/UpdateExistingSubjectsArray',
          'https://rescheduler-server.onrender.com/UpdateExistingSubjectsArray',
          {
          method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
          },
          body: JSON.stringify(
            {"uniqueID": StudentInfoData["uniqueID"],
             "Process": "Add",
             "StatsSubjectInfoObject": newExistingSubject
            }
          ), // Convert the request payload to JSON.
        })
  
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data from the server');
        }
      } catch (error) {
        console.error('Catch Error: ', error);
      }
    }
  }   

  return (
    <View
      style={{
        backgroundColor: '#1b1b1d',
        padding: 30,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        rowGap: 15,
      }}>
      <View>
        <Text
          style={{
            fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
            fontSize: 25,
            color: 'white',
            paddingLeft: 10,
          }}>
          Adding Subject
        </Text>
      </View>
      <View style={{ height: 130, rowGap: 1 }}>
        <View style={[styles.UpperOption, { flex: 2 }]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              // alignItems: 'flex-start',
            }}>
            <TextInput
              style={styles.OptionText}
              value={SubjectName}
              onChangeText={setSubjectName}
              placeholder="Work"
              placeholderTextColor="#9D9EA0"></TextInput>
          </View>
        </View>

        <TouchableOpacity style={[styles.BottomOption, { flex: 2 }]}>
          <View
            style={{
              flex: 0.7,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.OptionText}>Duration</Text>
          </View>
          <TouchableOpacity onPress={() => setShowPicker(true)}
            style={{ flex: 0.3, justifyContent: 'center', paddingTop: 15, paddingBottom: 15, paddingLeft: 15 }}>
            <View style={{flex: 1,backgroundColor: 'grey', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'sf-pro-display-bold', color: '#d8d0d0'}}>{durationString}</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>


        {/* <TouchableOpacity style={[styles.BottomOption, { flex: 2 }]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.OptionText}>Color Assigned</Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <View
              style={[
                styles.angleInfoColor,
                { backgroundColor: `${color}` },
              ]}></View>
          </View>
        </TouchableOpacity> */}


        {/* <View style={[styles.BottomOption, { flex: 3 }]}>
          <TextInput
            multiline
            numberOfLines={2}
            style={{
              fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
              fontSize: 16
            }}
            value={SmallNote}
            onChangeText={setSmallNote}
            placeholder="Add a Note"
            placeholderTextColor="#9D9EA0"></TextInput>
        </View> */}
      </View>
      <View style={{ height: 50, padding: 5 }}>
        <TouchableOpacity style={[styles.SaveButtonBox, { backgroundColor: IsSaved ? '#83ff91' : '#ACC6FF' }]} onPress={ExistingSubjectSaveButton}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
              color: 'black',
              fontSize: 18,
            }}>
            {IsSaved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
      <DurationBox
      showPicker={showPicker}
      setShowPicker={setShowPicker}
      durationString={durationString}
      setDurationString={setDurationString}
      />
    </View>
  );
};

export default AddingSubjects;

const styles = StyleSheet.create({
  angleInfoColor: {
    height: 16,
    width: 16,
    borderRadius: 15,
    marginLeft: 10,
    marginTop: 5,
  },

  OptionText: {
    fontSize: 18,
    color: '#9D9EA0',
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
  },

  SaveButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ACC6FF',
    borderRadius: 20,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  UpperOption: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    paddingLeft: 20,
    paddingRight: 20,
    //
  },

  MiddleOption: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },

  BottomOption: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },

  OnlyOption: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: 'blue',
    // backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // paddingLeft: 20,
    // paddingRight: 20,
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    fontSize: 16
  },
});
