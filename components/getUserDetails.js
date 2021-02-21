import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View, TextInput,RefreshControl, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
class getUser extends React.Component {
   
  constructor(props) {

    super(props);
    this.state = {
      refreshing: false,
      setRefreshing: false,

      isLoading: true,
      userData: null
/*
      first_name: '',
      last_name: '',
      email: '',
      favourite_locations: [],
      liked_reviews: [],
      reviews: [],
      user_id: '',
      review:'',
      info:{}*/
    };

  }

  getData =  async () => {
      console.log('we are in user details');
    let id = await  AsyncStorage.getItem('@user_id');
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+id, {
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
          userData : responseJson
        });


        

      })
      .catch((error) => {
        console.log(error);
      })
    }



 

   
      
  componentDidMount() {

    this.getData();
    }

    onRefresh = () => {
      this.getData();
     // console.log("redsfsfres")
    }
    coffeeDInfo = () => {
    this.props.navigation.navigate('LocatinInfo',{location_id: item.location_id});
    }

     

    /*storeLocationId = async (locatin_id) => {
        try {
          console.log('hey')
          await AsyncStorage.setItem('location Id', JSON.stringify(locatin_id))
          console.log("Location => " + locatin_id);
          
        } catch (e) {
        }
      }
*/
/*
      displayLocId = () => {
        let id = await  AsyncStorage.getItem('locatin_id');
        console.log(id);
        }

*/ 


  render() {
   

    
    const navigator = this.props.navigation;
      console.log('get data rendering');
    if (this.state.isLoading) {
      return (
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>

      )
    }

    else{
      

    //<Text onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name }</Text>
    return (
            <View style={{flex:1}}>
               
                    
              <Text >Name: {this.state.userData.first_name + " " + this.state.userData.last_name  }</Text>
              <Text >Email: {this.state.userData.email}</Text>
                  
              <TouchableOpacity style ={styles.buttonStyle}
               onPress={() => navigator.navigate('ViewReviews')  }>
               <Text >View my Reviews</Text>
               </TouchableOpacity>

                <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                showsVerticalScrollIndicator
                          
                data={this.state.userData.favourite_locations}
                renderItem={({item})=>(
                <View>
                    <View > 
                    <Text style = {styles.clickable} onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name 
                    }</Text>
                    </View>
                    <Text >{"Town: " + item.location_town}</Text>
                    

                    <Text>{"Rating " + item.avg_overall_rating }</Text>    
                    <Text>{}</Text>        
                    </View>

                )}
                keyExtractor= {(item)=> item.location_id.toString()}
                />
            </View>
       

     
    );
  }
  
}
}

const styles = StyleSheet.create({

  fields: {
    margin: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 15,
    fontSize: 20,

  },
  textStyle: {
    fontSize: 22,
    alignSelf: 'center',
    color: '#007aff',
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  clickable: {
    fontWeight: "bold",
    fontSize: 25,
    textDecorationLine : "underline"

  }
  ,

  cancelText: {
    fontSize: 22,
    alignSelf: 'center',
    color: 'red',
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },

  buttonStyle: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#007aff',
    marginLeft: 20,
    marginRight: 20,
    padding: 9,
    marginBottom: 15,
  },
  cancelStyle: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'red',
    marginLeft: 20,
    marginRight: 20,
    padding: 9,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {

    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }

})


export default getUser;
