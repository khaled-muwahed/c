import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'

class Home extends Component {
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();

        });
    }

    componentWillUnmount() {
    
        this.checkLoggedIn;
    }

    checkLoggedIn = async () => {

        const value = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@user_id');
        console.log(value, userID);
        if (value == null) {
            this.props.navigation.navigate('LoginScreen');
        }
    };


  signOut = async () => {
    let value = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method: 'post',
      headers: {
        //'Content-Type': 'application/json'
        'x-authorization': value
      },

    })
    .then( async(response) => {
      if(response.status === 200) {
        await AsyncStorage.clear();
        this.props.navigation.navigate('login');
  

      }else if(response.status === 401) {
        throw 'unauthorised';
      }else{
        throw 'Somthing went wrong';
      }
    })
    
  }
  getUserDetails = () => {
    this.props.navigation.navigate('getUser');
  }

  updateUser = () => {
      this.props.navigation.navigate('Update');
  }
  

 render() {
    //const navigator = this.props.navigation;
        
    return (
      <View style={styles.container}>
        <TouchableOpacity
         style={styles.button}
         onPress={this.signOut}
        >
         <Text>logout</Text>
        </TouchableOpacity>
        <View>

        <TouchableOpacity
         style={styles.button}
         onPress={this.updateUser}
        >
         <Text>go to update page</Text>
        </TouchableOpacity>
        
  
        </View>
        


        <View>

        <TouchableOpacity
         style={styles.button}
         onPress={this.getUserDetails}
        >
         <Text>show your details</Text>
        </TouchableOpacity>
        
  
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 12,
    marginBottom: 8
  }
})

export default Home;