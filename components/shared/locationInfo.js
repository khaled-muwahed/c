import * as React from 'react';
import { Rating, AirbnbRating } from 'react-native-ratings';

//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View,Image,Use,RefreshControl, TextInput, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocatinInfo extends React.Component {
   
  constructor(props) {

    super(props);
  
        this.state = {
          refreshing: false,
          setRefreshing: false,
          isDisabled: false,
          isLoading: true,

          isLikedLocation: false,

          isLikedReview: [],

          likes: 0, 
          
          userData: null,
          clicked_location_id: this.props.route.params.location_id,
          overall_rating: 0,
          
             price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
      
        };
     
  

  }

  getData =  async () => {
      console.log('we are in coffee details');
    //let id = await  AsyncStorage.getItem('@user_id');
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.clicked_location_id, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization' : token
  
        }
      })
      .then((response) => {
        if(response.status === 200) {
          this.checkFav();
          return response.json()
        }else{
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {
        
       // console.log(responseJson);
       this.setState ({
        isLoading: false,
        userData : responseJson
        


      });
     /* this.setState({'likes': responseJson.location_reviews.likes});
      console.log(this.state.likes , "Likes number");*/
        
      })
      .catch((error) => {
        console.log(error);
      })
    }

    addToFavouriate =  async () => {
   // let id = await  AsyncStorage.getItem('@user_id');
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.clicked_location_id +'/favourite', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization' : token
        }
      })
      .then((response) => {
        if(response.status === 200) {
          console.log('ADDED');
          ToastAndroid.show("added to favourite", ToastAndroid.show);
        }else{
          throw 'Somthing went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }

    RmvfromFav =  async () => {
      // let id = await  AsyncStorage.getItem('@user_id');
       let token = await  AsyncStorage.getItem('@session_token');
       return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.clicked_location_id +'/favourite', {
           method: 'delete',
           headers: {
             'Content-Type': 'application/json',
             'x-authorization' : token
           }
         })
         .then((response) => {
           if(response.status === 200) {
             console.log('DELETED');
             ToastAndroid.show("deleted", ToastAndroid.show);
           }else{
             throw 'Somthing went wrong';
           }
         })
         .catch((error) => {
           console.log(error);
         })
       }
   
       addReview = () => {
        this.props.navigation.navigate('Update');
    }

      likeReview = async (loc_id,rev_id) => {
        let token = await  AsyncStorage.getItem('@session_token');
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ loc_id +"/review/"+rev_id +"/like", {
      
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization' : token
        },
      })
      .then((response) => {
        if(response.status === 200) {
         // this.setState ({isLikedReview: true});
            console.log('liked')
          //return response.json()
        }else if(response.status === 400) {
          throw 'Bad req';
        }
          else if(response.status === 401) {
          throw 'unautorised';
        }
        else if(response.status === 500) {
          throw 'server error';
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

    unLikeReview = async (loc_id,rev_id) => {
      let token = await  AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ loc_id +"/review/"+rev_id +"/like", {
    
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization' : token
      },
    })
    .then((response) => {
      if(response.status === 200) {
          console.log('unliked')
         // this.setState ({isLikedReview: false});
        //return response.json()
      }else if(response.status === 404) {
        throw 'not found';
      }
        else if(response.status === 401) {
        throw 'unautorised';
      }
      else if(response.status === 403) {
        throw 'unautorised';
      }
      else if(response.status === 500) {
        throw 'server error';
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



    
    checkFav = async ()=>{
      let token = await AsyncStorage.getItem('@session_token');
        return fetch('http://10.0.2.2:3333/api/1.0.0/find?search_in=favourite', {
          method: 'get',
          headers: {
            
            'x-authorization' : token
          }
        })
        .then((response) => {
          if(response.status === 200) {
            
            console.log("checking the list for fav ")
            return response.json();
          }
          else if(response.status === 401) {
            throw 'Unauthorised';
          }
          else if(response.status === 400) {
            throw 'bad request';
          }
           else if(response.status === 500) {
              throw 'sevrer error';
           }

          
          else{
            throw 'Somthing went wrong';
          }
        })  
  
        .then(async (responseJson) => {
            let status = false;
          for(let i = 0; i<responseJson.length;i++)
          {
            if(responseJson[i].location_id === this.state.userData.location_id)
            {
            
              status = true;
            }
          }
          this.setState({isLikedLocation: status});
         
        })
        
        .catch((error) => {
          console.log(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        })
      }

      
    handleMyFav = async ()=>{
      
       if(this.state.isLikedLocation){
        this.RmvfromFav();
        this.setState({"isLikedLocation": false});
      }
      else{
        this.addToFavouriate();
        this.setState({"isLikedLocation": true});
      }
    }

    
    handleLikedReviews = async (loc , rev)=>{
      
      if(this.checkLikedReview(rev)){
       this.unLikeReview(loc , rev);
      
      // this.setState({"isLikedReview": false});
       
     }
     else{
       this.likeReview(loc , rev);
       
      // this.setState({"isLikedLocation": true});
     }
     this.fetchLikedReview();
   }

 
    logData= () => {
        console.log(this.state.userData.location_reviews.overall_rating);
    }



    fetchLikedReview =  async () => {
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
          
          isLikedReview : responseJson.liked_reviews
        });


        

      })
      .catch((error) => {
        console.log(error);
      })
    }


    checkLikedReview= (rev  ) =>{
      for(let i =0 ; i< this.state.isLikedReview.length;i++){
        if(this.state.isLikedReview[i].review.review_id === rev){
          console.log("review is liked already")
          return true;
        }
      }
      console.log("not founddd");
      return false;

    }
   
      
   componentDidMount() {
    //this.logData();
    this.getData();
    this.fetchLikedReview();
    
 
   
   console.log(this.state.isLikedLocation);
  }

  onRefresh = () => {
    this.getData();

   // console.log("deleting refreshing")
  }

 

  render() {
    const navigator = this.props.navigation;
     // console.log('get data rendering');
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
                onPress={() => this.handleMyFav()}>
                <Text >{this.state.isLikedLocation === true? "♥" : "♡"}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigator.navigate('add_review',{location_id: this.state.userData.location_id})  }>
                <Text >add review</Text>
                </TouchableOpacity>
                </View>
            
            <View  >

         
              <View style= {styles.fixToText}>
                  <Text  >{this.state.userData.location_name  } </Text>
                  <Text>{this.state.userData.location_town} </Text><Text>Average Rating: { this.state.userData.avg_overall_rating }</Text> 
              </View>
            </View> 

        

            
            
            <FlatList
                 refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                data={this.state.userData.location_reviews}
                renderItem={({item})=>(
                    
               <View style = {styles.fields}>
                  <View style={styles.fixToText}>
                      <Text>overall rating: </Text>
                      <AirbnbRating
                      size ={15}
                      defaultRating ={item.overall_rating}
                      isDisabled 
                      />
                      <Text>price rating:</Text>
                      <AirbnbRating
                      size ={15}
                      
                      defaultRating = { item.price_rating}
                      isDisabled
                      />
                  </View>
               <View style={styles.fixToText}> 
                  <Text>cleanliness rating: </Text>
                  <AirbnbRating
                  size ={15}
                    defaultRating ={item.clenliness_rating}
                    isDisabled
                  />
                  <Text>quality rating: </Text>
                  <AirbnbRating
                  size ={15}
                  defaultRating = {item.quality_rating}
                  isDisabled
                  
                  />
               </View> 
                     <Text style={styles.centeredTxt} >{ item.review_body}</Text>
                     <Text style={styles.centeredTxt} >{ item.likes}</Text>
                     <TouchableOpacity
                

                      style={styles.buttonStyle}
                      onPress={() => this.handleLikedReviews(this.state.userData.location_id ,item.review_id) }>
                        
                      <Text > {this.checkLikedReview(item.review_id) === true? "♥" : "♡" } </Text>
                      </TouchableOpacity>
                    </View>
                    )}
                    keyExtractor= {(item)=> item.review_id.toString()}
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
    

  }
  ,
      fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
  textStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#BA4A00',
    fontWeight: '600',
    paddingTop: 6,
    paddingBottom: 6
  },
  textHeader: {
    fontSize: 15,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    color: '#171919',
    fontWeight: '600',

    paddingBottom: 6
  },

  cancelText: {
    fontSize: 22,
    alignSelf: 'center',
    color: 'red',
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  centeredTxt:{
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 18
  } ,

  buttonStyle: {
    alignSelf: 'center',
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
  imageStyle: {
    
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
   // alignItems: 'stretch',
    height: 160,
    width: 180,
    borderRadius: 300/15,
    
   
  },

})


export default LocatinInfo;
