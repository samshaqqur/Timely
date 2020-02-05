import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, Platform, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import Icon from "react-native-vector-icons/FontAwesome";
import { Right, Container, Header, Left, Body, Title, Button} from "native-base";

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
let nLat;
let nLong;

export default class MyAppointments extends React.Component {
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
        loading:false,
        posts:[],
        latitudeOfMyLocation: null,
        longtitudeOfMyLocation: null,
    };
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

    navigator.geolocation.getCurrentPosition(res => {
      this.setState({
        latitudeOfMyLocation: res.coords.latitude.toString(),
        longtitudeOfMyLocation: res.coords.longitude.toString()
      })
  });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  onCollectionUpdate = (querySnapshot) => {
    const postss = [];
    querySnapshot.forEach((doc) => {
      const { StoreName, UserKey, day, month, year , slot } = doc.data();
      postss.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        StoreName,
        UserKey,
        day,
        month,
        year,
        slot,
      });
    });

    const Newpostss = [];

    const curruserID=firebase.auth().currentUser.uid;
    for(const Reservation of postss){
      if('UserKey' in Reservation && curruserID==Reservation.UserKey){
        Newpostss.push({
          StoreName: Reservation.StoreName,
          UserKey: Reservation.UserKey,
          day: Reservation.day,
          month: Reservation.month,
          year: Reservation.year,
          slot: Reservation.slot,
        });
        this.setState({ posts:Newpostss, loading:false})

      }
    }
  }


  render() {

    const slots = jsonData.slots

    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return (
    <Container>
        <Header style={{ backgroundColor: 'orange', paddingTop:0 }}>
          <Title style={{ color: 'white', fontSize:40, top:0 }}>Reservations</Title>
        </Header>
      
      <View style={styles.MainContainer}>
 
        <ScrollView>
 
          {
            this.state.posts.map((item, key) => (
              currentStore=item.StoreName,
              nLat=this.state.latitudeOfMyLocation,
              nLong=this.state.longtitudeOfMyLocation,
              <TouchableOpacity key={key} onPress={() => {this.props.navigation.navigate('StoreInformation',{currentStore:item.StoreName, nLat, nLong })}}>
 
                <Text style={styles.TextStyle} >  {currentStore} </Text>

                <View style={styles.nestedButtonView}>
                <Text style={{fontSize: 20, textAlign: 'center', alignItems: 'center', color: 'white', borderRadius: 15,
                 fontWeight: 'bold', fontSize:  25, marginLeft:32}}  > {item.month}/{item.day}/{item.year} </Text>

               
                  <View style={styles.forIcon}>
                  <Icon
                    name="arrow-circle-o-right"
                    size={30}
                    color='yellow'
                    />  
                  </View>   

                </View>   

                <Text style={styles.TextStyle} >  {slots[item.slot]}  </Text>

                <View style={{ width: '100%', height: 1, backgroundColor: 'black', paddingTop:5, marginTop: 10, marginBottom:10 }} />
 
              </TouchableOpacity>
 
            ))
          }
 
        </ScrollView>
 
      </View>
      </Container>
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
