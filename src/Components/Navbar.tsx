import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import DrawerImage from '../Images/Drawer.png'
import ThreeDotsImage from '../Images/ThreeDots.png'
import LinearGradient from 'react-native-linear-gradient';

const Navbar = () => {
  // BD54EE
  return (
    <LinearGradient colors={['#BD54EE', '#FFFFFF']} style={styles.mainNav}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={DrawerImage} style={styles.DrawerImage}/>
      </View>
      <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: '#6A1293', fontFamily: 'sf-pro-display-heavy', fontSize: 20}}>Re</Text>
        <Text style={{fontFamily: 'sf-pro-display-heavy', fontSize: 20, color: '#FFFFFF'}}>scheduler</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={ThreeDotsImage} style={styles.ThreeDotsImage}/>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  mainNav: {
    flexDirection: 'row',
    backgroundColor: '#BD54EE',
    height: 55
  },

  DrawerImage: {
    height: 30,
    width: 30
  }, 

  ThreeDotsImage: {
    height: 30,
    width: 30
  }
})
export default Navbar