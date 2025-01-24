import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import { useState } from 'react';
import ChevronLeft from '../Images/ChevronLeft.png';
import { useDispatch, useSelector } from 'react-redux' 
import { addExistingSubjectsObject, removeExistingSubjectsObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
import LinearGradient from 'react-native-linear-gradient';
import { TimerPickerModal } from "react-native-timer-picker";
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type DurationBoxPropsType = {
  showPicker: boolean,
  setShowPicker: SetState<boolean>,
  durationString: string | null
  setDurationString: SetState<string | null>
}

const DurationBox = (props: DurationBoxPropsType) => {
  const formatTime = (pickedDuration: { hours: number, minutes: number, seconds: number}) => {
    return `${pickedDuration.hours}hr ${pickedDuration.minutes}min`
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

const EditingSubjects = () => {
    const dispatch = useDispatch();
    const [SubjectName, setSubjectName] = useState('');
    const color = 'blue';
    const [showPicker, setShowPicker] = useState(false);
    const [durationString, setDurationString] = useState<string | null>(null);

    const ExistingSubjectSaveButton = () => {
    const newExistingSubject = {
        "Work": SubjectName,
        "Duration": durationString
    }
    dispatch(addExistingSubjectsObject(newExistingSubject));
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
                fontFamily: 'sf-pro-display-bold',
                fontSize: 25,
                color: 'white',
                paddingLeft: 10,
              }}>
              Editing Subject
            </Text>
          </View>
          <View style={{ height: 195, rowGap: 1 }}>
            <View style={[styles.UpperOption, { flex: 2 }]}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <TextInput
                  style={styles.OptionText}
                  value={SubjectName}
                  onChangeText={setSubjectName}
                  placeholder="Work"
                  placeholderTextColor="#9D9EA0"></TextInput>
              </View>
            </View>
    
            <TouchableOpacity style={[styles.MiddleOption, { flex: 2 }]}>
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
                  <Text style={{fontFamily: 'sf-pro-display-bold', color: '#d8d0d0'}}>10 hr 30 min</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
    
    
            <TouchableOpacity style={[styles.BottomOption, { flex: 2 }]}>
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
            </TouchableOpacity>
          </View>

          <View style={{ height: 50, padding: 5 }}>
            <TouchableOpacity style={styles.SaveButtonBox} onPress={ExistingSubjectSaveButton}>
              <Text
                style={{
                  fontFamily: 'futura-no-2-medium-dee',
                  color: 'black',
                  fontSize: 18,
                }}>
                Save the Edited
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
  )
}

export default EditingSubjects

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
        fontFamily: 'futura-no-2-medium-dee',
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
        fontFamily: 'futura-no-2-medium-dee',
        fontSize: 16
      },
})