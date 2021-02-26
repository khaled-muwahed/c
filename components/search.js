import React, { Component } from 'react';
import { AirbnbRating } from 'react-native-ratings';
import {
  FlatList
  , RefreshControl,
  ToastAndroid,
  Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import styles from '../Styling/stylingSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      setRefreshing: false,
      isLoading: true,
      q: '',
      locations: null,
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      pageCount: 0,
      pageNum: 0,
      initialNum: 100
    };
  }

  search = async (url) => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch(url, {
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

  searchUrl = (page) => {
    let url = 'http://10.0.2.2:3333/api/1.0.0/find?'
    if (this.state.q != '') {
      url += "q=" + this.state.q + "&";
    }
    if (this.state.overall_rating > 0) {
      url += "overall_rating=" + this.state.overall_rating + "&";
    }

    if (this.state.clenliness_rating > 0) {
      url += "clenliness_rating=" + this.state.clenliness_rating + "&";
    }
    if (this.state.price_rating > 0) {
      url += "price_rating=" + this.state.price_rating + "&";
    }
    if (this.state.quality_rating > 0) {
      url += "quality_rating=" + this.state.quality_rating + "&";
    }
    this.getLocationsCount(url);
    this.setState({ pageNum: page });
    let offset = page * 5;
    url += 'offset=' + offset + '&limit=' + 5;
    this.search(url);
  }





  ratingDone(rating, name) {
    let stateObj = () => {
      let returnObj = {};
      returnObj[name] = rating;
      return returnObj;
    };
    this.setState(stateObj);

  }

  getLocationsCount = async (url) => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch(url + "&limit=" + this.state.initialNum, {
      method: 'get',
      headers: {
        'x-authorization': token
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Unauthorised';
        } else if (response.status === 401) {
          throw 'bad request';
        }
        else if (response.status === 500) {
          throw 'server error';
        } else {
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {

        this.setState({ pageCount: responseJson.length })

      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
  }



  onRefresh = () => {
    this.searchUrl(this.state.pageNum);
  }

  nextPage = (page) => {
    if (this.state.pageNum * 5 < this.state.pageCount - 5) {
      this.searchUrl(page)
      this.setState({ pageNum: page })

    }

  }

  perviousPage = (page) => {
    if (this.state.pageNum > 0) {
      this.searchUrl(page)
      this.setState({ pageNum: page })
    }

  }


  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        locations: null
        , pageCount: 0,
        pageNum: 0,
      })
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }




  render() {
    const navigator = this.props.navigation;


    return (
      <View style={styles.container}>


        <TextInput
          placeholder="Enter an a word to search for..."
          style={styles.formInput}
          onChangeText={(q) => this.setState({ q: q }) + this.onRefresh()}
          value={this.state.q}
        />
        <View style={styles.fixToText}>
          <Text>overall rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingDone(rating, "overall_rating") + this.onRefresh()}
          />
          <Text>price rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingDone(rating, "price_rating") + this.onRefresh()}
          />
        </View>
        <View style={styles.fixToText}>
          <Text>cleanliness rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingDone(rating, "clenliness_rating") + this.onRefresh()}
          />
          <Text>quality rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingDone(rating, "quality_rating") + this.onRefresh()}
          />
        </View>
        <View style={styles.fixToText}>
          <TouchableOpacity
            style={styles.formTouch}
            onPress={() => { this.perviousPage(this.state.pageNum - 1) }}>

            {this.state.pageNum === 0 ? <Text ></Text> : <Ionicons name={"chevron-back-sharp"} size={23} />}

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.searchUrl(0)}
          >
            <Text style={styles.formTouchText}>Search</Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={styles.formTouch}
            onPress={() => { this.nextPage(this.state.pageNum + 1) }}>

            {this.state.pageNum * 5 < this.state.pageCount - 5 ? <Ionicons name={"chevron-forward-sharp"} size={23} /> : <Text></Text>}

          </TouchableOpacity>





        </View>


        <FlatList
          // style = {{height:'5%'}}
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
                {"Name: " + item.location_name}</Text>
              <Text >overall_rating: {item.avg_overall_rating
              }</Text>
              <Text >Price Rating: {item.avg_overall_rating
              }</Text>

              <Text>{ }</Text>
            </View>
          )}
          keyExtractor={(item) => item.location_id.toString()}
        />










      </View>
    );
  }
}

export default SearchUser;