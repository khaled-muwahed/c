import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View, TextInput, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
class getUser extends React.Component {
   
  constructor(props) {

    super(props);
    this.state = {

      first_name: '',
      last_name: '',
      email: '',
      favourite_locations: [],
      liked_reviews: [],
      reviews: [],
      user_id: ''
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
        console.log(responseJson);
        
        this.setState({'first_name': responseJson.first_name});
        this.setState({'last_name': responseJson.last_name});
        this.setState({'email': responseJson.email});
        this.setState({'favourite_locations' : responseJson.favourite_locations});
        this.setState({'liked_reviews' : responseJson.liked_reviews});
        this.setState({'reviews' : responseJson.reviews});
        this.setState({'user_id' : responseJson.user_id});

        console.log(this.state);


        
        

      })
      .catch((error) => {
        console.log(error);
      })
    }

 

   
      
  componentDidMount() {

    this.getData();
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
        <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator />
        <ActivityIndicator size="large" />
        <ActivityIndicator size="small" color="#0000ff" />
        <ActivityIndicator size="large" color="#00ff00" />
      </View>

      )
    }

    //<Text onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name }</Text>
    return (
            <View style={{flex:1}}>
                <View>
                    
                <Text >Name: {this.state.first_name + " " + this.state.last_name  }</Text>
                <Text >Email: {this.state.email}</Text>
                </View>
                <View>
                    <Text style = {styles.textStyle}>User favourite locations </Text>
                    </View>
                
                <FlatList
                    data={this.state.favourite_locations}
                    renderItem={({item})=>(
                    <View>
                        <View > 
                        <Text style = {styles.clickable} onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name 
                        }</Text>
                        </View>

                        
                        <Text >{"ID: " + item.location_id
                        }</Text>

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
