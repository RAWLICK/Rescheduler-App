import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux' 
import { RootState } from '../../app/Store';
import Infinity from '../Images/Infinity.png'
import LogOut from '../Images/LogOut.png'
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { updateLocalStorageInfo } from '../../app/Slice';
import { CommonActions } from '@react-navigation/native';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<any, any>>();
    const [NameHeading, setNameHeading] = useState("")
    const [SubscriptionHeading, setSubscriptionHeading] = useState("")
    const StudentInfoData = useSelector((state: RootState) => state.StudentInfoSliceReducer.StudentInfoInitialState)
    console.log(StudentInfoData)

    function SubscriptionHeadingDecider() {
        if (StudentInfoData['Subscription Type'] == "Free") {
            setSubscriptionHeading("Free Trial - 7 Days")
        }
        else if (StudentInfoData['Subscription Type'] == "Library") {
            setSubscriptionHeading("Premium")
        }
        else if (StudentInfoData['Subscription Type'] == "Infinite") {
            setSubscriptionHeading("Infinite")
        }
    }

    function LogoutPress() {
        dispatch(updateLocalStorageInfo("Logout"));

        // Resetting the navigation stack to SignInStack. Now the history of the previous screens will be cleared.
        // This is done to prevent the user from going back to the previous screens after logging out.
        navigation.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [
                {
                name: 'StackScreens',
                state: {
                    routes: [{ name: 'SignInStack' }],
                },
                },
            ],
            })
        );
    }

    useEffect(() => {
        SubscriptionHeadingDecider()
    }, [])
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <View style={{padding: 15, paddingLeft: 20, borderBottomColor: 'grey', borderBottomWidth: 0.5, marginBottom: 10}}>
            <Text style={{ fontSize: 24, fontFamily: 'sf-pro-display-bold', color: 'white'}}>{StudentInfoData.Name == ""? "Hello, Mate": StudentInfoData.Name}</Text>
            {StudentInfoData['Subscription Type'] == "Free" &&
            <View style={{backgroundColor: '#8dc2f7', width: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 5, paddingVertical: 2}}>
                <Text style={{color: '#05498d', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 12}}>{SubscriptionHeading}</Text>
            </View>
            }
            {StudentInfoData['Subscription Type'] == "Library" &&
            <View style={{backgroundColor: '#f8de67', width: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 5, paddingVertical: 2}}>
                <Text style={{color: '#806a02', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 12}}>Premium</Text>
            </View>
            }
            {StudentInfoData['Subscription Type'] == "Infinite" &&
            <View style={{backgroundColor: '#96fba5', width: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 5, flexDirection: 'row', columnGap: 5, paddingVertical: 2}}>
                <Text style={{color: '#03ac1c', fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Medium' : 'sf-pro-display-medium', fontSize: 12}}>Infinite</Text>
                <Image source={Infinity} style={{width: 20, height: 20}}/>
            </View>
    }
        </View>
      <DrawerItemList {...props} />
        <DrawerItem
            label="Logout"
            labelStyle={{color: 'white', fontFamily: 'sf-pro-display-bold', fontSize: 14}}
            onPress={LogoutPress}
            icon={() => <Image source={require('../Images/LogOut.png')} style={{width: 25, height: 25}}/>}
            style={{marginTop: 'auto'}}
        />

    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent

const styles = StyleSheet.create({})