import React, { Component } from 'react';
import {
  ScrollView,
  ToastAndroid,
  Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import styles from '../Styling/stylingSheet';


class Sign_Up extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      Last_name: '',
      email: '',
      password: '',
    }
  }



  signUp = () => {
    //Client side user validation if user leaves any of the required feilds empty, they will get an error
    if (this.state.first_name === '' || this.state.last_name === '' || this.state.email === '' || this.state.password === '') {
      ToastAndroid.show("fields cant be blank", ToastAndroid.show);
    }
    else {
      return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then((response) => {
          if (response.status === 201) {

            return response.json()
          } else if (response.json.status === 400) {
            throw 'Bad Request';
          }
          else if (response.json.status === 500) {
            throw 'server error';
          } else {
            throw 'Somthing went wrong';
          }
        })
        .then(async (responseJson) => {
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
        <ScrollView>
          <Text style={styles.titleStyle}>Create an account</Text>




          <View style={styles.formItem}>
            <Text style={styles.formLabel}>First Name:</Text>
            <TextInput
              placeholder="Enter first name..."
              style={styles.formInput}
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Last Name:</Text>
            <TextInput
              placeholder="Enter last name..."
              style={styles.formInput}
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              placeholder="Enter an email..."
              style={styles.formInput}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
              placeholder="Enter password..."
              style={styles.formInput}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />
          </View>

          <View style={styles.formItem}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.signUp()}>
              <Text style={styles.formTouchText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Sign_Up;