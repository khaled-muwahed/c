import * as React from 'react';
//import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator, Text, View, RefreshControl, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';
import styles from '../Styling/stylingSheet';
class getUser extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      refreshing: false,
      setRefreshing: false,

      isLoading: true,
      userData: null

    };

  }

  getData = async () => {
    console.log('we are in user details');
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
        this.setState({
          isLoading: false,
          userData: responseJson
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }





  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }



  onRefresh = () => {
    this.getData();
  }


  // I made all the lists through out my app refreshable when ever the user pulls down

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
        <View style={{ flex: 1 }}>

          <View style={styles.fixToText}>
            <Text style={styles.txtInitials}>Name: {this.state.userData.first_name + " " + this.state.userData.last_name}</Text>
            <Text style={styles.txtInitials}>,Email: {this.state.userData.email}</Text>
          </View>


          <View style={styles.fixToText}>
            <TouchableOpacity style={styles.buttonStyle}
              onPress={() => navigator.navigate('ViewReviews')}>
              <Text >View my Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}
              onPress={() => navigator.navigate('ViewLikedReviews')}>
              <Text >View Liked Reviews</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headLine}>My favourite locations</Text>

          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            showsVerticalScrollIndicator

            data={this.state.userData.favourite_locations}
            renderItem={({ item }) => (
              <View style={styles.fields}>
                <View >
                  <Text style={styles.clickable} onPress={() => navigator.navigate('LocatinInfo', { location_id: item.location_id })}>{item.location_name
                  }</Text>
                </View>
                <Text>Location: {item.location_town}</Text>



                <View style={styles.RatingStyle}>
                  <Text>Overall Rating: {item.avg_price_rating}</Text>
                  <AirbnbRating
                    size={10}

                    defaultRating={item.avg_price_rating}
                    isDisabled

                  />
                </View>

              </View>

            )}
            keyExtractor={(item) => item.location_id.toString()}
          />
        </View>



      );
    }

  }
}




export default getUser;
