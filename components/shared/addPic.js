import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../Styling/stylingSheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

class addReviewPic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //getting this values from previous page FlatList, storing them in a state  
      clicked_location_id: this.props.route.params.location_id,
      clicked_review_id: this.props.route.params.review_id,
    };
  }

//sending an API request to the server, using camer to take a picture, attaching the token within the header
  addReviewPhoto = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    const options = { quality: 0.5, base64: true }
    let data = await this.camera.takePictureAsync(options);

    if (this.camera) {

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/" +
        this.state.clicked_location_id + "/review/" + this.state.clicked_review_id + "/photo/", {

        method: 'post',
        headers: {
          "Content-Type": "image/png",
          'x-authorization': token
        },
        body: data
      })
        .then((response) => {
          if (response.status === 200) {
            this.props.navigation.navigate('ViewReviews');

          } else if (response.status === 400) {
            throw 'Bad request';
          }
          else if (response.status === 401) {
            throw 'unauthorised';
          }
          else if (response.status === 404) {
            throw 'Not found';
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

  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.addReviewPhoto();
    }
  };



  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}

          style={styles.preview}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}
          >
            <Ionicons name="camera" size={70} style={styles.camButton}></Ionicons>

          </TouchableOpacity>
        </View>
      </View>
    );
  }


}

export default addReviewPic