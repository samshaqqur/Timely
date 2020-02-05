import React from 'react';
import { Text, Item, Input, Container, Header,
  Title,
  Body,
  Button } from 'native-base';
import {View, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import firebase from 'firebase';




export default class Login extends React.Component{
    
    componentWillMount(){
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "Your_APIkey",
          
        };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    }
    
    render(){
      return (
      
        <ImageBackground
            source={require('/Users/Desktop/Timely/assets/Welcome.jpg')}
            style={styles.background}
          >
            <View style={styles.button}>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate("SignUp")}
              >
                <Text style={styles.signup}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text style={styles.login}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

       );
    }
}


const styles = StyleSheet.create({
background: {
    width: '100%',
    height: '100%'
  },
  text: {
    color: 'white',
    marginTop: '-25%',
    marginLeft: '20%'
  },
  buttonGroup: {
    flexDirection: "row",
  },
  button: {
    top: 250
  },
  signup: {
    backgroundColor: 'white',
    color: '#3A59FF',
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: "2%",
    fontSize:  27,
    marginTop: '70%'
  },
  login: {
    backgroundColor: '#3A59FF',
    color: 'white',
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '11%',
    padding: "2%",
    fontSize:  27,
    marginTop: '10%'
  }

});
