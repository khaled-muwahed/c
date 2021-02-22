import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View, TextInput,RefreshControl, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
class getUser extends React.Component {
   
  constructor(props) {

    super(props);
    this.state = {
      refreshing: false,
      setRefreshing: false,

      isLoading: true,
      userData: null

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
               
                    <View style={styles.fixToText}> 
              <Text style={styles.txtInitials}>Name: {this.state.userData.first_name + " " + this.state.userData.last_name  }</Text>
              <Text style={styles.txtInitials}>,Email: {this.state.userData.email}</Text>
              </View>

             
                  
              <TouchableOpacity style ={styles.buttonStyle}
               onPress={() => navigator.navigate('ViewReviews')  }>
               <Text >View my Reviews</Text>
               </TouchableOpacity>
               <TouchableOpacity style ={styles.buttonStyle}
               onPress={() => navigator.navigate('ViewLikedReviews')  }>
               <Text >View Liked Reviews</Text>
               </TouchableOpacity>

               <Text style= {styles.headLine}>My favourite locations</Text>

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
                <View style= {styles.fields}>
                    <View > 
                    <Text style = {styles.clickable} onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name 
                    }</Text>
                    </View>
                    <Text>Location: {item.location_town}</Text>
                    

                    
                    <View style= {styles.RatingStyle}>
                    <Text>Overall Rating: </Text>  
                    <AirbnbRating
                    size ={10}
                    
                    defaultRating = {item.quality_rating}
                    isDisabled
                    
                    />
                    </View>  
                           
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
  RatingStyle:{
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom:5,
    
  
  }
    ,
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
  headLine:{
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 18,
    paddingBottom: 20
  } ,
  txtInitials:{
    
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0B92F2',
    fontSize: 15  
  } , 
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cancelText: {
    fontSize: 22,
    alignSelf: 'center',
    color: 'red',
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },

  buttonStyle: {
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#007aff',
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    marginTop:10,
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
