import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Button } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


class SearchPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:null,
      address: null,
      phone:null,
      website:null,
      latitude: null,
      longitude:null,
      currentLatitude:null,
      currentLongtitude:null,
      loading: false
    };
  }

  componentDidMount(){

    navigator.geolocation.getCurrentPosition(res => {
      if (res && res.coords) {
        this.setState({
          currentLatitude: res.coords.latitude.toString(),
          currentLongtitude: res.coords.longitude.toString(),
        })
      }
    });
  }

  onSavePress = () => {

    const { title, address, latitude, longitude, phone , website, currentLatitude, currentLongtitude} = this.state;
    console.log(this.state.currentLatitude);
    this.props.navigation.navigate("StoreInformation",{title, address, latitude, longitude,  phone , website,currentLatitude,currentLongtitude});

  };
  
 
  render() {

    return (
      <View style={{ paddingTop: 20, flex: 1, width:300 }}>
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
              title: details.name,
              address: details.formatted_address,
              phone:details.international_phone_number,
              website:'https://'+details.name+'.com',
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
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


          
        <Button style={styles.button}
            title="Save"
            onPress={this.onSavePress}
            loading={this.state.loading}
          />
          


      </View>

    );
  }
}


const styles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: 'transparent',
    margin: 0,
    padding:0,
    borderTopWidth: 0,
    borderBottomWidth:0
  },
  textInput: {
    textAlign: 'center',
    borderColor: "#cbb4c0",
    borderBottomWidth: 1,
    color: '#5d5d5d',
    fontSize: 14,
  },
  description: {
    color:'#ac879a',
    fontWeight: '300'
  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },
  button:{
    paddingBottom: 200,
  }
});

export default SearchPlace;