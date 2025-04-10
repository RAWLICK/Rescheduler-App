import { StyleSheet, Text, View, Dimensions, TextInput, Image, SafeAreaView, StatusBar, ListRenderItem, FlatList, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { nanoid } from "@reduxjs/toolkit";
import Normal_Plus from '../Images/Normal_Plus.png'
import NormalMinus from '../Images/NormalMinus.png'
const { width, height } = Dimensions.get('window');

const AdminPanel = () => {
    let currentDate = new Date();
    let currentNumDate = currentDate.getDate().toString().padStart(2, '0');
    let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let currentYear = currentDate.getFullYear();
    let currentDateandMonth = `${currentNumDate}/${currentMonth}/${currentYear}`;
    const [distributorName, setDistributorName] = useState("")
    const [distributionName, setDistributionName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [numberOfBranch, setNumberOfBranch] = useState(1)
    const [AllBranchesList, setAllBranchesList] = useState([''])
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
    const [StateValue, setStateValue] = useState("");
    const [isStateFocus, setIsStateFocus] = useState(false);
    const StateData = [
        { label: 'Uttar Pradesh', value: '1' }
    ];
    const [serverResponseMessage, setServerResponseMessage] = useState('')

    function DecreasingBranch() {
        if (numberOfBranch > 1) {
            setNumberOfBranch(numberOfBranch - 1)
            if (numberOfBranch == AllBranchesList.length + 1) {
                const upDatedBranchList = [...AllBranchesList]
                upDatedBranchList.pop()
                setAllBranchesList(upDatedBranchList)
            }
        }
    }

    function handleBranchChange(text: string, index: number) {
        const upDatedBranchList = [...AllBranchesList]
        upDatedBranchList[index] = text
        setAllBranchesList(upDatedBranchList)
    }

    const SaveButton = async () => {
        let NewDistributorAdd = {
            "uniqueID": nanoid(),
            "Name": distributorName,
            "Distribution Name": distributionName,
            "Distribution Type": DistributionTypeData[Number(DistributionTypeValue) - 1].label,
            "DistributionID": nanoid(),
            "Phone Number": phoneNumber,
            "State": StateData[Number(StateValue) - 1].label,
            "Country": "India",
            "City": CityData[Number(CityValue) - 1].label,
            "Date Joined": currentDateandMonth,
            "Date Left": "",
            "Plan Status": "Active",
            "Enrolled Students": "",
            "Plan Duration": "3 Months",
            "Plan Enrollment Limit": "100",
            "Number of Branches": numberOfBranch,
            "Other Branches List": AllBranchesList
        }
        try {
          const response = await fetch('http://192.168.123.92:5000/addDistributor', {  // Replace localhost with your computer's IP address if testing on a real device
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify(NewDistributorAdd), // Convert the request payload to JSON.
          })
    
          if (!response.ok) {  // Handle HTTP errors
            throw new Error('Failed to add data to the server');
          }
    
        //   const fetched_data = await response.json(); // Parse JSON response
        //   setApiData(fetched_data)
        //   setServerResponseMessage(fetched_data.message);  // Update state with server response
          // console.log("API_DATA: ", JSON.stringify(ApiData))
        } catch (error) {
          console.error('Catch Error: ', error);
          setServerResponseMessage('Failed to connect to the backend');  // Handle network error
        }
      };

      useEffect(() => {
        console.log("Try try dont cry: ", StateData[0].label)
        console.log("Try try dont cry: ", Number(StateValue))
      }, [])
      
    
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
                <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: '#1b1b1d',
                    padding: 30,
                    paddingRight: 15,
                    paddingLeft: 15,
                    paddingBottom: 15
                }}>
                    <View style={{rowGap: 3}}>
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
                            placeholderTextColor="#6a6a6a">
                            </TextInput>
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
                            placeholderTextColor="#6a6a6a"></TextInput>
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
                            placeholderTextColor="#6a6a6a"></TextInput>
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

                    <View>
                        <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={StateData}
                        itemTextStyle={{fontFamily: 'futura-no-2-medium-dee', height: 25, color: 'black', fontSize: 18}}
                        itemContainerStyle={{backgroundColor: 'grey', borderRadius: 10, paddingHorizontal: 30, height: 50, justifyContent: 'center'}}
                        containerStyle={{borderRadius: 10}}
                        // search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isStateFocus ? 'Select State' : 'Select State'}
                        searchPlaceholder="Search..."
                        value={StateValue}
                        onFocus={() => setIsStateFocus(true)}
                        onBlur={() => setIsStateFocus(false)}
                        onChange={item => {
                            setStateValue(item.value);
                            setIsStateFocus(false);
                        }}
                        />
                    </View>

                    <View style={[styles.MiddleOption, { height: 65 }]}>
                        <View
                        style={{
                            flex: 1,
                            // justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                            <View style={{flex: 0.7}}>
                                <Text style={styles.OptionText}>Total Number of Branches</Text>
                            </View>
                            <View style={{flex: 0.3, alignItems: 'center', borderRadius: 10, margin: 10, flexDirection: 'row', columnGap: 25}}>
                                <TouchableOpacity onPress={DecreasingBranch}>
                                    <Image source={NormalMinus} style={{height: 20, width: 20}}/>
                                </TouchableOpacity>
                                <View style={{backgroundColor: '#9D9EA0', padding: 5, borderRadius: 3}}>
                                    <Text>{numberOfBranch}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setNumberOfBranch(numberOfBranch + 1)}>
                                    <Image source={Normal_Plus} style={{height: 20, width: 20}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    {new Array(numberOfBranch - 1).fill(null).map(( __, index) => {
                    return (
                        <View key={index} style={[styles.MiddleOption, { height: 65 }]}>
                            <TextInput
                            style={styles.OptionText}
                            value={AllBranchesList[index]}
                            onChangeText={(text) => handleBranchChange(text, index)}
                            placeholder="Branch Name"
                            placeholderTextColor="#6a6a6a">
                            </TextInput>
                        </View>
                    )
                    })}
                    </View>
                    <View style={{ height: 50, marginTop: 12 }}>
                    <TouchableOpacity style={styles.SaveButtonBox} onPress={SaveButton}>
                        <Text
                        style={{
                            fontFamily: 'futura-no-2-medium-dee',
                            color: 'black',
                            fontSize: 18,
                        }}>
                        Save
                        </Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
                </View>
        </SafeAreaView>
    )
}

export default AdminPanel

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
        height: 20
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 18,
        color: '#9D9EA0',
        fontFamily: 'futura-no-2-medium-dee',
      },
})