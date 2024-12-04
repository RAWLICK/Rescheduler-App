import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import ChevronLeft from '../Images/ChevronLeft.png';

const AddingSubjects = () => {
  return (
    <View style={{backgroundColor: '#1b1b1d', padding: 30, paddingRight: 15, paddingLeft: 15, paddingBottom: 15, rowGap: 15}}>
        <View>
            <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 25, color: 'white', paddingLeft: 10}}>Adding Subject</Text>
        </View>
        <View style={{height: 200, rowGap: 1}}>
            <View style={[styles.UpperOption, {flex: 2}]}>
            {/* <Text>Add a name</Text> */}
            </View>
            <View style={[styles.MiddleOption, {flex: 2}]}></View>
            <View style={[styles.BottomOption, {flex: 3}]}></View>
        </View>
        <View style={{height: 50, padding: 5}}>
            <View style={styles.SaveButtonBox}>
            <Text
                style={{
                fontFamily: 'futura-no-2-medium-dee',
                color: 'black',
                fontSize: 18,
                }}>
                Save
            </Text>
            </View>
        </View>
    </View>
  );
};

export default AddingSubjects;

const styles = StyleSheet.create({
  SaveButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ACC6FF',
    borderRadius: 20,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  UpperOption: {
    // flex: 1,
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
    // flex: 1,
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
    // flex: 1,
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
    fontSize: 16,
  },
});
