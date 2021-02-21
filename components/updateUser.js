import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, View, TextInput, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  getData =  async () => {
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
        console.log(responseJson);
        
        this.setState({'first_name': responseJson.first_name});
        this.setState({'last_name': responseJson.last_name});
        this.setState({'email': responseJson.email});
        

      })
      .catch((error) => {
        console.log(error);
      })
    }

    updateUser =  async () => {
     
        let id = await  AsyncStorage.getItem('@user_id');
        let token = await  AsyncStorage.getItem('@session_token');

        if(this.state.first_name === '' || this.state.last_name === '' || this.state.email === ''){
            ToastAndroid.show("fields cant be blank", ToastAndroid.show);
        }

        else{
        return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+id, {
            method: 'patch',
            headers: {
              'Content-Type': 'application/json',
              'x-authorization' : token
      
            },
            body: JSON.stringify(this.state)
          })
          .then((response) => {
            if(response.status === 200) {
             // return response.json()
             ToastAndroid.show("User Updated", ToastAndroid.show);
             console.log('updated')

            }else{
              throw 'Somthing went wrong';
            }
            
          })
          
          .catch((error) => {
            console.log(error, "error catch");
            ToastAndroid.show(error, ToastAndroid.SHORT);
          })
        }
        }

  Cancel = () => {
    this.props.navigation.navigate('home');
  }

  componentDidMount() {

    this.getData();
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
      <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
        <Text style={styles.textStyle} >Update user info</Text>
        <TextInput style={styles.fields} placeholder="First name" onChangeText={this.handleFirstName} value={this.state.first_name} />
        <TextInput style={styles.fields} placeholder="Last Name" onChangeText={this.handleLastName} value={this.state.last_name} />
        <TextInput style={styles.fields} placeholder="Email" onChangeText={this.handleEmail} value={this.state.email} />
        <TextInput style={styles.fields} placeholder="Password" onChangeText={this.handlePass} value={this.state.UserInfo.password} secureTextEntry />
        <TouchableOpacity style={styles.buttonStyle}
          onPress={() => this.updateUser()}>
          <Text style={styles.textStyle}>
            Update
      </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelStyle}
          onPress={() => this.Cancel()}>
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>
        


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

  },
  textStyle: {
    fontSize: 22,
    alignSelf: 'center',
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

})


export default Update;
