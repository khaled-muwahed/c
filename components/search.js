import React, { Component } from 'react';
import { Rating, AirbnbRating } from 'react-native-ratings';
import {
  ScrollView,
  Button, FlatList
  ,RefreshControl
  ,
  ToastAndroid,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchUser extends Component {
    constructor(props) {
        //super() is used to call the parent constructor, here the props is passed to the parent constructor to call React 
        super(props);
        //This state defines the data type of the objects below
        this.state = {
            refreshing: false,
            setRefreshing: false,
          isLoading: true,
          q: '',
          locations: null,
          overall_rating: 0,
        };
      }

      search = async (url) => {
        console.log('we are in user details');
      let id = await  AsyncStorage.getItem('@user_id');
      let token = await  AsyncStorage.getItem('@session_token');
      return fetch(url, {
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

      searchUrl = () =>  {
          let url = 'http://10.0.2.2:3333/api/1.0.0/find?'


          if (this.state.q != ''){
              url += "q=" + this.state.q + "&";
          }
          if (this.state.overall_rating > 0){
              url += "overall_rating=" + this.state.overall_rating + "&";
          }
          console.log(url);

          this.search(url)
      }
      ratingDone   (rating , name) {
          let stateObj = () => {
              let returnObj = {};
              returnObj[name] = rating;
              return returnObj;
          };
          this.setState (stateObj);

      }

  
  logData= () => {
    console.log(this.state.overall_rating);
    }

    onRefresh = () => {
        this.searchUrl();
       // console.log("redsfsfres")
      }



  render() {
    
    return (
      <View>

            
            <TextInput
              placeholder="Enter an a word to search for..."
              style={styles.formInput}
              onChangeText={(q) => this.setState({q: q})}
              value={this.state.q}
            />

            <Text>overall rating</Text>
            <AirbnbRating
            size ={15}
            defaultRating = {0}
            onFinishRating = {(rating) => this.ratingDone(rating , "overall_rating")}

            />
            <Button
            title = "Search"
            onPress = {() => this.searchUrl()}
            />

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
                          {"Name: " + item.location_name}</Text>
                        <Text >{"overall_rating: " + item.avg_overall_rating
                        }</Text>
                        
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
  title: {
    color: 'steelblue',
    backgroundColor: 'lightblue',
    padding: 10,
    fontSize: 25,
  },
  formItem: {
    padding: 20,
  },
  formLabel: {
    fontSize: 15,
    color: 'steelblue',
  },
  formInput: {
    borderWidth: 1,
    borderColor: 'lightblue',
    borderRadius: 5,
  },
  formTouch: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center',
  },
  formTouchText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'steelblue',
  },
  
  fields: {
    margin: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 15,
    fontSize: 20,

  },
});

export default SearchUser;