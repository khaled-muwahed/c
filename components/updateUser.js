import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator, Text, View, TextInput, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styling/stylingSheet';


class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      UserInfo: '',
    };

  }
 //Theses functions handle user details textinput and is called everytime the data is changed
  handleFirstName = (text) => {
    this.setState({
      first_name: text,
      UserInfo: { ...this.state.UserInfo, first_name: text }
    })
  }

  handleLastName = (text) => {
    this.setState({
      last_name: text,
      UserInfo: { ...this.state.UserInfo, last_name: text }
    })
  }

  handleEmail = (text) => {
    this.setState({
      email: text,
      UserInfo: { ...this.state.UserInfo, email: text }
    })
  }

  handlePass = (text) => {
    this.setState({
      password: text,
      UserInfo: { ...this.state.UserInfo, password: text }
    })
  }
//getting user details
  getData = async () => {
    let id = await AsyncStorage.getItem('@user_id');
    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        }
        else if (response.json.status === 401) {
          throw 'Unauthorised';
        }
        else if (response.json.status === 404) {
          throw 'Not Found';
        }
        else if (response.json.status === 500) {
          throw 'Server error';
        }
        else {
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {
        this.setState({ 'first_name': responseJson.first_name });
        this.setState({ 'last_name': responseJson.last_name });
        this.setState({ 'email': responseJson.email });

      })
      .catch((error) => {
        console.log(error);
      })
  }
// alerting user before making changes
  updateAlert = () => {
    Alert.alert(
      'Save changes',
      'Are you sure you want to save changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => this.updateUser(),
        },
      ],
      { cancelable: false },
    );
  };

  updateUser = async () => {

    let id = await AsyncStorage.getItem('@user_id');
    let token = await AsyncStorage.getItem('@session_token');

    if (this.state.first_name === '' || this.state.last_name === '' || this.state.email === '') {
      ToastAndroid.show("fields cant be blank", ToastAndroid.show);
    }

    else {
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
        method: 'patch',
        headers: {
          'Content-Type': 'application/json',
          'x-authorization': token

        },
        body: JSON.stringify(this.state)
      })
        .then((response) => {
          if (response.status === 200) {
            ToastAndroid.show("User Updated", ToastAndroid.show);
          } else {
            throw 'Somthing went wrong';
          }

        })

        .catch((error) => {
          console.log(error, "error catch");
          ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
  }




  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }






  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>

      )
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.textStyle} >Update user info</Text>
          <TextInput style={styles.fields} placeholder="First name" onChangeText={this.handleFirstName} value={this.state.first_name} />
          <TextInput style={styles.fields} placeholder="Last Name" onChangeText={this.handleLastName} value={this.state.last_name} />
          <TextInput style={styles.fields} placeholder="Email" onChangeText={this.handleEmail} value={this.state.email} />
          <TextInput style={styles.fields} placeholder="Password" onChangeText={this.handlePass} value={this.state.UserInfo.password} secureTextEntry />

          <View style={styles.fixToText}>
            <View style={styles.formItem}>
              <TouchableOpacity style={styles.buttonStyle}
                onPress={() => this.updateAlert()}>
                <Text style={styles.formTouchText}>
                  Update
         </Text>
              </TouchableOpacity>
            </View>


          </View>

        </View>
      );
    }
  }
}



export default Update;
