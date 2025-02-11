import React, { Component,useState,useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Pressable, Dimensions, SafeAreaView, StatusBar, Image} from 'react-native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
//import { fetchUser , fetchUserPosts, fetchUserFollowing, clearData} from '../redux/actions/index'
//import firebase from 'firebase/compat/app'

import SearchScreen from './Search'
import FeedScreen from './Feed'
import ProfileScreen from './Profile'
import YourselfScreen from './Yourself'
import ChatScreen from './Chat'
import FriendDrawer from './Friendlist'
import { Button } from 'react-native-paper';
//import AddTaskScreen from './main/Addtask';
import firebase from 'firebase/compat/app'
const EmptyScreen = () =>{
    return(null)
}

const TopTab = createMaterialTopTabNavigator();

const Flex = ({navigation}) => {
  const [image, setImage] = useState("https://bit.ly/fcc-running-cats")
  useEffect(()=> {
    //console.log({currentUser,posts})
      firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          if(snapshot.data().downloadURL!=null){
            setImage(snapshot.data().downloadURL)
          }
          
      }
      })},[])
    return (
      <SafeAreaView style = {styles.testContainer}>
        <View style={{flexDirection: 'row', height: Dimensions.get("window").height, justifyContent:'space-around'}}>
            <View style={[{flex: 1}, styles.container, {flexDirection: 'column',  backgroundColor: 'blue', borderRadius:100}]}>
                <View style={{flex: 1, backgroundColor: 'grey', borderTopLeftRadius: 150, borderTopRightRadius: 150}} />
                <View style = {{flex:2, backgroundColor: 'grey'}}>
                  <TouchableOpacity component = {ProfileScreen} onPress= {()=>navigation.navigate("Profile",{uid: firebase.auth().currentUser.uid})}
                  style = {{borderRadius: 100, backgroundColor:'red', width:50, height:50, alignSelf: 'center'}}>
                    <Image source={{uri: image}} style={{flex:1, aspectRatio: 1/1, borderRadius:50}}>

                    </Image>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 18, backgroundColor: 'grey'}} />
                <View style={{flex: 2, backgroundColor: 'grey', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, alignItems: "center"}}>
                    <TouchableOpacity onPress= {()=>navigation.navigate()}>
                        <MaterialCommunityIcons name = "arrow-right" color="white" size ={30}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{flex: 0.2}}></View>
            <View style={{flex: 6}}>
              
                <TopTab.Navigator initialLayout="Yourself" screenOptions={{tabBarLabelStyle: {fontSize: 12, textAlign:"left"}}}>
                    <TopTab.Screen name="Yourself" component={YourselfScreen} options={{ tabBarLabel: 'Yourself' }}/>
                    <TopTab.Screen name="Feeds" component={FeedScreen} options={{ tabBarLabel: 'Feeds' }}/>
                </TopTab.Navigator>
                
            </View>
            
            
            {/* <Text style = {styles.add}>Hello</Text> */}
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 8,
      backgroundColor: 'aliceblue',
    },
    testContainer:{
      flex: 1,
        marginTop:StatusBar.currentHeight
    },
    box: {
      width: 50,
      height: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: 'oldlace',
      alignSelf: 'flex-start',
      marginHorizontal: '1%',
      marginBottom: 6,
      minWidth: '48%',
      textAlign: 'center',
    },
    selected: {
      backgroundColor: 'coral',
      borderWidth: 0,
    },
    buttonLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: 'coral',
    },
    selectedLabel: {
      color: 'white',
    },
    label: {
      textAlign: 'center',
      marginBottom: 10,
      fontSize: 24,
    },
    
  });
export default Flex;