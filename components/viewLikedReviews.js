import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator
    , Text,RefreshControl, View,
     TextInput, Alert, ToastAndroid, ScrollView,
      FlatList , SafeAreaView, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';

class ViewLikedReviews extends React.Component {
   
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
      console.log('got data successfully');
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
    //this.onRefresh();
    }

  

    onRefresh = () => {
        this.getData();
        console.log("deleting refreshing")
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
            this.setState ({isLikedReview: false});
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
              <Text style= {styles.headLine}>My Liked Reviews</Text>
                  
              <FlatList
               refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}      />   }

                data={this.state.userData.liked_reviews}
                 renderItem={({item})=>(
                     
                    <View style = {styles.fields}>
                      <Text style = {styles.centeredTxt}> {item.location.location_name  }, {item.location.location_town  }</Text>
                      
                      <Image
                        style = {styles.imageStyle}
                        source={item.location.photo_path ? {uri: item.location.photo_path } : null}
                        />
                       
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
                   
                       
                        
                        
                        <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() => this.unLikeReview(item.location.location_id , item.review.review_id) + this.onRefresh()}>
                            
                        <Text >Unlike ♥ </Text>
                        </TouchableOpacity>
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
      textAdjust:{
        marginBottom: 20,
        
        
        //marginTop: 10
      },
      title: {
        textAlign: 'center',
        marginVertical: 8,
      },
      centeredTxt:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        fontSize: 16,
        marginBottom: 20,
        marginTop: 10
      } ,
      fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        
        
      },
    
      txtInitials:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#0B92F2',
        fontSize: 20
    } ,
    headLine:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 18,
        paddingBottom: 20
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
      separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      

})


export default  ViewLikedReviews ;
