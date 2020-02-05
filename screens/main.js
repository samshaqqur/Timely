import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Text, ActivityIndicator, Card, CardItem, Right} from 'native-base';
import { ScrollView, View, StyleSheet, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Avatar } from "react-native-elements";
import * as firebase from 'firebase';
import 'firebase/firestore';
import MapView, { Marker } from "react-native-maps";
import Icon from 'react-native-vector-icons/FontAwesome5'


let posts= [];
let isLoading=true;


export default class main extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Stores');
    this.state = {
      firstName: "",
      lastName: "",
      placeName:'',
      placeAddress:'',
      placePhone:'',
      placeKey:'',
      docKey:'',
      found:false,
      loading: true,
    };
  }


  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.GetName();
  }

  componentWillMount(){
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const postss = [];
    const curruserID=firebase.auth().currentUser.uid;
    querySnapshot.forEach((doc) => {
      const { storeAddress, name, storePhone, userKey } = doc.data();
      postss.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        name,
        storeAddress,
        storePhone,
        userKey,
      });
      posts=postss;
      isLoading=false;
      this.setState({ loading: false, });  
      
      for(const stores of postss){
        if('userKey' in stores && curruserID==userKey){
          this.state.found=true;
        }
      }

    });

  }


  GetName() {
    const self = this;

    if (this.state.firstName === "" && this.state.lastName === "") {
      const user = firebase.auth().currentUser;
      if (user !== null) {
        const userId = user.uid;
        firebase
          .database()
          .ref(`/users/${userId}`)
          .once("value")
          .then(snapshot => {
            self.setState({
              firstName: snapshot.val().firstName,
              lastName: snapshot.val().lastName
            });
          });
      }
    }
  }



  PrintLoginState(){
    firebase.auth().signOut();
    this.props.navigation.navigate('Login');
    console.log("Signed out");
  }
  
  render() {

    return (

      <Container>

      <Container style={{ backgroundColor: "rgba(61, 96, 89, 0.68)" }}>

        <View>
          <ImageBackground
              source={require('/Users/samuelshaqqur/Desktop/Timely/assets/booking.jpg')}
              style={styles.background}
            >
         </ImageBackground>
        </View>
      </Container>




      

        <View style={{ flex: 1, backgroundColor: "#0c73b7" }}>
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
          {this.state.firstName == "Sam" ?
            <Avatar
              size="large"
              rounded
              source={{uri:'/Users/samuelshaqqur/Desktop/Timely/assets/avatar.png'}}
              onPress={()=> this.props.navigation.navigate('EditUser')}
              activeOpacity={0.7}
              showEditButton
            />
            :
            <Avatar
            size="large"
            rounded
            rounded title={this.state.firstName}
            onPress={()=> this.props.navigation.navigate('EditUser')}
            activeOpacity={0.7}
            showEditButton
          />
          }
            
            <Text style={styles.userName}> Welcome {""}
              {this.state.firstName} {this.state.lastName}{"!"}
            </Text>

            <View>
            <TouchableOpacity style={styles.Bbutton}
                onPress={() => this.props.navigation.navigate("RetrieveBusinesses")}
              >
                <Text style={styles.button}>BEGIN SEARCHING</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Bbutton}
                onPress={() => this.props.navigation.navigate("MyAppointments")}
              >
                <Text style={styles.button}>MY APPOINTMENTS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Bbutton}
                onPress={() => this.props.navigation.navigate("EditUser")}
              >
                <Text style={styles.button}>MY INFORMATION</Text>
            </TouchableOpacity>
          </View>
          </View>

        </View>
        


        
        <Footer>
          <FooterTab>
          <Button vertical onPress={()=> this.props.navigation.navigate('RetrieveBusinesses')}>
              <Icon name="search" style={{fontSize:20}}/>
              <Text style={styles.centerText} >Search</Text>
            </Button>
           
            { this.state.found === false ?
            <Button vertical onPress={()=> this.props.navigation.navigate('addPlace')} >
              <Icon name="plus-square" style={{fontSize:20}}/>
              <Text style={styles.centerText}>Add Store</Text>         
            </Button>
            :
            <Button vertical onPress={()=> this.props.navigation.navigate('editPlace')} >
            <Icon name="edit" style={{fontSize:20}}/>
            <Text style={styles.centerText}>Edit Store</Text>         
            </Button>
            }
            <Button vertical onPress={()=> this.props.navigation.navigate('MyAppointments')} >
              <Icon name="calendar-alt" style={{fontSize:20}} />
              <Text style={styles.centerText}>Bookings</Text>
            </Button>
            <Button vertical onPress={()=> this.props.navigation.navigate('EditUser')}>
              <Icon  name="user-edit" style={{fontSize:20}} />
              <Text style={styles.centerText}>Settings</Text>
            </Button>
            <Button vertical onPress={()=> this.PrintLoginState()}>
              <Icon  name="sign-out-alt" style={{fontSize:20}}/>
              <Text style={styles.centerText}>Sign Out</Text>
            </Button>
          </FooterTab>
        </Footer>

      </Container>
    );
  }
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
  centerText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign:"center",
    textAlignVertical:"center"
  },
  userName: {
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10,
    color: "white"
  },
  button: {
    backgroundColor: 'orange',
    color: 'white',
    borderRadius: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:  18,
  },
  forIconText: {
    fontSize: 20,
    alignItems: "center",
    color: "white"
  },
  background: {
    width: '100%',
    height: '100%'
  },
  Bbutton: {
    backgroundColor: 'orange',
    borderColor: 'red',
    borderWidth: 4,
    borderRadius: 20,
    textShadowColor: 'white',
    overflow: 'hidden',
    padding: 10,
    margin:5,
    textAlign:'center',
  },
});