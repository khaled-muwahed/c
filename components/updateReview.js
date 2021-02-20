import React, { Component } from 'react';
import {
  ScrollView,
  Button,
  ToastAndroid,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class update_review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overall_rating: '',
      price_rating: '',
      quality_rating: '',
      clenliness_rating: '',
      review_body:'',
      clicked_location_id: this.props.route.params.location_id,
      clicked_review_id: this.props.route.params.review_id
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
        overall_rating: parseInt( this.state.overall_rating),
        price_rating: parseInt( this.state.price_rating),
        quality_rating: parseInt( this.state.quality_rating),
        clenliness_rating: parseInt( this.state.clenliness_rating),
        review_body: this.state.review_body
      
      })
    })
    .then((response) => {
      if(response.status === 200) {
          console.log('Review Updated')
          ToastAndroid.show("review Updated", ToastAndroid.show);
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

componentDidMount() {

    //
    }

  render() {
    
    return (
      <View>
        <ScrollView>
          <Text style={styles.title}>update review</Text>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>overall_rating:</Text>
            <TextInput
              placeholder="Enter overall_rating.."
              style={styles.formInput}
              keyboardType = 'number-pad'
              onChangeText={(overall_rating) =>
                 this.setState({overall_rating} )}
              value={parseInt( this.state.overall_rating)}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>price_rating :</Text>
            <TextInput
              placeholder="Enter price_rating..."
              style={styles.formInput}
              keyboardType = 'number-pad'
              onChangeText={(price_rating) => this.setState({price_rating})}
              value={parseInt( this.state.price_rating)}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>quality_rating:</Text>
            <TextInput
              placeholder="Enter quality_rating..."
              style={styles.formInput}
              keyboardType = 'number-pad'
              onChangeText={(quality_rating) => this.setState({quality_rating})}
              value={parseInt( this.state.quality_rating)}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>clenliness_rating:</Text>
            <TextInput
              placeholder="Enter clenliness_rating..."
              style={styles.formInput}
              keyboardType = 'number-pad'
              onChangeText={(clenliness_rating) => this.setState({clenliness_rating})}
              value={parseInt( this.state.clenliness_rating)}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>review_body:</Text>
            <TextInput
              placeholder="Enter review_body..."
              style={styles.formInput}
              keyboardType = 'number-pad'
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