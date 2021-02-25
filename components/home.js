import 'react-native-gesture-handler';
//import React, { Component } from 'react';
import React, { PureComponent } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { NavigationContainer } from '@react-navigation/native';
//import SearchUser from './components/search';
//import SearchUser from './search';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styling/stylingSheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  BackHandler
  ,
  Image, 

  View,
  Button,
  

} from 'react-native';


import { color } from 'react-native-reanimated';


class Home extends PureComponent {
  constructor(props) {

    super(props);
    this.state = {

      refreshing: false,
      setRefreshing: false,

      isLoading: true,
    
      locations: null,
      
    };

  }



    displayCoffeeShops = async () => {
      console.log('we are in user details');
    let id = await  AsyncStorage.getItem('@user_id');
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization' : token
        }
      })
      .then((response) => {
        if(response.status === 200) {
          return response.json()
        }else{
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {
        this.setState ({
          isLoading: false,
          locations : responseJson
        });

      })
      .catch((error) => {
        console.log(error);
      })
    
    }


  signOut = async () => {
    let value = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method: 'post',
      headers: {
        //'Content-Type': 'application/json'
        'x-authorization': value
      },

    })
    .then( async(response) => {
      if(response.status === 200) {
        await AsyncStorage.clear();
        this.props.navigation.navigate('login');
  

      }else if(response.status === 401) {
        throw 'unauthorised';
      }else{
        throw 'Somthing went wrong';
      }
    })
    
  }
  getUserDetails = () => {
    this.props.navigation.navigate('getUser');
  }




  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', ()=>{
      this.displayCoffeeShops();
    });
  }
  componentWillUnmount(){
    this.unsubscribe();
  }





 

    onRefresh = () => {
      this.displayCoffeeShops();
      console.log("redsfsfres")
    }

    


  

 render() {
    const navigator = this.props.navigation;
   
    if (this.state.isLoading) {
      return (
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>

      )
    }
    else {
        
    return (
    
      

      
    <View style={{flex:1 }}> 

        <View style={styles.fixToText}> 

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => this.signOut()}
               >
                <Text style={styles.formTouchText}>logout <Ionicons name= {"log-out-outline"} size = {25}/></Text>
              </TouchableOpacity>
        </View>
      
     
      
      <FlatList  
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                 style = {styles.fields}
                data={this.state.locations}
                renderItem={({item})=>(

                    
                    <View style = {styles.fields}>
                      
                          < Text style = {styles.clickable} onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>
                          {item.location_name}</Text>
                          
                          <Text>Location: {item.location_town}</Text>
                          <Text >Average overall Rating: </Text>
                       
                          <AirbnbRating
                        
                          size ={15}
                            defaultRating = { item.avg_overall_rating }
                            isDisabled
                          />
                          <Text></Text>
                        <Image
                         style={styles.imageStyle}
              
                         source={item.photo_path ? {uri: item.photo_path } : null + Date.now()}  />
                        
                        <Text>{}</Text>        
                    </View>
                    )}
                    keyExtractor= {(item)=> item.location_id.toString()}
                />



    </View>

     
    )
  }

}
}


export default Home;


