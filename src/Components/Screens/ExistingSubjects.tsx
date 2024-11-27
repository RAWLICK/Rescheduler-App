import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('window');

const ExistingSubjects = () => {
    const subjects = ['Physics', 'Chemistry', 'Maths']
  return (
    <View style={{backgroundColor: '#1b1b1d', padding: 30, paddingTop: 40}}>
        <View style={{height: 50}}>
            <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 20}}>Existing Subjects</Text>
        </View>
        <View style={{rowGap: 1}}>
            <TouchableOpacity style={[styles.UpperOption, {backgroundColor: '#c454fc', height: height * 0.06, alignItems: 'center'}]}>
                <Text style={{fontFamily: 'sf-pro-display-bold', color: '#e9d3f5', fontSize: 15}}>Add New Subject</Text>
            </TouchableOpacity>
            {subjects.map((subject, index) => (
                <TouchableOpacity style={[styles.UpperOption, {backgroundColor: '#222328', height: height * 0.06, alignItems: 'center'}]}>
                    <Text style={{fontFamily: 'sf-pro-display-bold', color: 'white', fontSize: 15}}>{subject}</Text>
                </TouchableOpacity>
            ))
            }
        </View>
    </View>
  )
}

export default ExistingSubjects

const styles = StyleSheet.create({
    UpperOption: {
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
})