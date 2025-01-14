import { StyleSheet, Text, View, Dimensions, TextInput, Image } from 'react-native'
import React from 'react'
import { useState } from 'react';
import SearchIcon from '../Images/SearchIcon.png'
const { width, height } = Dimensions.get('window');

const PartneredLibraries = () => {
    const [Search, setSearch] = useState("")
  return (
    <View>
      <View style={{height: height * 0.05, backgroundColor: '#d6d3da', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 17}}>Our Partnered Libraries</Text>
      </View>
      <View style={{padding: 10, paddingRight: width * 0.04, paddingLeft: width * 0.04}}>
        <View style={{rowGap: 10}}>
            <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 23, color: 'black'}}>Get a premium subscription for free</Text>
            <Text style={{fontFamily: 'sf-pro-display-medium', fontSize: 17}}>Get a premium subscription of Rescheduler absolutely for free by joining our partnered libraries in your area</Text>
        </View>
        <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
            <Image source={SearchIcon} style={{height: 25, width: 25, position: 'absolute', marginLeft: 10}} />
            <TextInput
            style={styles.input}
            onChangeText={setSearch}
            value={Search}
            placeholder='Search "Indra Nagar" '
            placeholderTextColor='#9b999c'
            keyboardType="default"/>
        </View>
      </View>
    </View>
  )
}

export default PartneredLibraries

const styles = StyleSheet.create({
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
    }
})