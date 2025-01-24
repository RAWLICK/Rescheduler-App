import { StyleSheet, Text, View, Dimensions, TextInput, Image, SafeAreaView, StatusBar, ListRenderItem, FlatList, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
const { width, height } = Dimensions.get('window');

const AdminPanel = () => {
    const [distributorName, setDistributorName] = useState("")
    const [distributionName, setDistributionName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const DistributionTypeData = [
        { label: 'Library', value: '1' }
    ];
    const [DistributionTypeValue, setDistributionTypeValue] = useState("");
    const [isDistributionTypeFocus, setDistributionTypeIsFocus] = useState(false);
    const CityData = [
        { label: 'Lucknow', value: '1' }
    ];
    const [CityValue, setCityValue] = useState("");
    const [isCityFocus, setIsCityFocus] = useState(false);
    return (
        <SafeAreaView style={styles.safeView}>
            <StatusBar
            animated={true}
            backgroundColor="#d6d3da"
            />
            <View style={styles.mainStyle}>
                <View style={{height: height * 0.05, backgroundColor: '#d6d3da', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 17}}>Admin Panel</Text>
                </View>
                <View 
                style={{
                    flex: 1,
                    backgroundColor: '#1b1b1d',
                    padding: 30,
                    paddingRight: 15,
                    paddingLeft: 15,
                    paddingBottom: 15,
                    rowGap: 3
                }}>
                    <View style={[styles.UpperOption, { height: 65 }]}>
                        <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}>
                        <TextInput
                            style={styles.OptionText}
                            value={distributorName}
                            onChangeText={setDistributorName}
                            placeholder="Distributor Name"
                            placeholderTextColor="#9D9EA0"></TextInput>
                        </View>
                    </View>

                    <View style={[styles.MiddleOption, { height: 65 }]}>
                        <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}>
                        <TextInput
                            style={styles.OptionText}
                            value={distributionName}
                            onChangeText={setDistributionName}
                            placeholder="Distribution Name"
                            placeholderTextColor="#9D9EA0"></TextInput>
                        </View>
                    </View>

                    <View>
                        <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={DistributionTypeData}
                        itemTextStyle={{fontFamily: 'futura-no-2-medium-dee', height: 25, color: 'black', fontSize: 18}}
                        itemContainerStyle={{backgroundColor: 'grey', borderRadius: 10, paddingHorizontal: 30, height: 50, justifyContent: 'center'}}
                        containerStyle={{borderRadius: 10}}
                        // search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isDistributionTypeFocus ? 'Select Distribution Type' : 'Select Distribution Type'}
                        searchPlaceholder="Search..."
                        value={DistributionTypeValue}
                        onFocus={() => setDistributionTypeIsFocus(true)}
                        onBlur={() => setDistributionTypeIsFocus(false)}
                        onChange={item => {
                            setDistributionTypeValue(item.value);
                            setDistributionTypeIsFocus(false);
                        }}
                        />
                    </View>

                    <View style={[styles.MiddleOption, { height: 65 }]}>
                        <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}>
                        <TextInput
                            style={styles.OptionText}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Phone Number"
                            placeholderTextColor="#9D9EA0"></TextInput>
                        </View>
                    </View>

                    <View>
                        <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={CityData}
                        itemTextStyle={{fontFamily: 'futura-no-2-medium-dee', height: 25, color: 'black', fontSize: 18}}
                        itemContainerStyle={{backgroundColor: 'grey', borderRadius: 10, paddingHorizontal: 30, height: 50, justifyContent: 'center'}}
                        containerStyle={{borderRadius: 10}}
                        // search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isCityFocus ? 'Select City' : 'Select City'}
                        searchPlaceholder="Search..."
                        value={CityValue}
                        onFocus={() => setIsCityFocus(true)}
                        onBlur={() => setIsCityFocus(false)}
                        onChange={item => {
                            setCityValue(item.value);
                            setIsCityFocus(false);
                        }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AdminPanel

const styles = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainStyle: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
    },
    OptionText: {
        fontSize: 18,
        color: '#9D9EA0',
        fontFamily: 'futura-no-2-medium-dee',
    },
    UpperOption: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: '#222328',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        // marginBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        //
      },
    
      MiddleOption: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: '#222328',
        borderRadius: 5,
        // marginBottom: 1,
        // marginTop: 1,
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
        // marginTop: 1,
        paddingLeft: 20,
        paddingRight: 20,
      },
    
      OnlyOption: {
        // flex: 1,
        // flexDirection: 'row',
        backgroundColor: 'blue',
        // backgroundColor: '#222328',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        // paddingLeft: 20,
        // paddingRight: 20,
        fontFamily: 'futura-no-2-medium-dee',
        fontSize: 16
      },

      dropdown: {
        height: 65,
        paddingHorizontal: 9,
        borderRadius: 5,
        backgroundColor: '#222328',
        paddingLeft: 20,
        paddingRight: 20,
      },
      icon: {
        marginRight: 15,
        height: 25,
        width: 25,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 30,
        top: -5,
        zIndex: 999,
        paddingHorizontal: 8,
        // fontSize: 11,
        // fontFamily: 'futura-no-2-medium-dee',
        fontSize: 18,
        color: '#9D9EA0',
      },
      placeholderStyle: {
        fontFamily: 'futura-no-2-medium-dee',
        fontSize: 18,
        color: '#9D9EA0',

      },
      selectedTextStyle: {
        fontFamily: 'futura-no-2-medium-dee',
        fontSize: 18,
        color: '#9D9EA0',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 18,
        color: '#9D9EA0',
        fontFamily: 'futura-no-2-medium-dee',
      },
})