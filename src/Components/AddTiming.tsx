import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Switch } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ChevronRight from '../Images/ChevronRight.png'
import RightArrow from '../Images/RightArrow.png'
const color = 'blue'

const AddTiming = () => {
  const [NoteText, setNoteText] = useState('')
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainStyle}>
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

          <TouchableOpacity style={styles.MiddleOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>Duration</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRight} style={{height: 17, width: 17}}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.BottomOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={styles.OptionText}>Reminder</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <View style={[styles.angleInfoColor, {backgroundColor: `${color}`}]}></View>
            </View>
          </TouchableOpacity>
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
    paddingRight: 20
  },

  areaOne: {
    height: 150,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15
  },

  areaTwo: {
    height: 300,
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