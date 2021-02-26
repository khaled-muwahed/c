import 'react-native-gesture-handler';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';
import styles from '../Styling/stylingSheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {

  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert
  ,
  Image,

  View,
} from 'react-native';





class Home extends React.Component {
  constructor(props) {

    super(props);
    this.state = {

      refreshing: false,
      setRefreshing: false,

      isLoading: true,

      locations: null,

      pageCount: '',
      pageNum: 0,
      initialNum: 100
    };

  }
// getting locations information and storing the items count in a state, i set the default limit to 100, so i can do pagination
  retrieveAllLocations = async () => {

    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find?limit=' + this.state.initialNum, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw 'bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        }
        else if (response.status === 500) {
          throw 'server error';
        } else {
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {
        this.setState({
          pageCount: responseJson.length,
        });
      })
      .catch((error) => {
        console.log(error);
      })

  }


//this function for displaying locations, i implemented pagination and displaying 5 items per page
  displayCoffeeShops = async (page) => {
    //changing the states whenver user changes the page, so i can store page num
    this.setState({
      pageNum: page
    })
    let pageOffset = page * 5;
    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find?offset=' + pageOffset + '&limit=' + 5, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {
        this.setState({
          isLoading: false,
          locations: responseJson
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }
//alerting user before logging out
  signOutAlert = () => {
    Alert.alert(
      'Signing Out',
      'Are you sure you want to logout?',
      [
        {
          text: 'Stay logged in',
          style: 'cancel'
        },
        {
          text: 'Leave',
          onPress: () => this.signOut(),
        },
      ],
      { cancelable: false },
    );
  };


  signOut = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method: 'post',
      headers: {
        'x-authorization': token
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.clear();
          this.props.navigation.navigate('login');
        } else if (response.status === 401) {
          throw 'unauthorised';
        }
        else if (response.status === 500) {
          throw 'server error';
        } else {
          throw 'Somthing went wrong';
        }
      })

  }
// calling these 2 functions when the page open, so i can store items count and display locations with pagination
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.retrieveAllLocations();
      this.displayCoffeeShops(this.state.pageNum);
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }






//updating info and staying in the same page when refreshing
  onRefresh = () => {
    this.retrieveAllLocations();
    this.displayCoffeeShops(this.state.pageNum);

  }

// the following 2 functions are used for my pagination, multiplying results count by five so i display 5 items a page
//caling search function to retrive a different page whenever user clicks next or previous
  nextPage = (page) => {
    if (this.state.pageNum * 5 < this.state.pageCount - 5) {
      this.displayCoffeeShops(page)
      this.setState({ pageNum: page })

    }

  }

  perviousPage = (page) => {
    if (this.state.pageNum > 0) {
      this.displayCoffeeShops(page)
      this.setState({ pageNum: page })

    }

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




        <View style={styles.container}>

          <View style={styles.fixToText}>

            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => { this.perviousPage(this.state.pageNum - 1) }}>

              {this.state.pageNum === 0 ? <Text ></Text> : <Ionicons name={"chevron-back-sharp"} size={23} />}

            </TouchableOpacity>


            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.signOutAlert()}
            >
              <Text style={styles.formTouchText}>logout <Ionicons name={"log-out-outline"} size={25} /></Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.formTouch}
              onPress={() => { this.nextPage(this.state.pageNum + 1) }}>

              {this.state.pageNum * 5 < this.state.pageCount - 5 ? <Ionicons name={"chevron-forward-sharp"} size={23} /> : <Text></Text>}

            </TouchableOpacity>

          </View>



          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            style={styles.fields}
            data={this.state.locations}
            renderItem={({ item }) => (


              <View style={styles.fields}>

                < Text style={styles.clickable} onPress={() => navigator.navigate('LocatinInfo', { location_id: item.location_id })}>
                  {item.location_name}</Text>

                <Text>Location: {item.location_town}</Text>
                <Text >Average overall Rating: </Text>

                <AirbnbRating

                  size={15}
                  defaultRating={item.avg_overall_rating}
                  isDisabled
                />
                <Text></Text>
                <Image
                  style={styles.imageStyle}

                  source={item.photo_path ? { uri: item.photo_path } : null + Date.now()} />

                <Text>{ }</Text>
              </View>
            )}
            keyExtractor={(item) => item.location_id.toString()}
          />






        </View>


      )
    }

  }
}


export default Home;


