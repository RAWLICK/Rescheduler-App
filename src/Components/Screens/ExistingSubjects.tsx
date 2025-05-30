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
import EditingSubjects from './EditingSubjects'
const { width, height } = Dimensions.get('window');
import { useDispatch, useSelector } from 'react-redux';
import { addExistingSubjectsObject, removeExistingSubjectsObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
import { ExistingSubjectsArrayItem } from '../../app/Slice'
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type EditDialogBoxPropsTypes = {
  uniqueID: string
  SubjectSettingDialogBoxStatus: boolean,
  setSubjectSettingDialogBoxStatus: (value: React.SetStateAction<boolean>) => void
  EditingSubjectsButton: () => void,
  handleOutsidePress: () => void,
}

type ExistingSubjectsPropsType = {
  WorkToDo: string
  setWorkToDo: SetState<string>
  ExistingSubjectSheet: React.RefObject<TrueSheet>
}

const EditDialogBox = (props: EditDialogBoxPropsTypes) => {
  const dispatch = useDispatch();
  const RemovingWork = (uniqueID: string) => {
    dispatch(removeExistingSubjectsObject(uniqueID))
    props.setSubjectSettingDialogBoxStatus(false);
  }
  return (
    <Modal visible={props.SubjectSettingDialogBoxStatus} animationType='fade'>
    <TouchableWithoutFeedback onPress={props.handleOutsidePress}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BlurView
          style={styles.blurStyle}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="black"
        />
        <View style={[styles.subjectEditDialogBox, {backgroundColor: '#3F3F41'}]}>
          <TouchableOpacity style={{flex: 0.5, flexDirection: 'row', columnGap: 20, borderBottomWidth: 0.5, borderColor: 'grey'}} onPress={props.EditingSubjectsButton}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={EditIcon} style={{ height: 20, width: 20}} />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 15}}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 0.5, flexDirection: 'row', columnGap: 20}} onPress={() => RemovingWork(props.uniqueID)}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={DeleteIcon} style={{ height: 20, width: 20}} />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 15}}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const ExistingSubjects = (props: ExistingSubjectsPropsType) => {
  const ExistingSubjectsArray = useSelector((state: RootState) => state.ExistingSubjectsArraySliceReducer.ExistingSubjectsArrayInitialState);
  const AddingSubjectsSheet = useRef<TrueSheet>(null);
  const EditingSubjectsSheet = useRef<TrueSheet>(null);
  const [SubjectSettingDialogBoxStatus, setSubjectSettingDialogBoxStatus] = useState(false)
  const [EditTrueSheetStatus, setEditTrueSheetStatus] = useState(false)
  const [uniqueIDToBeEdited, setuniqueIDToBeEdited] = useState('')
  
  async function AddingSubjectsButton () {
    setSubjectSettingDialogBoxStatus(false);
    await AddingSubjectsSheet.current?.present();
  }

  async function EditingSubjectsButton () {
    setEditTrueSheetStatus(false);
    await EditingSubjectsSheet.current?.present();
  }

  async function SubjectApplyingButton (work: string) {
    props.setWorkToDo(work)
    await props.ExistingSubjectSheet.current?.dismiss();
  }

  const SubjectSettingButton = (uniqueID: string) => {
    setuniqueIDToBeEdited(uniqueID);
    setSubjectSettingDialogBoxStatus(true);
  }

  const handleOutsidePress = () => {
    Keyboard.dismiss();                   // Close keyboard if open
    setSubjectSettingDialogBoxStatus(false)         // Close modal
  };

  return (
    <View style={{ backgroundColor: '#1b1b1d', padding: 30, paddingTop: 40}}>
      <View style={{ height: 50 }}>
        <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 20 }}>Subjects in Stats</Text>
      </View>
      <View style={{ rowGap: 1 }}>
        <TouchableOpacity style={[
          ExistingSubjectsArray.length != 0 && styles.UpperOption,
          ExistingSubjectsArray.length == 0 && styles.OnlyOption,
          { backgroundColor: '#c454fc', height: height * 0.06, alignItems: 'center', columnGap: 5 }]} onPress={AddingSubjectsButton}>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={AddTwo} style={{ height: 25, width: 25}} />
          </View>
          <View style={{ flex: 0.9}}>
            <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#e9d3f5', fontSize: 15 }}>Add New Subject</Text>
          </View>
        </TouchableOpacity>
        {ExistingSubjectsArray.map((eachSubject, index) => {
          const work = eachSubject.Subject;
          const uniqueID = eachSubject.uniqueID;
          return (
          <View key={index} style={[
            index == (ExistingSubjectsArray.length-1) && styles.BottomOption,
            index >= 0 && index < (ExistingSubjectsArray.length-1) && styles.MiddleOption,
            { backgroundColor: '#222328', height: height * 0.06, alignItems: 'center', columnGap: 5, paddingLeft: 20,
              paddingRight: 10 }
          ]}>
            <TouchableOpacity style={{flex: 0.9}} onPress={() => SubjectApplyingButton(work)}>
              <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'white', fontSize: 15}}>{work}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}} onPress={() => SubjectSettingButton(uniqueID)}>
              <Image source={ThreeDotsTwo} style={{ height: 20, width: 20}} />
            </TouchableOpacity>
          </View>
        )})
        }
        <EditDialogBox
          SubjectSettingDialogBoxStatus={SubjectSettingDialogBoxStatus}
          setSubjectSettingDialogBoxStatus={setSubjectSettingDialogBoxStatus}
          EditingSubjectsButton={EditingSubjectsButton}
          handleOutsidePress={handleOutsidePress}
          uniqueID={uniqueIDToBeEdited}
        />
        
        <TrueSheet
          ref={AddingSubjectsSheet}
          sizes={['auto', 'large']}
          cornerRadius={24}
        >
          <AddingSubjects/>
        </TrueSheet>

        <TrueSheet
          ref={EditingSubjectsSheet}
          sizes={['auto', 'large']}
          cornerRadius={24}
        >
          <EditingSubjects
            uniqueID={uniqueIDToBeEdited}
          />
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