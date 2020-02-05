import React from 'react';
import { Text, Item, Input, Container, Header,
  Title,
  Body,
  Button } from 'native-base';
  import {View, StyleSheet, ImageBackground, TouchableOpacity, Alert} from 'react-native';
  import PhoneInput from 'react-native-phone-input';
  import * as firebase from 'firebase';
  import 'firebase/firestore';
  import { Hideo } from 'react-native-textinput-effects';
  import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
  import { parsePhoneNumberFromString } from 'libphonenumber-js'
  import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';





export default class addPlace extends React.Component {


  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Stores');
    this.state = {
      Name: "",
      Address: "",
      StorePhone: "",
      website:"",
      latitude: null,
      longitude:null,
      found:false,
    };
  }
  
  componentWillUnmount() {
    this.unsubscribe();
  }
  
  trigger(){
  
    const { Name, Address, StorePhone, latitude, longitude, website } = this.state;
    const userID=firebase.auth().currentUser.uid;


    if(!this.state.found){
      firebase.firestore().collection('Stores').add({name:Name, storeAddress:Address, storePhone:StorePhone , website:website, userKey:userID, StoreLat: latitude, StoreLong: longitude });
      Alert.alert(
        'Congratulations!',
        'Your business is ready',
        [
          {text: 'OK', onPress: () => this.props.navigation.navigate("main")},
        ],
      );
     }
     else if(this.state.found){
      Alert.alert(
        'Unalbe to register',
        'Business already in use',
        [
          {text: 'OK', onPress: () => this.props.navigation.navigate("main")},
        ],
      );
    }
  }

  try() {
    this.unsubscribe = this.ref.onSnapshot(this.onSubmit);
    console.log(this.state.found);
  }

  onSubmit = (querySnapshot) => {
    
    const curruserID=firebase.auth().currentUser.uid;
    const postss = [];

    querySnapshot.forEach((doc) => {
      const { storeAddress, name, storePhone, userKey, website } = doc.data();

      postss.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        name,
        storeAddress,
        storePhone,
        website,
        userKey,
      });

      for(const stores of postss){
        if('name' in stores && name==this.state.Name){
          this.state.found=true;
        }
      }
    });
    this.trigger();
  }



    render(){

      return (
        <View style={styles.container}>

        <Text style={{fontSize:25, color:'yellow', fontWeight: 'bold', textAlign:'center', margin:10}}>*Searching for address first will save you time!</Text>

        <View style={styles.fromTop}>

        
          <Text style={{ color:'white', fontSize:25 }}>Title</Text>
          <Item regular style={styles.Text}>
            <Hideo
              placeholder="Store name..."
              iconClass={FontAwesomeIcon}
              iconName={'store-alt'}
              iconColor={'white'}
              iconBackgroundColor={'#f2a59d'}
              inputStyle={{ color: '#464949' }}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              value={this.state.Name}
              onChangeText={value => this.setState({ Name: value })}
            />
          </Item>
          <Text style={{ color:'white', fontSize:25 }}>Phone</Text>
          <Item regular style={styles.Text}>
            <Hideo
              placeholder="Store Phone..."
              iconClass={FontAwesomeIcon}
              iconName={'phone'}
              iconColor={'white'}
              iconBackgroundColor={'#f2a59d'}
              inputStyle={{ color: '#464949' }}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              value={this.state.StorePhone}
              onChangeText={value => this.setState({ StorePhone: value })}
            />
          </Item>    

          <Text style={{ color:'white', fontSize:25 }}>Website</Text>
          <Item regular style={styles.Text}>
            <Hideo
              placeholder="website..."
              iconClass={FontAwesomeIcon}
              iconName={'link'}
              iconColor={'white'}
              iconBackgroundColor={'#f2a59d'}
              inputStyle={{ color: '#464949' }}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              value={this.state.website}
              onChangeText={value => this.setState({ website: value })}
            />
          </Item>
        </View>

       
        <View style={{ flex: 1, width:300 }}>
        <Text style={{ color:'white', fontSize:25 }}>Address</Text>

            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              keyboardAppearance={'light'}
              listViewDisplayed={false}
              fetchDetails={true}
              keyboardShouldPersistTaps="handled"
              renderDescription={row => row.description}
              onPress={(data, details = null) => {
                this.setState({
                  Address: details.formatted_address,
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  website: details.website,
                  StorePhone: details.international_phone_number,
                })
                console.log(details.international_phone_number);//details
                console.log(this.state.website);//details


                this.setState({location:data.structured_formatting.main_text, user_long:details.geometry.location.lng, user_lat: details.geometry.location.lat })
              }}
              enablePoweredByContainer={false}
              getDefaultValue={() => ''}
              textInputProps={{
                ref: (input) => {this.fourthTextInput = input}
              }}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyC8h5--lK_Hd7IIpkLIyy75xCY_VkPyg1k',
                language: 'en',
                region: "US", //It removes the country name from the suggestion list
                types: '', // default: 'geocode'
                components: 'country:us'
              }}
              currentLocation={false} 
              nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                type: 'cafe'
              }}    
              GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: 'formatted_address',
              }}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
              debounce={200}
            />
        </View>



        <View>
        <Button
            warning
            large
            onPress={() => this.try()}
            style={styles.button}
          >
            <Text> Add Store </Text>
        </Button>
        </View>

        </View>

       );
    }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "rgba(61, 96, 89, 0.68)"
  },
  Text: {
    backgroundColor: 'white',
    width: "70%",
    height: 50,
    margin: 10
  },
  button: {
    margin: 10
  },
  fromTop:{
    marginTop:15,
  },
});
