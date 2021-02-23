import React, { Component } from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  ScrollView,
  Button,
  ToastAndroid,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import styles from '../../Styling/stylingSheet';
class Sign_Up extends Component {
  constructor(props) {
    super(props);

    this.state = {
     
    }
  }

  signUp = () => {
    if(this.state.first_name === '' || this.state.last_name === '' || this.state.email === '' || this.state.password === ''){
        ToastAndroid.show("fields cant be blank", ToastAndroid.show);
    }
    else{
    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if(response.status === 201) {
          
        return response.json()
      }else if(response.json.status === 400) {
        throw 'Failed validation';
      }else{
        throw 'Somthing went wrong';
      }
    })
    .then(async (responseJson) => {
      console.log("User created with ID: ", responseJson);
      ToastAndroid.show("Account Created", ToastAndroid.SHORT);
      this.props.navigation.navigate('login')
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
    }
  }

  render() {
    
    return (
      <View>
          <Text style={styles.title}>Create an account</Text>
       </View>
    );
  }
}



export default Sign_Up;