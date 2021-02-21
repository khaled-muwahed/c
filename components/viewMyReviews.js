import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text,RefreshControl, View, TextInput, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
class ViewReviews extends React.Component {
   
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
      console.log('we are in View review details');
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

       deleteReview = async (loc_id,rev_id) => {
        let token = await  AsyncStorage.getItem('@session_token');
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ loc_id +"/review/"+rev_id, {
       
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization' : token
        },
      })
      .then((response) => {
        if(response.status === 200) {
            console.log('deleted')
          //return response.json()
        }else if(response.status === 400) {
          throw 'Bad req';
        }
          else if(response.status === 401) {
          throw 'unautorised';
        }
        else{
          throw 'Somthing went wrong';
        }
      })
     
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
      
    }

      
  componentDidMount() {

    this.getData();
    }

    updateReview = () => {
    this.props.navigation.navigate('update_review',{location_id: item.location_id,review_id: item.review_id});
    }

    onRefresh = () => {
        this.getData();
        console.log("deleting refreshing")
      }


    logDataTesting = (x,y) => {
       // console.log()
    }



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

    else{
      

    //<Text onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name }</Text>
    return (
        <SafeAreaView style={styles.container}>
               
                    
              <Text >Name: {this.state.userData.first_name + " " + this.state.userData.last_name  }</Text>
              <Text >My Reviews</Text>
                  
              

               <FlatList
               refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }



                data={this.state.userData.reviews}
                 renderItem={({item})=>(
                    <View style = {styles.fields}>
                   
                        <Text style = {styles.clickable} >{item.review.review_id + " " +item.review.review_body 
                        }</Text>
                        <Text style = {styles.clickable} >{item.review.clenliness_rating 
                        } review clean rating</Text>
                        
                        
                        <View style={styles.fixToText}>
                        <Button
                        title="Update"
                        onPress={() => navigator.navigate('update_review',{review_id: item.review.review_id, location_id: item.location.location_id})
                           }
                        />
                        <Button
                        title="Delete"
                        onPress={() => this.deleteReview(item.location.location_id , item.review.review_id) + this.onRefresh()}
                        />
                        </View>
                        <Text>{}</Text>
                            
                    </View>
                    )}
                    keyExtractor= {(item)=> item.review.review_id.toString()}

                    />
                

            </SafeAreaView>
       

     
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
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
      },
      title: {
        textAlign: 'center',
        marginVertical: 8,
      },
      fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

})


export default  ViewReviews ;
