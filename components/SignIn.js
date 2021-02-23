import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styling/stylingSheet';


import React, { Component } from 'react';
import {
  ScrollView,
  Button,
  ToastAndroid,
  StyleSheet, Text,
  TextInput, ImageBackground,
  TouchableOpacity, View
} from 'react-native';
const image = { uri: "https://ucarecdn.com/827ee316-742d-4b4c-8411-ae9f7d3a4052/coffidaa.jpeg" };


class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: '',
        token: ''
        
    }
  }


  getData = async () => {
    try {
      const Value = await AsyncStorage.getItem('token')
      console.log("getdata" + Value)
      if (Value !== null) {
        this.setState({
          token: Value
        });
      }
    } catch (e) {
    }
  }

  signIn = () => {
    if( this.state.email === '' || this.state.password === ''){
      ToastAndroid.show("fields cant be blank", ToastAndroid.show);
  }
  else{
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if(response.status === 200) {
        return response.json()
      }else if(response.status === 400) {
        throw 'Email or Password Wrong';
      }else{
        throw 'Somthing went wrong';
      }
    })
    .then(async (responseJson) => {
      console.log( responseJson);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      await AsyncStorage.setItem('@user_id', JSON.stringify(responseJson.id));
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      this.props.navigation.navigate('home');
      
    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }
  }


  

  

  render() {
    const navigator = this.props.navigation;
    return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.titleStyle}>Log In</Text>

        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Email:</Text>
          <TextInput
            placeholder="Enter an email..."
            style={styles.formInput}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
        </View>

        <View style={styles.formItem}>
        <Text style={styles.formLabel}>Password:</Text>
        <TextInput
        
          placeholder="Enter password..."
          style={styles.formInput}
          secureTextEntry
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
        </View>
        
          <View style = {styles.formItem}> 
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.signIn()}>
              <Text style={styles.formTouchText}>Sign In</Text>
            </TouchableOpacity>
            
          
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigator.navigate('signup')}>
                <Text style={styles.formTouchText}>Go to sign up</Text>
              </TouchableOpacity>
              
        </View>
      
       </ImageBackground>
    </View>
    );
  }
}


export default SignIn;