import 'react-native-gesture-handler';
import React, {Component} from 'react';

import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';





import { NavigationContainer, useBackButton } from '@react-navigation/native';


import signup from './components/signup';
import login from './components/SignIn';
import home from './components/home';

//import signup from '../components/signup';

import LocatinInfo from './components/shared/locationInfo';
import add_review from './components/shared/addReview';
import ViewReviews from './components/shared/viewMyReviews';
import update_review from './components/shared/updateReview';
import addReviewPic from './components/shared/addPic';
import bottomTabNav from './Navigator/bottomTabNav';
import ViewLikedReviews from './components/shared/viewLikedReviews';


const Stack = createStackNavigator();

class App extends React.Component {
  constructor (props){
    super(props);
  }

  //my app has a main stack navigator, and calls a tab navigator when on home page
render()
  {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name= "login" component = {login}></Stack.Screen>
        <Stack.Screen name= "signup" component = {signup}></Stack.Screen>
        <Stack.Screen name="home" component={bottomTabNav}  options={{headerLeft: null, title: 'Coffida'}}/> 
        <Stack.Screen name= "LocatinInfo" component = {LocatinInfo}></Stack.Screen>
        <Stack.Screen name= "add_review" component = {add_review}></Stack.Screen>
        <Stack.Screen name= "addReviewPic" component = {addReviewPic}></Stack.Screen>
        <Stack.Screen name= "ViewReviews" component = {ViewReviews}></Stack.Screen>
        <Stack.Screen name= "update_review" component = {update_review}></Stack.Screen>
        <Stack.Screen name= "ViewLikedReviews" component = {ViewLikedReviews}></Stack.Screen>        
        </Stack.Navigator>
      </NavigationContainer>
     
    
    );
    
  }
}

export default App;
