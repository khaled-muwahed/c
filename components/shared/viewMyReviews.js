//import * as React from 'react';
import React, { PureComponent } from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text,Image,RefreshControl, View, TextInput, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import styles from '../../Styling/stylingSheet';

import { RNCamera } from 'react-native-camera';

class ViewReviews extends PureComponent {
   
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
    deleteReviewAlert = (id , loc) => {
      Alert.alert(
        'Deleting this Review',
        'Are you sure you want to delete this review?',
        [
          {
            text: 'Cancel',
            
          },
          {
            text: 'Delete',
            onPress: () => this.deleteReview(id , loc),
          },
        ],
        {cancelable: false},
      );
    };




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
            //console.log('deleted');
            this.getData();
          
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


    deleteReviewPicAlert = (id , loc) => {
      Alert.alert(
        'Deleting this Review Photo',
        'The photo will be permanently deleted, are you sure you want to delete?',
        [
          {
            text: 'Cancel',
            
          },
          {
            text: 'Confirm',
            onPress: () => this.deleteReviewPic(id , loc),
          },
        ],
        {cancelable: false},
      );
    };



    deleteReviewPic = async (loc_id, rev_id) => {
      let token = await  AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ loc_id +"/review/"+rev_id+ "/photo", {
     
      method: 'delete',
      headers: {
      
        'x-authorization' : token
      },
    })
    .then((response) => {
      if(response.status === 200) {
        ToastAndroid.show("review photo deleted successfully", ToastAndroid.SHORT);
       
      }
        else if(response.status === 401) {
        throw 'unauthorised';
      } 
      else if(response.status === 404) {
      throw 'Not found';
     }
      else if(response.status === 500) {
      throw 'server error';
      }
     
      else{
        throw 'Somthing went wrong';
      }
    })
   
    .catch((error) => {
      console.log("console error", error );
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
    
  }



// to updateeeee



      
  componentDidMount() {

    this.getData();
    //this.onRefresh();
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
          <View>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>

      )
    }

    else{
      

    //<Text onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>{item.location_name }</Text>
    return (
        <SafeAreaView style={styles.container}>
               
                    
              <Text style= {styles.txtInitials}>{this.state.userData.first_name + " " + this.state.userData.last_name  }</Text>
              <Text style= {styles.headLine}>My Reviews</Text>
                  
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
                      <Text style = {styles.centeredTxt}> {item.location.location_name  }, {item.location.location_town  } </Text>
                       
                        <View style={styles.fixToText}>
                            <Text style={styles.textAdjust}>overall rating: </Text>
                            <AirbnbRating
                            size ={15}
                            defaultRating ={item.review.overall_rating}
                            isDisabled 
                            />
                            <Text style={styles.textAdjust}>price rating:</Text>
                            <AirbnbRating
                            size ={15}
                            
                            defaultRating = { item.review.price_rating}
                            isDisabled
                            />
                        </View>

                            <View style = {styles.fixToText}>
                            <Text style={styles.textAdjust}>cleanliness rating: </Text>
                            <AirbnbRating
                            size ={15}
                              defaultRating ={item.review.clenliness_rating}
                              isDisabled
                            />
                            <Text style={styles.textAdjust}>quality rating: </Text>
                            <AirbnbRating
                            size ={15}
                            defaultRating = {item.review.quality_rating}
                            isDisabled
                            
                            />

                        </View>

                        <Text style={styles.centeredTxt} >{ item.review.review_body}</Text>

                        <Image
                          source={{uri:'http://10.0.2.2:3333/api/1.0.0/location/'+
                          item.location.location_id+'/review/'+
                          item.review.review_id+'/photo?timestamp' +Date.now()} }
                    
                          style={styles.reviewImag}
                        />
                   
                       
                        
                        
                        <View style={styles.fixToText}>
                        <TouchableOpacity
                         style={styles.buttonStyle}
                           onPress={() => navigator.navigate('update_review',{review_id: item.review.review_id, 
                          location_id: item.location.location_id})}>
                         <Text style={styles.formTouchText}>Update</Text>
                         </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonStyle}
                           onPress={() => this.deleteReviewAlert(item.location.location_id , item.review.review_id) }
                          >
                          <Text style={styles.formTouchText}>Delete</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                         style={styles.buttonStyle}
                           onPress={() => navigator.navigate('addReviewPic',{review_id: item.review.review_id, 
                          location_id: item.location.location_id})}>
                         <Text style={styles.formTouchText}>Add a photo</Text>
                         </TouchableOpacity>
                         
                        </View>
                        <View style={styles.fixToText}>
                        <TouchableOpacity
                         style={styles.buttonStyle}
                           onPress={() => this.deleteReviewPicAlert(item.location.location_id , item.review.review_id) }>
                         <Text style={styles.formTouchText}>Delete photo</Text>
                         </TouchableOpacity>
                         </View>
                        
                            
                    </View>
                    )}
                    keyExtractor= {(item)=> item.review.review_id.toString()}

                    />
                



               
                

            </SafeAreaView>
       

     
    );
  }
  
}
}



export default  ViewReviews ;
