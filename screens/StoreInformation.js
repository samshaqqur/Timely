import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import {
  Container,
  Body,
  Header,
  Button,
  Left,
  Title,
  Content,
  Footer,
  Card,
  CardItem,
  Right
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import HeaderIcon from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import getDirections from "react-native-google-maps-directions";
import * as firebase from 'firebase';
import 'firebase/firestore';
import axios from 'axios';


let posts=[];

export default class StoreInformation extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Stores');
    this.state = {
      marker: "",
      latitudeOfMyLocation: null,
      longtitudeOfMyLocation: null,
      error: null,
      storeName: "",
      storeAddressLocation: "",
      storeAddressLatitude: "",
      storeAddressLongitude: "",
      storePhoneNumber: "",
      website:"",
    };
  }


  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillMount(){
    this.setState({
      latitudeOfMyLocation: this.props.navigation.state.params.nLat,
      longtitudeOfMyLocation: this.props.navigation.state.params.nLong
    })
  }



  onCollectionUpdate = (querySnapshot) => {
    const postss = [];
    querySnapshot.forEach((doc) => {
      const { storeAddress, name, storePhone, userKey, StoreLat, StoreLong, website } = doc.data();
      postss.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        name,
        storeAddress,
        storePhone,
        userKey,
        StoreLat,
        StoreLong,
        website,
      });
      posts=postss;
      this.setState({loading:false})
    });

    const Currentstore=this.props.navigation.state.params.currentStore;
    for(const stores of posts){
      if('name' in stores && Currentstore==stores.name){
        this.setState({
          storeName: stores.name,
          storeAddressLocation: stores.storeAddress,
          storeAddressLatitude: stores.StoreLat,
          storeAddressLongitude: stores.StoreLong,
          storePhoneNumber: stores.storePhone,
          website:stores.website
        });
      }
    }

  }

  handleGetDirections() {
    const {
      latitudeOfMyLocation,
      longtitudeOfMyLocation,
      storeAddressLatitude,
      storeAddressLongitude
    } = this.state;

    const data = {
      source: {
        latitude: latitudeOfMyLocation,
        longitude: longtitudeOfMyLocation
      },
      destination: {
        latitude: storeAddressLatitude,
        longitude: storeAddressLongitude
      },
      params: [
        {
          key: "travelmode",
          value: "driving" // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate" // this instantly initializes navigation using the given travel mode
        }
      ]
    };

    getDirections(data);
  }

  render() {
    

    const {
      latitudeOfMyLocation,
      longtitudeOfMyLocation,
      storeName,
      storeAddressLocation,
      storeAddressLatitude,
      storeAddressLongitude,
      storePhoneNumber,
    } = this.state;

    return (
      <Container style={{ backgroundColor: "rgba(61, 96, 89, 0.68)" }}>
     

        <MapView
          style={{ flex: 1, justifyContent: "space-evenly" }}
          initialRegion={{
            latitude: Number(this.state.latitudeOfMyLocation),
            longitude: Number(this.state.longtitudeOfMyLocation),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
          }}
          //followsUserLocation={true}
          showsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          <MapView.Marker
            coordinate={{
              latitude: Number(storeAddressLatitude),
              longitude: Number(storeAddressLongitude)
            }}
            title={storeName}
          />

          <MapView.Polyline
            coordinates={[
              {
                latitude: Number(latitudeOfMyLocation),
                longitude: Number(longtitudeOfMyLocation)
              },
              {
                latitude: Number(storeAddressLatitude),
                longitude: Number(storeAddressLongitude)
              }
            ]}
            strokeWidth={2}
            strokeColor="red"
          />
        </MapView>

        <Content style={styles.Content}>
          <Card>
            <CardItem>
              <Icon
                name="circle-o-notch"
                size={17}
              />
              <Text
                style={styles.Text}
              >
                {storeName}
              </Text>
              <Right>
                <Icon
                  name="arrow-circle-right"
                  size={20}
                />
              </Right>
            </CardItem>
            <View style={{ width: '100%', height: 1, backgroundColor: 'black', paddingTop:5, marginTop: 10, marginBottom:10 }} />

            <CardItem>
              <Icon
                name="map-marker"
                size={20}
              />
              <Text
                style={styles.Text}
              >
                {storeAddressLocation}
              </Text>
              <Right>
                <Icon
                  name="arrow-circle-right"
                  size={20}
                />
              </Right>
            </CardItem>
            <View style={{ width: '100%', height: 1, backgroundColor: 'black', paddingTop:5, marginTop: 10, marginBottom:10 }} />


            <CardItem>
              <Icon
                name="phone"
                size={20}
                onPress={() => {
                  Linking.openURL(`tel:${storePhoneNumber}`);      
                }}
              />
              <Text
                style={styles.Text}
                onPress={() => {
                  Linking.openURL(`tel:${storePhoneNumber}`);
                }}
              >
                {storePhoneNumber}
              </Text>
            </CardItem>
            <View style={{ width: '100%', height: 1, backgroundColor: 'black', paddingTop:5, marginTop: 10, marginBottom:10 }} />

            <CardItem>
              <Icon
                name="external-link"
                size={20}
                onPress={() => {
                  Linking.openURL(`${this.state.website}`);
                }}
              />
              <Text
                style={styles.Text}
                onPress={() => {
                  Linking.openURL(`${this.state.website}`);
                }}
              >
                View Website
              </Text>
            </CardItem>
          </Card>

          <Button
            full
            title="Get Directions"
            onPress={() => this.handleGetDirections()}
          >
            <Icon name="location-arrow" size={20} />
            <Text style={styles.forIconText}>{"  Start Navigation  "}</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  Content: {
    top: 10
  },
  Text: {
    flex: 1,
    fontSize: 20,
    left: 30
  },
  forIconText: {
    fontSize: 20,
    alignItems: "center",
    color: "white"
  }
});
