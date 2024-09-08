import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import React from 'react'
import ChevronRight from '../Images/ChevronRight.png'
const color = 'blue'

const AddTiming = () => {
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.mainStyle}>
      <ScrollView>
        <View style={styles.areaOne}>
          <TouchableOpacity style={styles.UpperOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Work</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRight} style={{height: 17, width: 17}}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BottomOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Color</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <View style={[styles.angleInfoColor, {backgroundColor: `${color}`}]}></View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.areaTwo}>
          <TouchableOpacity style={styles.UpperOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Date</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRight} style={{height: 17, width: 17}}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MiddleOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Timing</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <View style={[styles.angleInfoColor, {backgroundColor: `${color}`}]}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MiddleOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Duration</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <Image source={ChevronRight} style={{height: 17, width: 17}}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BottomOption}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Reminder</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
              <View style={[styles.angleInfoColor, {backgroundColor: `${color}`}]}></View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.areaThree}>
          <Text>Fuck</Text>
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

  areaOne: {
    // flex: 2,
    height: 150,
    // backgroundColor: 'red',
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15
  },

  areaTwo: {
    // flex: 4,
    height: 300,
    // backgroundColor: 'blue',
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15
  },

  areaThree: {
    // flex: 2,
    height: 150,
    padding: 10,
    backgroundColor: 'red',
    paddingBottom: 15,
    paddingTop: 15
  },

  angleInfoColor: {
    height: 16, 
    width: 16, 
    borderRadius: 15, 
    marginLeft: 10, 
    marginTop: 5,
  }
})

export default AddTiming