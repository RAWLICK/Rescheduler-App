import { StyleSheet, Text, View, Dimensions, TextInput, Image, SafeAreaView, StatusBar, ListRenderItem, FlatList, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { useState, useEffect, useRef } from 'react';
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
const { width, height } = Dimensions.get('window');
interface Item {
    id: number;
    name: string;
}

const AddingStudent = () => {
  const dispatch = useDispatch();
  const [StudentName, setStudentName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState("")

  const SaveButton = () => {
    const newExistingSubject = {
      "uniqueID": nanoid(),
      "Student_Name": StudentName,
      "Phone_Number": PhoneNumber
    }
    dispatch(addStudentObject(newExistingSubject));
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
            fontFamily: 'sf-pro-display-bold',
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
              alignItems: 'flex-start',
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
              justifyContent: 'center',
              alignItems: 'flex-start',
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
              fontFamily: 'futura-no-2-medium-dee',
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
  const dispatch = useDispatch();
  const AddingStudentsSheet = useRef<TrueSheet>(null);
    const data = [
        { label: 'JDA Library', value: '1' },
        { label: 'KDA Library', value: '2' },
    ];
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
    useEffect(() => {
      prevCount.current = studentSearch; // Update previous value after the render
    }, [studentSearch]);

    const StudentData = useSelector((state: RootState) => state.StudentsDataArraySliceReducer.StudentsDataArrayInitialState)

    const StudentDataList = useMemo(() => {
      const table: string[][] = [['Lamda', '0987654321', '0']];
      for (let index = 0; index < StudentData.length; index++) {
        const eachData = StudentData[index];
        table.push([
          eachData['Student_Name'],
          eachData['Phone_Number'],
          eachData['uniqueID']
        ]);
      }
      return table;
    }, [StudentData]);
    
    // const studentData = [
    //   ['Chomu', '1234567890', '5',],
    //   ['Archit', '9123456789', '3',],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Sachin Tendulkar', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3'],
    //   ['Kartavya Chauhan', '9876543210', '3'],
    //   ['Rahul Gupta', '9123456789', '3']
    // ]
    // Filter logic
    
    const [StudentDataTable, setStudentDataTable] = useState({
      tableHead: ['Student', 'Number', 'Remove'],
      tableData: StudentDataList
    })

    // const filteredData = studentSearch.length > prevCount.current.length
    // ? StudentDataTable.tableData.filter((item) => 
    //   item[0].toLowerCase().includes(studentSearch.toLowerCase())
    // )
    // : StudentDataList.filter((item) =>
    //     item[0].toLowerCase().includes(studentSearch.toLowerCase())
    // );

    const filteredData = useMemo(() => {
    return studentSearch.length > prevCount.current.length
    ? StudentDataTable.tableData.filter((item) =>
        item[0].toLowerCase().includes(studentSearch.toLowerCase())
      )
    : StudentDataList.filter((item) =>
        item[0].toLowerCase().includes(studentSearch.toLowerCase())
    );
    }, [studentSearch, StudentDataTable]);

    // const filteredData = StudentDataList;

    // console.log("Filtered Data: ", filteredData)
    // useEffect(() => {
    //   setStudentDataTable({
    //     tableHead: ['Student', 'Number', 'Remove'],
    //     tableData: filteredData
    //   })
    // }, [studentSearch])

    useEffect(() => {
      setStudentDataTable({
        tableHead: ['Student', 'Number', 'Remove'],
        tableData: filteredData
      })
    }, [filteredData])

    useEffect(() => {
      console.log("Student Table Record: ", StudentDataList)
    }, [StudentData, StudentDataList])
    

    const DeleteButton = (uniqueID: string) => {
      dispatch(removeStudentObject(''))
      return (
      <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => console.log("uniqueID: ", uniqueID)}>
        <View style={styles.btn}>
          <Image source={RemoveIcon} style={{height: 20, width: 20}} />
        </View>
      </TouchableOpacity>
    )};

    async function AddStudentButton() {
      await AddingStudentsSheet.current?.present();
    }

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
          <View style={{flex: 1, padding: 10, paddingRight: width * 0.04, paddingLeft: width * 0.04}}>
              <View style={{marginBottom: 15}}>
                  <Text style={{fontFamily: 'sf-pro-display-bold', fontSize: 30, color: 'black'}}>Students Enrolled</Text>
              </View>
              <View style={styles.container}>
                  {renderLabel()}
                  <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: '#C88CE1', borderWidth: 2 }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
                  itemTextStyle={{fontFamily: 'sf-pro-display-bold', height: 20}}
                  itemContainerStyle={{borderRadius: 10, paddingHorizontal: 30, height: 50, justifyContent: 'center'}}
                  containerStyle={{borderRadius: 10}}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                      setValue(item.value);
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
                          <Cell key={cellIndex} data={cellIndex === 2 ? DeleteButton(cellData) : cellData}
                           textStyle={styles.text}
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
              <Text style={{fontFamily: 'sf-pro-display-bold', color: '#f2f2f3'}}>Subscribe Plan</Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{flex: 1, borderRightWidth: 1, borderColor: '#d6d3da', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sf-pro-display-bold', color: 'grey'}}>Total Enrolled: 80/100</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'sf-pro-display-bold', color: 'grey'}}>Plan Expire: 28/09/2025</Text>
              </View>
            </View>

            <TrueSheet
              ref={AddingStudentsSheet}
              sizes={['auto', 'large']}
              cornerRadius={24}
            >
              <AddingStudent/>
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
        fontFamily: 'sf-pro-display-bold',
        fontSize: 16,
        paddingLeft: width * 0.12
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
        fontFamily: 'sf-pro-display-bold',
      },
      placeholderStyle: {
        fontSize: 16,
        fontFamily: 'sf-pro-display-bold',

      },
      selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'sf-pro-display-bold',
        color: 'black',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'sf-pro-display-bold',
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
      
      containerThree: { height: 400, backgroundColor: '#fff'},
      head: { height: 40, backgroundColor: '#808B97' },
      text: { margin: 8, marginLeft: 30, fontFamily: 'sf-pro-display-bold' },
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
        fontFamily: 'futura-no-2-medium-dee',
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
        fontFamily: 'futura-no-2-medium-dee',
        fontSize: 16
      },
})