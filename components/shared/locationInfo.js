import * as React from 'react';
import { AirbnbRating } from 'react-native-ratings';
import styles from '../../Styling/stylingSheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, ActivityIndicator, Text, View, Image, RefreshControl, ToastAndroid, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocatinInfo extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      refreshing: false,
      setRefreshing: false,
      isDisabled: false,
      isLoading: true,
      isLikedLocation: false,
      isLikedReview: [],
      reviews: [],
      likes: 0,
      user_id: '',
      userData: null,
      clicked_location_id: this.props.route.params.location_id,
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,

    };
  }

  getData = async () => {

    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.clicked_location_id, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          this.checkFav();
          return response.json()
        }
        else if (response.json.status === 404) {
          throw 'Not Found';
        }
        else if (response.json.status === 500) {
          throw 'server error';
        }
        else {
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {

        this.setState({
          isLoading: false,
          userData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }



  addToFavouriate = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.clicked_location_id + '/favourite', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show("added to favourite", ToastAndroid.show);
        } else {
          throw 'Somthing went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  RmvfromFav = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.clicked_location_id + '/favourite', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show("Removed from favourite locations", ToastAndroid.show);
        } else {
          throw 'Somthing went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  addReview = () => {
    this.props.navigation.navigate('Update');
  }

  likeReview = async (loc_id, rev_id) => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc_id + "/review/" + rev_id + "/like", {

      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getData();
        } else if (response.status === 400) {
          throw 'Bad req';
        }
        else if (response.status === 401) {
          throw 'unautorised';
        }
        else if (response.status === 500) {
          throw 'server error';
        }
        else {
          throw 'Somthing went wrong';
        }
      })

      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
  }



  unLikeReview = async (loc_id, rev_id) => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc_id + "/review/" + rev_id + "/like", {

      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': token
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getData();

        } else if (response.status === 404) {
          throw 'not found';
        }
        else if (response.status === 401) {
          throw 'unautorised';
        }
        else if (response.status === 403) {
          throw 'unautorised';
        }
        else if (response.status === 500) {
          throw 'server error';
        }
        else {
          throw 'Somthing went wrong';
        }
      })

      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })

  }
//this function checks whether a location is favourite, by getting favourite locations list,
// comparing every location id and highlight a location fav button if already in fav
//then setting a state that stores favourite locations
  checkFav = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find?search_in=favourite', {
      method: 'get',
      headers: {
        'x-authorization': token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        else if (response.status === 401) {
          throw 'Unauthorised';
        }
        else if (response.status === 400) {
          throw 'bad request';
        }
        else if (response.status === 500) {
          throw 'sevrer error';
        }


        else {
          throw 'Somthing went wrong';
        }
      })

      .then(async (responseJson) => {
        let status = false;
        for (let i = 0; i < responseJson.length; i++) {
          if (responseJson[i].location_id === this.state.userData.location_id) {
            status = true;
          }
        }
        this.setState({ isLikedLocation: status });
      })

      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
  }

//this function deal with favourite and unfavourite location by checking the state that i stord fav location
//is location is favourite and the button clicked, it changes the button color and unfavourite that location and vice-verca

  handleMyFav = async () => {

    if (this.state.isLikedLocation) {
      this.RmvfromFav();
      this.setState({ "isLikedLocation": false });
    }
    else {
      this.addToFavouriate();
      this.setState({ "isLikedLocation": true });
    }
  }

// very similar to the previous function, it checks whether a review is liked or not and changes the button color based on that
  handleLikedReviews = async (loc, rev) => {

    if (this.checkLikedReview(rev)) {
      this.unLikeReview(loc, rev);
    }
    else {
      this.likeReview(loc, rev);
    }
    this.fetchLikedReview();

  }

//this function gets all liked reviews from user details and stores them in a state
  fetchLikedReview = async () => {
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
        } else {
          throw 'Somthing went wrong';
        }
      })
      .then(async (responseJson) => {
        this.setState({
          isLoading: false,
          isLikedReview: responseJson.liked_reviews
        });

      })
      .catch((error) => {
        console.log(error);
      })
  }

//this function compares response review id to the on that i stored in a state to determine wether a review is liked or not
  checkLikedReview = (rev) => {
    for (let i = 0; i < this.state.isLikedReview.length; i++) {
      if (this.state.isLikedReview[i].review.review_id === rev) {
        return true;
      }
    }
    return false;

  }




//calling these 2 functions on page load so i can store liked reviews in a state and display data
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchLikedReview();
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
            <TouchableOpacity

              style={styles.buttonStyle}
              onPress={() => this.handleMyFav()}>

              {this.state.isLikedLocation === true ? <Ionicons name="star" size={20} color="gold"></Ionicons>
                : <Ionicons name="star-outline" size={20} color='black'></Ionicons>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigator.navigate('add_review', { location_id: this.state.userData.location_id })}>
              <Text >Leave a review</Text>
            </TouchableOpacity>
          </View>

          <View  >


            <View style={styles.fixToText}>
              <Text  >{this.state.userData.location_name} </Text>
              <Text>{this.state.userData.location_town} </Text><Text>Average Rating: {this.state.userData.avg_overall_rating}</Text>
            </View>
          </View>
          <Image
            style={styles.imageStretch}

            source={this.state.userData.photo_path ? { uri: this.state.userData.photo_path } : null} />





          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            data={this.state.userData.location_reviews}
            renderItem={({ item }) => (

              <View style={styles.fields}>
                <View style={styles.fixToText}>
                  <Text>overall rating: </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={item.overall_rating}
                    isDisabled
                  />
                  <Text>price rating:</Text>
                  <AirbnbRating
                    size={15}

                    defaultRating={item.price_rating}
                    isDisabled
                  />
                </View>
                <View style={styles.fixToText}>
                  <Text>cleanliness rating: </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={item.clenliness_rating}
                    isDisabled
                  />
                  <Text>quality rating: </Text>
                  <AirbnbRating
                    size={15}
                    defaultRating={item.quality_rating}
                    isDisabled

                  />
                </View>
                <Text style={styles.centeredTxt} >{item.review_body}</Text>


                <View style={styles.fixTogether}>
                  <Text style={styles.centeredTxt} ></Text>
                  <TouchableOpacity


                    style={styles.buttonStyle}
                    onPress={() => this.handleLikedReviews(this.state.userData.location_id, item.review_id)}>

                    <Text > {this.checkLikedReview(item.review_id) === true ?
                      <Ionicons name="heart" size={20} color="red"></Ionicons>
                      : <Ionicons name="heart-outline" size={20} color='black'></Ionicons>}
                      {item.likes} </Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.state.userData.location_id + '/review/' + item.review_id + '/photo?timestamp' + Date.now() }}

                  style={styles.reviewImag}
                />

              </View>
            )}
            keyExtractor={(item) => item.review_id.toString()}
          />


        </View>
      );
    }
  }
}



export default LocatinInfo;
