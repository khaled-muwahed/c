import 'react-native-gesture-handler';
import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';




import { NavigationContainer } from '@react-navigation/native';


import signup from './components/signup';
import login from './components/SignIn';
import home from './components/home';
import getUser from './components/getUserDetails';
//import signup from '../components/signup';
import Update from './components/updateUser';
import LocatinInfo from './components/locationInfo'
const Stack = createStackNavigator();

class App extends React.Component {
  constructor (props){
    super(props);
  }
render()
  {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name= "login" component = {login}></Stack.Screen>
        <Stack.Screen name= "signup" component = {signup}></Stack.Screen>
        <Stack.Screen name= "home" component = {home}></Stack.Screen>
        <Stack.Screen name= "Update" component = {Update}></Stack.Screen>
        <Stack.Screen name= "getUser" component = {getUser}></Stack.Screen>
        <Stack.Screen name= "LocatinInfo" component = {LocatinInfo}></Stack.Screen>
        
        </Stack.Navigator>
      </NavigationContainer>
     
    
    );
    
  }
}

export default App;
