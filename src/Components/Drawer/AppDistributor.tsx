import { StyleSheet, Text, View, Dimensions, TextInput, Image, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { useState } from 'react';
import SearchIcon from '../Images/SearchIcon.png'
const { width, height } = Dimensions.get('window');

const AppDistributor = () => {
  const [studentSearch, setStudentSearch] = useState("")
  return (
    <SafeAreaView style={styles.safeView}>
    <StatusBar
     animated={true}
     backgroundColor="#d6d3da"
    />
    <View style={styles.mainStyle}>
        <View style={{height: height * 0.05, backgroundColor: '#d6d3da', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 17}}>App Distributor</Text>
        </View>
        <View style={{padding: 10, paddingRight: width * 0.04, paddingLeft: width * 0.04}}>
            <View>
                <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 30, color: 'black'}}>Students Enrolled</Text>
            </View>
            <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Image source={SearchIcon} style={{height: 25, width: 25, position: 'absolute', marginLeft: 10}} />
                <TextInput
                style={styles.input}
                onChangeText={setStudentSearch}
                value={studentSearch}
                placeholder='Search "Kartavya Singh Chauhan" '
                placeholderTextColor='#9b999c'
                keyboardType="default"
                />
            </View>
        </View>
    </View>
    </SafeAreaView>
  )
}

export default AppDistributor

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainStyle: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#d6d3da',
        padding: 10,
        borderRadius: 10,
        fontFamily: 'sf-pro-display-bold',
        fontSize: 18,
        paddingLeft: width * 0.12
    },
})