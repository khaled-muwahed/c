import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList
  ,

  View,
  Button,
} from 'react-native'

class Home extends Component {
  constructor(props) {

    super(props);
    this.state = {

      refreshing: false,
      setRefreshing: false,

      isLoading: true,
    
      locations: null,
      
    };

  }
  /*
  static navigationOptions = {
    headerLeft: null
  } */


    displayCoffeeShops = async () => {
      console.log('we are in user details');
    let id = await  AsyncStorage.getItem('@user_id');
    let token = await  AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
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
        this.setState ({
          isLoading: false,
          locations : responseJson
        });

      })
      .catch((error) => {
        console.log(error);
      })
    
    }


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

  SearchUserPge = () => {
    this.props.navigation.navigate('SearchUser');
}



  componentDidMount() {
    this.displayCoffeeShops();
    
    //this.getData();
    }
    /*ComponentWillMount(){
      BackHandler.addEventListener('hardwareBackPress', function() {return true}) 

    } */

    onRefresh = () => {
      this.displayCoffeeShops();
      console.log("redsfsfres")
    }


  

 render() {
    const navigator = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>

      )
    }
    else {
        
    return (

      
    <View> 
      <View style={styles.fixToText}>
        <Button
        title="logout"
        onPress={() => this.signOut()}
        />
        <Button
        title="update account"
        onPress={() =>this.updateUser()}
        />
        <Button
        title="show my details"
        onPress={() =>this.getUserDetails()}
        />
        <Button
        title="search"
        onPress={() =>this.SearchUserPge()}
        />
      </View>
      
      <FlatList  
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                 style = {styles.fields}
                data={this.state.locations}
                renderItem={({item})=>(

                    
                    <View style = {styles.fields}>
                      
                      < Text style = {styles.clickable} onPress={() => navigator.navigate('LocatinInfo',{location_id: item.location_id})  }>
                          {item.location_name}</Text>
                          <Text>Location: {item.location_town}</Text>
                        <Text >overall_rating: { item.avg_overall_rating }</Text>
                        
                        <Text>{}</Text>        
                    </View>
                    )}
                    keyExtractor= {(item)=> item.location_id.toString()}
                />



    </View>

     
    )
  }

}
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
      },
      title: {
        textAlign: 'center',
        marginVertical: 8,
      },
      fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      clickable: {
        fontWeight: "bold",
        fontSize: 25,
        textDecorationLine : "underline"
    
      }
      ,
      fields: {
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginVertical: 15,
        fontSize: 20,
    
      },

})
;


export default Home;