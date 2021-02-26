import 'react-native-gesture-handler';
import React, { Component } from 'react';
//import React, { PureComponent } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { NavigationContainer } from '@react-navigation/native';
//import SearchUser from './components/search';
//import SearchUser from './search';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styling/stylingSheet';
import { color } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
 
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert
  ,
  Image, 

  View,
  Button,
  

} from 'react-native';





class Home extends React.Component {
  constructor(props) {

    super(props);
    this.state = {

      refreshing: false,
      setRefreshing: false,

      isLoading: true,
    
      locations: null,

      pageCount: '',
      pageNum: 0,
      initialNum: 100


      
    };

  }

  retrieveAllLocations = async () => {
    console.log("retrieve function keeps updating");
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find?limit='+this.state.initialNum, {
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
          pageCount: responseJson.length,
          
        });
       
        console.log(this.state.pageCount , "PAGE COUNT");

      })
      .catch((error) => {
        console.log(error);
      })
    
    }



    displayCoffeeShops = async (page) => {
      console.log("display function keeps updating");
      this.setState ({
        pageNum : page
      })
    let pageOffset = page * 5;
    let id = await  AsyncStorage.getItem('@user_id');
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find?offset='+pageOffset + '&limit=' + 5, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization' : token
        }
      })
      .then((response) => {
        if(response.status === 200) {
          console.log(this.state.pageNum , " page")
         
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

    signOutAlert = () => {
      Alert.alert(
        'Signing Out',
        'Are you sure you want to logout?',
        [
          {
            text: 'Stay logged in',
            style: 'cancel'
          },
          {
            text: 'Leave',
            onPress: () => this.signOut(),
          },
        ],
        {cancelable: false},
      );
    };


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
      this.retrieveAllLocations();
      this.displayCoffeeShops(this.state.pageNum);
    });
  }
  componentWillUnmount(){
    this.unsubscribe();
  }





 

    onRefresh = () => {
      this.retrieveAllLocations();
      this.displayCoffeeShops(this.state.pageNum);
      console.log("redsfsfres")
    }

    
    nextPage = (page) => {
      if (this.state.pageNum * 5 <this.state.pageCount-5){
        this.displayCoffeeShops(page)
        this.setState({pageNum : page})
        console.log(this.state.pageNum);
      }

    }

      // onPress={() => {this.state.pageNumber===0?'':this.getAllLocationsPaged(this.state.pageNumber-1)}}>
    perviousPage = (page) => {
      if (this.state.pageNum > 0){
        this.displayCoffeeShops(page)
        this.setState({pageNum : page})
        console.log(this.state.pageNum);
      }

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
    
      

      
    <View style= {styles.container}> 

        <View style={styles.fixToText}> 

              <TouchableOpacity
                      style={styles.formTouch}
                      onPress={() => {this.perviousPage(this.state.pageNum -1)}}>
                      
                        {this.state.pageNum===0?<Text >''</Text>:<Ionicons name= {"chevron-back-sharp"} size = {23}/>}
              
                    </TouchableOpacity>
               
        
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => this.signOutAlert()}
               >
                <Text style={styles.formTouchText}>logout <Ionicons name= {"log-out-outline"} size = {25}/></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.formTouch}
                onPress={() => {this.nextPage(this.state.pageNum+1)}}>
                 
                {this.state.pageNum * 5 <this.state.pageCount-5?<Ionicons name= {"chevron-forward-sharp"} size = {23}/>:<Text>''</Text>}

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


