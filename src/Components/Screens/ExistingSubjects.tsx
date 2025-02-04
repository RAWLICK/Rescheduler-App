import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import AddTwo from '../Images/AddTwo.png'
import ThreeDotsTwo from '../Images/ThreeDotsTwo.png'
import EditIcon from '../Images/EditIcon.png'
import DeleteIcon from '../Images/DeleteIcon.png'
import { BlurView } from "@react-native-community/blur";
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import AddingSubjects from './AddingSubjects'
const { width, height } = Dimensions.get('window');
import { useDispatch, useSelector } from 'react-redux';
import { addExistingSubjectsObject, removeExistingSubjectsObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
import { ExistingSubjectsArrayItem } from '../../app/Slice'
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type EditDialogBoxPropsTypes = {
  EditDialogBoxStatus: boolean,
  setEditDialogBoxStatus: (value: React.SetStateAction<boolean>) => void
  AddingSubjectsButton: () => void,
  handleOutsidePress: () => void,
  Work: string
}
const EditDialogBox = (props: EditDialogBoxPropsTypes) => {
  const dispatch = useDispatch();
  const RemovingWork = (work: string) => {
    dispatch(removeExistingSubjectsObject(work))
    props.setEditDialogBoxStatus(false);
  }
  return (
    <Modal visible={props.EditDialogBoxStatus} animationType='fade'>
    <TouchableWithoutFeedback onPress={props.handleOutsidePress}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BlurView
          style={styles.blurStyle}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        />
        <View style={[styles.subjectEditDialogBox, {backgroundColor: '#3F3F41'}]}>
          <TouchableOpacity style={{flex: 0.5, flexDirection: 'row', columnGap: 20, borderBottomWidth: 0.5, borderColor: 'grey'}} onPress={props.AddingSubjectsButton}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={EditIcon} style={{ height: 20, width: 20}} />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15}}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 0.5, flexDirection: 'row', columnGap: 20}} onPress={() => RemovingWork(props.Work)}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={DeleteIcon} style={{ height: 20, width: 20}} />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15}}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

type ExistingSubjectsPropsType = {
  WorkToDo: string
  setWorkToDo: SetState<string>
  ExistingSubjectSheet: React.RefObject<TrueSheet>
}

const ExistingSubjects = (props: ExistingSubjectsPropsType) => {
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState);
  const data = {
    "Work": ExistingSubjectsArray.map((item: ExistingSubjectsArrayItem) => item.Work),
    "Duration": ExistingSubjectsArray.map((item: ExistingSubjectsArrayItem) => item.Duration)
  }
  const AddingSubjectsSheet = useRef<TrueSheet>(null);
  const [EditDialogBoxStatus, setEditDialogBoxStatus] = useState(false)
  const [workToBeEdited, setWorkToBeEdited] = useState('')

  const WorkLength = data["Work"].length
  
  async function AddingSubjectsButton () {
    setEditDialogBoxStatus(false);
    await AddingSubjectsSheet.current?.present();
  }
  async function SubjectApplyingButton (work: string) {
    props.setWorkToDo(work)
    await props.ExistingSubjectSheet.current?.dismiss();
  }

  const SubjectSettingButton = (work: string) => {
    setWorkToBeEdited(work)
    setEditDialogBoxStatus(true);
  }

  const handleOutsidePress = () => {
    Keyboard.dismiss();                   // Close keyboard if open
    setEditDialogBoxStatus(false)         // Close modal
  };

  return (
    <View style={{ backgroundColor: '#1b1b1d', padding: 30, paddingTop: 40}}>
      <View style={{ height: 50 }}>
        <Text style={{ fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 20 }}>Subjects in Stats</Text>
      </View>
      <View style={{ rowGap: 1 }}>
        <TouchableOpacity style={[
          WorkLength != 0 && styles.UpperOption,
          WorkLength == 0 && styles.OnlyOption,
          { backgroundColor: '#c454fc', height: height * 0.06, alignItems: 'center', columnGap: 5 }]} onPress={AddingSubjectsButton}>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={AddTwo} style={{ height: 25, width: 25}} />
          </View>
          <View style={{ flex: 0.9}}>
            <Text style={{ fontFamily: 'sf-pro-display-bold', color: '#e9d3f5', fontSize: 15 }}>Add New Subject</Text>
          </View>
        </TouchableOpacity>
        {data["Work"].map((work, index) => (
          <View key={index} style={[
            index == (WorkLength-1) && styles.BottomOption,
            index >= 0 && index < (WorkLength-1) && styles.MiddleOption,
            { backgroundColor: '#222328', height: height * 0.06, alignItems: 'center', columnGap: 5, paddingLeft: 20,
              paddingRight: 10 }
          ]}>
            <TouchableOpacity style={{flex: 0.9}} onPress={() => SubjectApplyingButton(work)}>
              <Text style={{ fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15}}>{work}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}} onPress={() => SubjectSettingButton(work)}>
              <Image source={ThreeDotsTwo} style={{ height: 20, width: 20}} />
            </TouchableOpacity>
          </View>
        ))
        }
        <EditDialogBox
          EditDialogBoxStatus={EditDialogBoxStatus}
          setEditDialogBoxStatus={setEditDialogBoxStatus}
          AddingSubjectsButton={AddingSubjectsButton}
          handleOutsidePress={handleOutsidePress}
          Work={workToBeEdited}
        />
        
        <TrueSheet
          ref={AddingSubjectsSheet}
          sizes={['auto', 'large']}
          cornerRadius={24}
        >
          <AddingSubjects/>
        </TrueSheet>
      </View>
    </View>
  )
}

export default ExistingSubjects

const styles = StyleSheet.create({
  subjectEditDialogBox: {
    flexDirection: 'column',
    backgroundColor: 'black',
    height: 100,
    width: 320,
    borderRadius: 20,
    opacity: 0.85,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingRight: 20
  },

  blurStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },

  angleInfoColor: {
    height: 16,
    width: 16,
    borderRadius: 15,
    // marginLeft: 10,
    // marginTop: 5,
  },

  UpperOption: {
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    paddingLeft: 10,
    paddingRight: 10
    //
  },

  MiddleOption: {
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    marginTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },

  BottomOption: {
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  OnlyOption: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
    fontSize: 16,
  }
})