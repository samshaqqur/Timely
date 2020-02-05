import React from 'react';
import { StyleSheet, Text, View, Button, StatusBar, ActivityIndicator } from 'react-native';
import {Calendar} from 'react-native-calendars';


export default class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          PlaceName:'',
          PlaceAddress:'',
          PlacePhone:'',
          PlaceKey:'',
          DocKey:'',
          isLoading:true,
        };
        this.onDayPress = this.onDayPress.bind(this);
      }

    componentWillMount(){
      this.loadData();
    }

    loadData(){

        this.state.PlaceName= this.props.navigation.state.params.placeName;
        this.state.PlaceAddress=this.props.navigation.state.params.placeAddress;
        this.state.PlacePhone= this.props.navigation.state.params.placePhone;
        this.state.PlaceKey= this.props.navigation.state.params.placeKey;
        this.state.DocKey= this.props.navigation.state.params.docKey;
        this.state.isLoading= false;

    }

    onDayPress(day) {
        this.setState({
          selected: day.dateString
        });
        const { DocKey, PlaceName, PlaceAddress, PlacePhone, PlaceKey } = this.state;

        this.props.navigation.navigate("Slot",{DocKey, bookingDate : day, PlaceName, PlaceAddress, PlacePhone, PlaceKey});
      }
   

    render(){
      if (this.state.isLoading) {
        //Loading View while data is loading
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <ActivityIndicator />
          </View>
        );
      }

      return (
        <View style={styles.container}>
        
        <StatusBar barStyle="light-content"/>

        <Text style={styles.PlaceText}>{this.state.PlaceName}</Text> 
        <Text style={styles.Text}>Choose your day!</Text>        
        
        <Calendar
        onDayPress={this.onDayPress}
        style={styles.calendar}
        hideExtraDays
        markedDates={{[this.state.selected]: {selected: true}}}
        theme={{
            selectedDayBackgroundColor: 'green',
            todayTextColor: 'green',
            arrowColor: 'green',
        }}
        />
        </View>
       );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(61, 96, 89, 0.68)",
  },
  PlaceText: {
    fontStyle: 'italic',
    justifyContent: 'center',
    color: 'orange',
    width: "80%",
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '10%',
    marginRight: '10%',
    fontSize:  30,
  },
  Text: {
    justifyContent: 'center',
    color: 'white',
    width: "80%",
    borderRadius: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '10%',
    marginRight: '10%',
    padding: "5%",
    fontSize:  25,
  }
});
