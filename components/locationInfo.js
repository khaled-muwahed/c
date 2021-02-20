import * as React from 'react';

//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View,Image,Use, TextInput, Alert, ToastAndroid, ScrollView, FlatList , SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocatinInfo extends React.Component {
   
  constructor(props) {

    super(props);
   
     /*   location_id: '',
        location_name:'',
        location_town:'',
        latitude:'',
        longitude:'',
        photo_path:'',
        avg_overall_rating:'',
        avg_price_rating:'',
        avg_quality_rating:'',
        avg_clenliness_rating:'',
        location_reviews:[],*/
        this.state = {

          isLoading: true,
          userData: null,
          clicked_location_id: this.props.route.params.location_id
        };
     
  

  }

  getData =  async () => {
      console.log('we are in coffee details');
    let id = await  AsyncStorage.getItem('@user_id');
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
        
      /*  this.setState({'location_id': responseJson.location_id});
        this.setState({'location_name': responseJson.location_name});
        this.setState({'location_town': responseJson.location_town});
        this.setState({'latitude' : responseJson.latitude});
        this.setState({'longitude' : responseJson.longitude});
        this.setState({'photo_path' : responseJson.photo_path});
        this.setState({'avg_overall_rating' : responseJson.avg_overall_rating});
        this.setState({'avg_clenliness_rating' : responseJson.avg_clenliness_rating});
        this.setState({'avg_quality_rating' : responseJson.avg_quality_rating});
        this.setState({'location_reviews' : responseJson.location_reviews});*/

       // console.log(this.state);


        
        

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
          console.log('success');
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
             console.log('success');
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

 
    logData= () => {
        console.log('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.clicked_location_id);
    }
   
      
  componentDidMount() {
    //this.logData();
   this.getData();
  }

  render() {
    const navigator = this.props.navigation;
     // console.log('get data rendering');
    if (this.state.isLoading) {
      return (
        <View>
           <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )
    }
    return (
        <View style={{flex:1 }}>
            
                <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => this.addToFavouriate()}>
                <Text >like</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => this.RmvfromFav()}>
                <Text >remove from my fav</Text>
                </TouchableOpacity>

                
                <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigator.navigate('add_review',{location_id: this.state.userData.location_id})  }>
                <Text >add review</Text>
                </TouchableOpacity>

            
            <View  >
            
            <Text  > Name: {this.state.userData.location_name  }, Town: {this.state.userData.location_town}, Rating: { this.state.userData.avg_overall_rating } </Text>
                 
            </View> 

          
            
            <View>
            <Image
            style = {styles.imageStyle}
            source={this.state.userData.photo_path ? {uri: this.state.userData.photo_path } : null}
            />
            </View>

            
            
                <FlatList
                data={this.state.userData.location_reviews}
                renderItem={({item})=>(
                    
                    <View style = {styles.fields}>
                        <Text >{"overall_rating: " + item.overall_rating
                        }</Text>
                        <Text >{"review_body: " + item.review_body}</Text>
                        <Text>{}</Text>        
                    </View>
                    )}
                    keyExtractor= {(item)=> item.review_id.toString()}
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
    alignSelf: 'flex-start',
    color: '#007aff',
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
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
