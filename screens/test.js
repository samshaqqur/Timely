import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Alert, ScrollView, Platform, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import Icon from "react-native-vector-icons/FontAwesome";
import { Right} from "native-base";

const jsonData = { "slots" : {
  "slot1": "8:00am",
  "slot2": "8:30am",
  "slot3": "9:00am",
  "slot4": "9:30am",
  "slot5": "10:00am",
  "slot6": "10:30am",
  "slot7": "11:00am",
  "slot8": "11:30am",
  "slot9": "12:00pm",
  "slot10": "12:30pm",
  "slot11": "1:00pm",
  "slot12": "1:30pm",
  "slot13": "2:00pm",
  "slot14": "2:30pm",
  "slot15": "3:00pm",
  "slot16": "3:30pm",
  "slot17": "4:00pm",
  "slot19": "4:30pm",
  "slot20": "5:00pm",
  "slot21": "5:30pm",
  "slot22": "6:00pm",
  "slot23": "6:30pm",
  "slot24": "7:00pm",
  "slot25": "7:30pm",
  "slot26": "8:00pm",
  "slot27": "8:30pm",
}
}

let currentStore;

export default class test extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('reservations');
    this.state = {
        search: '',
        userKeys: null,
        placeName:'',
        Day:'',
        Month:'',
        Year:'',
        Slot:'',
        docKey:'',
        StoreLat:'',
        StoreLong:'',
        loading:false,
        posts:[],
    };
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

  }

  componentWillUpdate(){
    if(this.state.posts.length>0){
    console.log(this.state.posts.length);
  }

  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  onCollectionUpdate = (querySnapshot) => {
    const postss = [];
    querySnapshot.forEach((doc) => {
      const { storeAddress, name, storePhone, userKey,  StoreLat, StoreLong } = doc.data();
      postss.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        name,
        storeAddress,
        storePhone,
        userKey,
        StoreLat,
        StoreLong,
      });
      posts=postss;
      this.setState({loading:false})
    });

    const Currentstore=this.props.navigation.state.params.currentStore;
    for(const stores of posts){
      if('name' in stores && Currentstore==name){
        this.setState({
          latitudeOfMyLocation: this.props.navigation.state.params.currentLatitude,
          longtitudeOfMyLocation: this.props.navigation.state.params.currentLongtitude,
          storeName: name,
          storeAddressLocation: storeAddress,
          storeAddressLatitude: StoreLat,
          storeAddressLongitude: StoreLong,
          storePhoneNumber: storePhone,    
        });
      }
    }

  }

  render() {

    const slots = jsonData.slots

    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      
      <View style={styles.MainContainer}>
 
        <ScrollView>
            
            <Text style={styles.TextStyle} >  {currentStore} </Text>
 
        </ScrollView>
 
      </View>
    );
  }
}


const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'rgb(255, 102, 102)',
    justifyContent: 'center',
    paddingTop: 10,
 
  },
  TextStyle: {
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: 15,
    fontWeight: 'bold',
    fontSize:  25,
  },
  nestedButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  forIcon:{
    left: 100
  }
});
