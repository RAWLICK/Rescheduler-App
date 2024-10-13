import React from 'react'
import { useState, useEffect, memo, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions
} from 'react-native';

const RoughComponent = () => {
  console.log("Rough Component is re-rendering")
  return (
    <View>
      <Text style={{color: 'black'}}>RoughComponent</Text>
    </View>
  )
}

export default RoughComponent

const styles = StyleSheet.create({})