import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Switch, StatusBar } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ChevronRight from '../Images/ChevronRight.png'
import ChevronLeft from '../Images/ChevronLeft.png'
import RightArrow from '../Images/RightArrow.png'
const color = 'blue'
const DurationBoxes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
const DurationTag = ['0h', '1h', '2h', '3h', '4h']


const AddTiming = () => {
  const [NoteText, setNoteText] = useState('')
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar
        animated={true}
        backgroundColor="#1B1B1D"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />
      <View style={styles.mainStyle}>
      <View style={{height: 60, justifyContent: 'center', flexDirection: 'row', padding: 10, paddingLeft: 20, paddingRight: 20}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Image source={ChevronLeft} style={{height: 20, width: 20}}/>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <View style={{backgroundColor: '#ACC6FF', borderRadius: 20, padding: 8, paddingLeft: 20, paddingRight: 20}}>
            <Text style={[styles.OptionText, {color: '#093471'}]}>Save</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.areaOne}>
          <TouchableOpacity style={styles.UpperOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>Work</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRight} style={{height: 17, width: 17}}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.BottomOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>Color</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <View style={[styles.angleInfoColor, {backgroundColor: `${color}`}]}></View>
            </View>
          </TouchableOpacity>
        </View>


        <View style={styles.areaTwo}>
          <View style={styles.UpperOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>Date</Text>
            </View>
            <View style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <TouchableOpacity style={{height: 40, width: 50, backgroundColor: '#43464D', alignItems: 'center', marginRight: 5, borderRadius: 10, justifyContent: 'center'}}>
                <Text style={{fontFamily: 'futura-no-2-medium-dee', fontSize: 17}}>09</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{height: 40, width: 100, backgroundColor: '#43464D', alignItems: 'center', marginLeft: 5, borderRadius: 10, justifyContent: 'center'}}>
                <Text style={{fontFamily: 'futura-no-2-medium-dee', fontSize: 17}}>September</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.MiddleOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>Timing</Text>
            </View>
            <View style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <TouchableOpacity style={{height: 40, width: 85, backgroundColor: '#43464D', alignItems: 'center', marginRight: 5, borderRadius: 10, justifyContent: 'center'}}>
                <Text style={{fontFamily: 'futura-no-2-medium-dee', fontSize: 16}}>09:00 AM</Text>
              </TouchableOpacity>
              <View>
                <Image source={RightArrow} style={{height: 17, width: 17}}/>
              </View>
              <TouchableOpacity style={{height: 40, width: 85, backgroundColor: '#43464D', alignItems: 'center', marginLeft: 5, borderRadius: 10, justifyContent: 'center'}}>
                <Text style={{fontFamily: 'futura-no-2-medium-dee', fontSize: 16}}>10:00 AM</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.MiddleOption, {flex:2, flexDirection: 'column', justifyContent: 'center'}]}>
            <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#9D9EA0',marginBottom: 20, borderRadius: 10}}>
              <Text style={[styles.OptionText, {fontFamily: 'futura-no2-d-demibold', color: '#000000'}]}>Duration</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
            {DurationBoxes.map((index, i) => {
              return(
                <View key={i} style={[{backgroundColor: '#9D9EA0', height: 10, width: 17, marginRight: 2}, i == 0? {borderTopLeftRadius: 4, borderBottomLeftRadius: 4} : {}, i == 15? {borderTopRightRadius: 4, borderBottomRightRadius: 4} : {}]}>
                </View>
            )})}
            </View>
            <View style={{flexDirection: 'row', marginTop: 7}}>
            {DurationTag.map((tag, i) => {
              return(
                <Text style={[{marginRight: 44, fontFamily: 'futura-no-2-medium-dee', color: '#9D9EA0'}, tag != '0h'? {marginRight: 62} : {}]}>{tag}</Text>
              )
            })}
            </View>
          </View>

          <View style={styles.BottomOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>All Day</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              // ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            </View>
          </View>

        </View>


        <View style={styles.areaThree}>
          <TextInput
            multiline
            numberOfLines={6}
            style={styles.OnlyOption}
            value={NoteText}
            onChangeText={setNoteText}
            placeholder='Add a Note'
            >
          </TextInput>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: 'white'
  },

  mainStyle: {
    flex: 1,
    backgroundColor: '#1B1B1D'
  },

  UpperOption: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    paddingLeft: 20,
    paddingRight: 20
  },

  MiddleOption: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 1,
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20
  },

  BottomOption: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 1,
    paddingLeft: 20,
    paddingRight: 20
  },

  OnlyOption: {
    // flex: 1,
    // flexDirection: 'row',
    backgroundColor: '#222328',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'futura-no-2-medium-dee',
    fontSize: 16
  },

  areaOne: {
    height: 150,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15
  },

  areaTwo: {
    height: 370,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15
  },

  areaThree: {
    height: 150,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15
  },

  angleInfoColor: {
    height: 16, 
    width: 16, 
    borderRadius: 15, 
    marginLeft: 10, 
    marginTop: 5,
  }, 

  OptionText: {
    fontSize: 18, 
    // fontWeight: 'bold', 
    // fontWeight: '', 
    color: '#9D9EA0',
    fontFamily: 'futura-no-2-medium-dee'
    // fontFamily: 'sf-pro-display-medium'
  }
})

export default AddTiming