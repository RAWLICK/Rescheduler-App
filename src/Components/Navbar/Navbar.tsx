import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useState } from 'react'
import DrawerImage from '../Images/Drawer.png'
import ThreeDotsImage from '../Images/ThreeDots.png'
import LinearGradient from 'react-native-linear-gradient';
import StreakFire from '../Images/StreakFire.png'
import { useNavigation, NavigationProp, DrawerActions, useNavigationState } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
import { CombinedNavigationProp } from '../../App';

// type NavbarPropsType = {
//   "Streak": number
// }

const Navbar = () => {
  // BD54EE, 6A1293
  // const navigation = useNavigation<NavigationProp<any, any>>();
  const navigation = useNavigation<CombinedNavigationProp>();
  const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
  const isDrawerAvailable = useNavigationState((state) =>
    state?.type === 'drawer' // Check if the current navigation context is a drawer
  );
  return (
    <View style={styles.mainNav}>
      <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image source={DrawerImage} style={styles.DrawerImage}/>
      </TouchableOpacity>
      <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: '#6A1293', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Heavy' : 'sf-pro-display-heavy', fontSize: 20}}>Re</Text>
        <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Heavy' : 'sf-pro-display-heavy', fontSize: 20, color: '#FFFFFF'}}>scheduler</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10}}>
        <Image source={StreakFire} style={styles.ThreeDotsImage}/>
        <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Heavy' : 'sf-pro-display-heavy', fontSize: 20, color: '#6A1293'}}>{StudentInfoData["Streak"]}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainNav: {
    flexDirection: 'row',
    // backgroundColor: '#BD54EE',
    height: 55
  },

  DrawerImage: {
    height: 30,
    width: 30
  }, 

  ThreeDotsImage: {
    height: 40,
    width: 40
  }
})
export default Navbar