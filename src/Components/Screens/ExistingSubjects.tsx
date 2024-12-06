import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, Image, Modal } from 'react-native'
import React from 'react'
import { useRef } from 'react'
import AddTwo from '../Images/AddTwo.png'
import ThreeDotsTwo from '../Images/ThreeDotsTwo.png'
import EditIcon from '../Images/EditIcon.png'
import DeleteIcon from '../Images/DeleteIcon.png'
import { BlurView } from "@react-native-community/blur";
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import AddingSubjects from './AddingSubjects'
const { width, height } = Dimensions.get('window');

const ExistingSubjects = () => {
  const subjects = ['Physics', 'Chemistry', 'Maths']
  const AddingSubjectsSheet = useRef<TrueSheet>(null);
  async function AddingSubjectsButton () {
    await AddingSubjectsSheet.current?.present();
  }
  return (
    <View style={{ backgroundColor: '#1b1b1d', padding: 30, paddingTop: 40}}>
      <View style={{ height: 50 }}>
        <Text style={{ fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 20 }}>Existing Subjects</Text>
      </View>
      <View style={{ rowGap: 1 }}>
        <TouchableOpacity style={[styles.UpperOption, { backgroundColor: '#c454fc', height: height * 0.06, alignItems: 'center', columnGap: 5 }]}>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={AddTwo} style={{ height: 25, width: 25}} />
          </View>
          <View style={{ flex: 0.9}}>
            <Text style={{ fontFamily: 'sf-pro-display-bold', color: '#e9d3f5', fontSize: 15 }}>Add New Subject</Text>
          </View>
        </TouchableOpacity>
        {subjects.map((subject, index) => (
          <View key={index} style={[
            index == 2 && styles.BottomOption,
            index >= 0 && index < 2 && styles.MiddleOption,
            // styles.UpperOption, 
            { backgroundColor: '#222328', height: height * 0.06, alignItems: 'center', columnGap: 5 }
          ]}>
            <View
              style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={[
                  styles.angleInfoColor,
                  { backgroundColor: `blue` },
                ]}></View>
            </View>
            <TouchableOpacity style={{flex: 0.8}}>
              <Text style={{ fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15 }}>{subject}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={ThreeDotsTwo} style={{ height: 20, width: 20}} />
            </TouchableOpacity>
          </View>
        ))
        }
        <Modal visible={true}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <BlurView
              style={styles.blurStyle}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="black"
            />
            <View style={[styles.subjectEditDialogBox, {backgroundColor: '#3F3F41'}]}>
              <TouchableOpacity style={{flex: 0.5, flexDirection: 'row', columnGap: 20, borderBottomWidth: 0.5, borderColor: 'grey'}} onPress={AddingSubjectsButton}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={EditIcon} style={{ height: 20, width: 20}} />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                  <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15}}>Edit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 0.5, flexDirection: 'row', columnGap: 20}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={DeleteIcon} style={{ height: 20, width: 20}} />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                  <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15}}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
})