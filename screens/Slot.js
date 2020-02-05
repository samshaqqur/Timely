import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import * as firebase from 'firebase'
import Animbutton from '../components/animbutton'
import { ScrollView } from 'react-native-gesture-handler';

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

export default class Slot extends Component {
  constructor(props) {
     super(props);
     this.state ={
       bookingDate: this.props.navigation.state.params.bookingDate
     }
 
   }

  _bookSlot(status,key,value){
    const year= this.state.bookingDate.year
    const month = this.state.bookingDate.month
    const date = this.state.bookingDate.day
    const user = firebase.auth().currentUser
    const uid = user.uid
    const StoreKEY=this.props.navigation.state.params.DocKey
    const storeName=this.props.navigation.state.params.PlaceName
    let userDataJson = {}
    const printDate=month+'/'+date+'/'+year

    if(status)
    userDataJson[key] = StoreKEY
    else
    userDataJson[key] = null
 
    Alert.alert(
      'Are you sure you want to reserve this slot?',printDate,
      [                                  
        {text: 'Reserve', onPress: () => (firebase.firestore().collection('reservations').add({StoreName:storeName, year: year, month:month, day:date, UserKey: uid, slot:key})
        ,this.props.navigation.navigate("main"))},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );


  }

  
  render() {
    let _this = this
    const slots = jsonData.slots
    const slotsarr = Object.keys(slots).map( function(k) {
      return (  <View key={k} style={{margin:5}}>
                  <Animbutton countCheck={0} onColor={"green"} effect={"pulse"} _onPress={(status) => _this._bookSlot(status,k,slots[k]) } text={slots[k]} />
                </View>)
    });
    return (
      <View style={styles.container}>
      <Text style={{fontSize:25, color:'green', fontWeight: 'bold', textAlign:'center', margin:10}}>Please choose a time slot!</Text>
        <ScrollView>
      <StatusBar barStyle="light-content"/>
      { slotsarr }
      </ScrollView>
      </View>
      
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});