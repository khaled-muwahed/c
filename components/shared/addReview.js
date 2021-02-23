import React, { Component } from 'react';
import { Rating, AirbnbRating } from 'react-native-ratings';
import {
  ScrollView,
  Button,
  ToastAndroid,
  StyleSheet, Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../Styling/stylingSheet';

class add_review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      review_body:'',
      clicked_location_id: this.props.route.params.location_id
    }
  }

  submitReview = async () => {
    if(this.state.overall_rating === '' || this.state.price_rating === '' || this.state.quality_rating === '' || this.state.clenliness_rating === '' || this.state.review_body === ''){
        ToastAndroid.show("fields cant be blank", ToastAndroid.show);
    }
    else{
        let token = await  AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ this.state.clicked_location_id +"/review", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization' : token
      },
      body: JSON.stringify({
      

        overall_rating:  this.state.overall_rating,
        price_rating:  this.state.price_rating,
        quality_rating: this.state.quality_rating,
        clenliness_rating: this.state.clenliness_rating,
        review_body: this.state.review_body
      
      })
    })
    
    .then((response) => {
      if(response.status === 201) {
        this.props.navigation.navigate('LocatinInfo');
       
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
  }
        logData= () => {
            console.log(this.state.overall_rating);
        }
        logTxt= () => {
            console.log(this.state.review_body);
        }

    ratingDone   (rating , name) {
        let stateObj = () => {
            let returnObj = {};
            returnObj[name] = rating;
            return returnObj;
        };
        this.setState (stateObj);

    }

  render() {
    if (this.state.isLoading) {
        return (
          <View>
          <ActivityIndicator size="large" color="#0000ff" />
          </View>
  
        )
      }

      else{

      
    
    return (
      <View>
        <ScrollView>
          <Text style={styles.title}>add review</Text>

          <View style={styles.fixToText}>
            <Text>overall rating</Text>
            <AirbnbRating
            size ={15}
            count = {5}
            defaultRating = {0}
            onFinishRating = {(rating) => this.ratingDone(rating , "overall_rating")}
            />
            <Text>price rating</Text>
            <AirbnbRating
            size ={15}
            count = {5}
            defaultRating = {0}
            onFinishRating = {(rating) => this.ratingDone(rating , "price_rating") }
            />
            </View>
            <View style={styles.fixToText}> 
            <Text>cleanliness rating</Text>
            <AirbnbRating
            size ={15}
            count= {5}
            defaultRating = {0}
            onFinishRating = {(rating) => this.ratingDone(rating , "clenliness_rating")}
            />
            <Text>quality rating</Text>
            <AirbnbRating
            size ={15}
            count= {5}
            defaultRating = {0}
            onFinishRating = {(rating) => this.ratingDone(rating , "quality_rating") }
            />
            </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>review_body:</Text>
            <TextInput
              placeholder="Enter review_body..."
              style={styles.formInput}
              onChangeText={(review_body) => 
                 this.setState({review_body})}
            
              value={this.state.review_body}
            />
          </View>

          <View style={styles.fixToText}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.submitReview()}>
              <Text style={styles.formTouchText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
}

export default add_review;