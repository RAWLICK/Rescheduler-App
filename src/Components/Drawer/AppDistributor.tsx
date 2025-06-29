import { StyleSheet, Text, View, Dimensions, TextInput, Image, SafeAreaView, StatusBar, ListRenderItem, FlatList, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native'
import React, { useMemo } from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';
import SearchIcon from '../Images/SearchIcon.png'
import { Dropdown } from 'react-native-element-dropdown';
import LibraryIcon from '../Images/LibraryIcon.png'
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';
import RemoveIcon from '../Images/Remove.png'
import { set } from 'date-fns';
import { Filter } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import AddIcon from '../Images/Add.png'
import { nanoid} from "@reduxjs/toolkit";
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useDispatch, useSelector } from 'react-redux' 
import { addStudentObject, removeStudentObject } from '../../app/Slice';
import { RootState } from '../../app/Store';
import { StudentInfoDataType } from '../../app/Slice';
const { width, height } = Dimensions.get('window');
import LeftArrow from '../Images/LeftArrow.png';
import {useNavigation} from '@react-navigation/native';
import {CombinedNavigationProp} from '../../App';
import { useFocusEffect } from '@react-navigation/native';
import useInternetCheck from '../Authentication/InternetCheck';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

interface Item {
    id: number;
    name: string;
}

type StudentDataTableType = {
    tableHead: string[];
    tableData: string[][];
}

type AddingStudentType = {
  ActiveBranch: string
  StudentInfoData: StudentInfoDataType
}

const AddingStudent = (props: AddingStudentType) => {
  const dispatch = useDispatch();
  const [StudentName, setStudentName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState("");
  let currentDate = new Date();
  let currentNumDate = currentDate.getDate().toString().padStart(2, '0');
  let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let currentYear = currentDate.getFullYear();
  let currentDateandMonth = `${currentNumDate}/${currentMonth}/${currentYear}`;
  const StudentsData = useSelector((state: RootState) => state.StudentsDataArraySliceReducer.StudentsDataArrayInitialState);

  const SaveButton = async() => {
    const newStudentTable = {
      "uniqueID": nanoid(),
      "Student_Name": StudentName,
      "Phone_Number": PhoneNumber,
      "Branch": props.ActiveBranch
    }

    function MatchingPhoneNumber() {
      for (let index = 0; index < StudentsData.length; index++) {
        const eachData = StudentsData[index];
        if (eachData['Phone_Number'] === PhoneNumber) {
          return true;
        }
      }
      return false;
    }

    async function IsFunctionRegistered() {
      try {
          const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/MatchNumber':'http://192.168.31.141:5000/MatchNumber',
          'https://rescheduler-server.onrender.com/MatchNumber',
          {
          method: 'POST', // Specify the request method
          headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
          },
          body: JSON.stringify(PhoneNumber), // Convert the request payload to JSON.
          })
  
          if (!response.ok) {  // Handle HTTP errors
            throw new Error('Failed to fetch data from the server');
          }
  
          const fetched_data = await response.json(); // Parse JSON response
          console.log("Is Number Registred? : ", fetched_data)
          if (fetched_data === "true") {
            return true;
          } else if (fetched_data === "false") {
            return false;
          } else {
            console.log("Invalid Response from Server");
          }
      } catch (error) {
        console.error('Catch Error: ', error);
        console.log("Failed to connect to the backend");
      }
    };

    if (MatchingPhoneNumber() == true) {
      Alert.alert("Phone Number Already Exists", "This Phone Number is already present in one of you Library Branches")
    }
    else if (StudentName == "" || PhoneNumber == "") {
      Alert.alert("Empty Fields", "Please fill all the fields before saving the student")
    }
    else if (PhoneNumber.length < 10 || PhoneNumber.length > 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10 digit phone number")
    }
    else if (await IsFunctionRegistered()) {
      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/UpdateStudent':'http://10.0.2.2:5000/UpdateStudent',
        'https://rescheduler-server.onrender.com/UpdateStudent',
        {
          method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
          },
          body: JSON.stringify({
            "Type": "Phone Number",
            "Value": PhoneNumber,
            "Updates": {
              "Name": StudentName,
              "Distribution Name": props.StudentInfoData["Distribution Name"],
              "Distribution ID": props.StudentInfoData["Distribution ID"],
              "Distribution Branch": props.ActiveBranch,
              "Subscription Type": "Library",
            }
          }), // Convert the request payload to JSON.
        })
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data to the server');
        }
        const fetched_data = await response.json();
        console.log("Fetched Message: ", fetched_data)
        dispatch(addStudentObject(newStudentTable));
      } catch (error) {
        console.error('Catch Error: ', error);
      }
    }
    else {
      let NewStudent = {
          "uniqueID": newStudentTable.uniqueID,
          "Name": newStudentTable.Student_Name,
          "Phone Number": newStudentTable.Phone_Number,
          "Date Joined": currentDateandMonth,
          "Email ID": "",
          "Gender": "",
          "Streak": 1,
          "Subscription Type": "Library",
          "Distribution Name": props.StudentInfoData["Distribution Name"],
          "Distribution Branch": props.ActiveBranch,
          "Distribution ID": props.StudentInfoData["Distribution ID"],
          "City": props.StudentInfoData["City"],
          "State": props.StudentInfoData["State"],
          "Country": props.StudentInfoData["Country"],
          "Type of Account": "User",
          "RescheduledTimes": 0
      }
      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/AddStudent':'http://10.0.2.2:5000/AddStudent',
          'https://rescheduler-server.onrender.com/AddStudent',
          {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(NewStudent),
        })

        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to add data to the server');
        }
        else if (response.ok) {
          const fetched_data = await response.json();
          console.log("Fetched Data: ", fetched_data)
          dispatch(addStudentObject(newStudentTable));
        }
      }   
      catch (error) {
        console.error('Catch Error: ', error);
      }
    }
  }

  return (
    <View
      style={{
        backgroundColor: '#1b1b1d',
        padding: 30,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        rowGap: 15,
      }}>
      <View>
        <Text
          style={{
            fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
            fontSize: 25,
            color: 'white',
            paddingLeft: 10,
          }}>
          Adding Student
        </Text>
      </View>
      <View style={{ height: 130, rowGap: 1 }}>
        <View style={[styles.UpperOption, { flex: 2 }]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <TextInput
              style={styles.OptionText}
              value={StudentName}
              onChangeText={setStudentName}
              placeholder="Student Name"
              placeholderTextColor="#9D9EA0"></TextInput>
          </View>
        </View>

        <TouchableOpacity style={[styles.BottomOption, { flex: 2 }]}>
        <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}>
            <TextInput
              style={styles.OptionText}
              value={PhoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              placeholderTextColor="#9D9EA0"></TextInput>
          </View>
        </TouchableOpacity>

      </View>
      <View style={{ height: 50, padding: 5 }}>
        <TouchableOpacity style={styles.SaveButtonBox} onPress={SaveButton}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
              color: 'black',
              fontSize: 18,
            }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AppDistributor = () => {
    const isConnected = useInternetCheck();
    const navigation = useNavigation<CombinedNavigationProp>();
    const dispatch = useDispatch();
    const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
    const AddingStudentsSheet = useRef<TrueSheet>(null);
    const [LibraryBranchesData, setLibraryBranchesData] = useState<{label: string, value: string}[]>([
      {label: StudentInfoData['Distribution Branch'], value: '1' }
    ])
    const [ActiveBranch, setActiveBranch] = useState(LibraryBranchesData?.[0]?.label);
    const [studentSearch, setStudentSearch] = useState("")
    const prevCount = useRef('');
    const [value, setValue] = useState("");
    const [isFocus, setIsFocus] = useState(false);
    const renderLabel = () => {
        if (value || isFocus) {
          return (
              <Text style={[styles.label, isFocus && { color: '#C88CE1' }]}>
              Library Name
              </Text>
          );
        }
        return null;
    };
    async function RenderDistributor() {
      try {
        const response = await fetch(
          // Platform.OS === 'ios'? 'http://localhost:5000/GetDistributorInfo':'http://10.0.2.2:5000/GetDistributorInfo',
          'https://rescheduler-server.onrender.com/GetDistributorInfo',
          {
            method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
          },
          body: JSON.stringify(StudentInfoData.uniqueID), // Convert the request payload to JSON.
        })
        if (!response.ok) {  // Handle HTTP errors
          throw new Error('Failed to fetch data to the server');
        } 
        const fetched_data = await response.json();
        // console.log("Fetched Distributor: ", fetched_data)
        let BranchList = fetched_data["Other Branches List"]
        if (BranchList.length > 0) {
          let BranchObjectArray = []
          BranchObjectArray.push({label: StudentInfoData['Distribution Branch'], value: '1' })
          for (let index = 0; index < BranchList.length; index++) {
            const element = BranchList[index];
            // let BranchObject = {label: element, value: (index + 2).toString()}
            BranchObjectArray.push({label: element, value: (index + 2).toString()})
          }
          console.log("Branch Object Array: ", BranchObjectArray)
          setLibraryBranchesData(BranchObjectArray)
        }
      } catch (error) {
        console.error('Catch Error: ', error);
    }}

    useEffect(() => {
      RenderDistributor();
      console.log("Library Branches Data: ", LibraryBranchesData)
    }, [StudentInfoData])
    
    useEffect(() => {
      prevCount.current = studentSearch; // Update previous value after the render
    }, [studentSearch]);

    const StudentsData = useSelector((state: RootState) => state.StudentsDataArraySliceReducer.StudentsDataArrayInitialState)

    const StudentDataList = useMemo(() => {
      const table: string[][] = [];
      
      for (let index = 0; index < StudentsData.length; index++) {
        const eachData = StudentsData[index];
        if (eachData['Branch'] == ActiveBranch && eachData["uniqueID"] !== StudentInfoData.uniqueID) {
          table.push([
            eachData['Student_Name'],
            eachData['Phone_Number'],
            eachData['uniqueID']
          ]);
        }
      }
      return table;
    }, [StudentsData, ActiveBranch]);
    
    const [StudentDataTable, setStudentDataTable] = useState<StudentDataTableType>({
      tableHead: ['Student', 'Number', 'Remove'],
      tableData: [[]]
    })

    useEffect(() => {
      setStudentDataTable({
        tableHead: ['Student', 'Number', 'Remove'],
        tableData: StudentDataList
      })
    }, [StudentsData, ActiveBranch])

    const filteredData = useMemo(() => {
    return studentSearch.length > prevCount.current.length
    ? StudentDataTable.tableData.filter((item) =>
        item[0].toLowerCase().includes(studentSearch.toLowerCase())
      )
    : StudentDataList.filter((item) =>
        item[0].toLowerCase().includes(studentSearch.toLowerCase())
    );
    }, [studentSearch, StudentDataTable]);

    useEffect(() => {
      setStudentDataTable({
        tableHead: ['Student', 'Number', 'Remove'],
        tableData: filteredData
      })
    }, [studentSearch])

    const DeleteButton = (uniqueID: string) => {
      async function ClickDelete() {
        try {
          const response = await fetch(
           // Platform.OS === 'ios'? 'http://localhost:5000/UpdateStudent':'http://10.0.2.2:5000/UpdateStudent',
          'https://rescheduler-server.onrender.com/UpdateStudent',
          {
            method: 'POST', // Specify the request method
            headers: {
              'Content-Type': 'application/json',  // Set the request header to indicate JSON payload
            },
            body: JSON.stringify({
              "Type": "uniqueID",
              "Value": uniqueID,
              "Updates": {
                "Distribution Name": "",
                "Distribution ID": "",
                "Distribution Branch": "",
                "Subscription Type": "Free",
              }
            }), // Convert the request payload to JSON.
          })
          if (!response.ok) {  // Handle HTTP errors
            throw new Error('Failed to fetch data to the server');
          }
          const fetched_data = await response.json();
          console.log("Fetched Message: ", fetched_data)
          dispatch(removeStudentObject(uniqueID))
        } catch (error) {
          console.error('Catch Error: ', error);
        }
      }
      return (
      <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={ClickDelete}>
        <View style={styles.btn}>
          <Image source={RemoveIcon} style={{height: 20, width: 20}} />
        </View>
      </TouchableOpacity>
    )};

    async function AddStudentButton() {
      await AddingStudentsSheet.current?.present();
    }

    useEffect(() => {
      // console.log("Is Connected from Settings: ", isConnected)
      if (isConnected == false) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'No Internet',
          textBody: "Please turn on mobile data or Wi-Fi. Don't Worry, we don't show ADs 😌",
          closeOnOverlayTap: false
        })
      }
      else {
        Dialog.hide();
      }
    }, [isConnected])

    // useFocusEffect(
    //   useCallback(() => {
    //     StatusBar.setBackgroundColor("#d6d3da")
    //     return () => {
    //       // optional cleanup when screen is unfocused
    //     };
    //   }, [])
    // );

  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar
      animated={true}
      backgroundColor="#d6d3da"
      />
      <View style={styles.mainStyle}>
          <View style={{height: height * 0.05, backgroundColor: '#d6d3da', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DrawerScreens', {
                    screen: 'TabsDrawer',
                    params: {
                      screen: 'ScheduleTab',
                      params: undefined
                    },
                  })
                }
                style={styles.BackButtonBox}>
                <Image source={LeftArrow} style={styles.BackButtonImage} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 17, color: 'black'}}>App Distributor</Text>
            </View>
            <View style={{flex: 0.1}}>
            </View>
          </View>
          <View style={{flex: 1, padding: 10, paddingRight: width * 0.04, paddingLeft: width * 0.04}}>
              <View style={{marginBottom: 15}}>
                  <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', fontSize: 30, color: 'black'}}>Students Enrolled</Text>
              </View>
              <View style={styles.container}>
                  {renderLabel()}
                  <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: '#C88CE1', borderWidth: 2 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={LibraryBranchesData}
                  itemTextStyle={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', height: 20, color: 'grey'}}
                  itemContainerStyle={{borderRadius: 10, paddingHorizontal: 30, height: 50, justifyContent: 'center'}}
                  containerStyle={{borderRadius: 10}}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={value == '' ? '1' : value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                      setValue(item.value);
                      setActiveBranch(item.label);
                      setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                      <Image
                      source={LibraryIcon}
                      style={styles.icon}
                      />
                  )}
                  />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
                  <Image source={SearchIcon} style={{height: 25, width: 25, position: 'absolute', marginLeft: 10}} />
                  <TextInput
                  style={styles.input}
                  onChangeText={setStudentSearch}
                  value={studentSearch}
                  placeholder='Search "Kartavya Chauhan" '
                  placeholderTextColor='#9b999c'
                  keyboardType="default"
                  />
              </View>

            <View style={styles.containerThree}>
            <ScrollView>
              <Table borderStyle={{borderColor: 'transparent'}}>
                <Row data={StudentDataTable.tableHead} style={styles.head} textStyle={styles.text}/>
                {
                  StudentDataTable.tableData.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.row}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell
                           key={cellIndex} 
                           data={cellIndex === 2 ? DeleteButton(cellData) : cellData}
                           textStyle={cellIndex !== 2 ? styles.tableText : undefined}
                          />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
              </Table>
              </ScrollView>
            </View>

            <LinearGradient colors={['#fff1c1', '#fede71']} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fede71', marginBottom: 15, height: 40, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
              <TouchableOpacity onPress={AddStudentButton}> 
                <Image source={AddIcon} style={{height: 20, width: 20}}/>
              </TouchableOpacity>
            </LinearGradient>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#bb43f3', borderRadius: 10, borderRightWidth: 3,
            borderLeftWidth: 3,
            borderBottomWidth: 3,
            borderColor: '#841AB6', marginBottom: 15}}>
              <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: '#f2f2f3'}}>Subscribe Plan</Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{flex: 1, borderRightWidth: 1, borderColor: '#d6d3da', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'grey'}}>Total Enrolled: {StudentDataList.length}/100</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'grey'}}>Plan Expire: 28/09/2025</Text>
              </View>
            </View>

            <TrueSheet
              ref={AddingStudentsSheet}
              sizes={['auto', 'large']}
              cornerRadius={24}
            >
              <AddingStudent 
                StudentInfoData={StudentInfoData}
                ActiveBranch={ActiveBranch}
              />
            </TrueSheet>
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
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        fontSize: 16,
        paddingLeft: width * 0.12,
        color: 'black',
    },
    container: {
        backgroundColor: 'white',
        marginBottom: 15
      },
      dropdown: {
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 9,
        borderColor: '#d6d3da',
        borderRadius: 10
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
        fontSize: 11,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        color: 'grey'
      },
      placeholderStyle: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
      },
      selectedTextStyle: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
        color: 'black',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold',
      },



      containerTwo: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
      },
      inputTwo: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
      },
      item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      itemText: {
        fontSize: 16,
      },
      empty: {
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
      },
      
      containerThree: { maxHeight: 400, backgroundColor: '#fff'},
      head: { height: 40, backgroundColor: '#808B97' },
      text: { margin: 8, marginLeft: 30, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold' },
      tableText: { margin: 8, marginLeft: 30, fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Bold' : 'sf-pro-display-bold', color: 'grey' },
      row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
      btn: { width: 18, height: 18, borderRadius: 2, justifyContent: 'center', alignItems: 'center', },
      btnText: { textAlign: 'center', color: '#fff'},

      angleInfoColor: {
        height: 16,
        width: 16,
        borderRadius: 15,
        marginLeft: 10,
        marginTop: 5,
      },
    
      OptionText: {
        fontSize: 18,
        color: '#9D9EA0',
        fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
      },
    
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
        flex: 1,
        // flexDirection: 'row',
        backgroundColor: 'blue',
        // backgroundColor: '#222328',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        // paddingLeft: 20,
        // paddingRight: 20,
        fontFamily: Platform.OS === 'ios' ? 'FuturaNo2DEE-Medi' : 'futura-no-2-medium-dee',
        fontSize: 16
      },
      BackButtonBox: {flex: 1, justifyContent: 'center', alignItems: 'flex-start'},
      BackButtonImage: {height: 15, width: 15},
})