import React, { Component } from 'react';
import {
  ScrollView,
  Button,
  ToastAndroid,
  
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';

class update_review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      review_body:'',
      clicked_location_id: this.props.route.params.location_id,
      clicked_review_id: this.props.route.params.review_id,
      
    }
  }

  updateReview = async () => {
    if(this.state.overall_rating === '' || this.state.price_rating === '' || this.state.quality_rating === '' || this.state.clenliness_rating === '' || this.state.review_body === ''){
        ToastAndroid.show("fields cant be blank", ToastAndroid.show);
    }
    else{
        let token = await  AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ this.state.clicked_location_id +"/review/"+this.state.clicked_review_id, {
      method: 'patch',
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
      if(response.status === 200) {
          console.log('Review Updated')
          //ToastAndroid.show("review Updated", ToastAndroid.show);
          this.props.navigation.navigate('ViewReviews');
     
      }else if(response.status === 400) {
        throw 'Bad req';
      }
        else if(response.status === 401) {
        throw 'unautorised';
      }
      else{
        throw 'Somthing went wrongggggggg';
      }
    })
   
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
    }
  }


  






  logData= () => {
    console.log("http://10.0.2.2:3333/api/1.0.0/location/"+ this.state.clicked_location_id +"/review/"+this.state.clicked_review_id);
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



componentDidMount() {

    //
    }

  render() {
      
 

      
    
    return (
      <View>
        <ScrollView>
          <Text style={styles.title}>update review</Text>

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

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => this.updateReview()}>
              <Text style={styles.formTouchText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  fixToText: {
    textAlign: 'center',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
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
});

export default update_review;