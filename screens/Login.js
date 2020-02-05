import React from 'react';
import { Text, Item, Input, Container, Header,
  Title,
  Body,
  Button } from 'native-base';
  import {View, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
  import PhoneInput from 'react-native-phone-input';
  import firebase from 'firebase';



export default class Login extends React.Component{
    
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggedIn: null,
      currentLatitude:null,
      currentLongtitude:null,
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
  

  componentWillMount(){

    firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.setState({
            loggedIn: true
          })
        }
        else{
          this.setState({
            loggedIn: false
          })
        }
    } )
  }


  renderInfo() {
    if (this.state.value) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.valid.toString()}
            </Text>
          </Text>
          <Text>
            Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>
            Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
          </Text>
        </View>
      );
    }
  }

  onLogin() {
    const { email, password, currentLatitude, currentLongtitude } = this.state;
    

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("main",{currentLatitude,currentLongtitude});
        console.log("Success");
      })
      .catch(() => {
        console.log("error");
      });
  }


  

    
    render(){
      return (

        <View>
          <ImageBackground
            source={require("/Users/samuelshaqqur/Desktop/Timely/assets/TIME.jpg")}
            style={{ width: "100%", height: "100%" }}
          >
          <View style={styles.container}>
            <View>
                <Item regular style={styles.Text}>
                  <Input
                    placeholder="email"
                    value={this.state.email}
                    onChangeText={value => this.setState({ email: value })}
                  />
                </Item>
            </View>

            <View>
                <Item regular style={styles.Text}>
                  <Input
                    secureTextEntry
                    placeholder="Password"
                    value={this.state.password}
                    onChangeText={value => this.setState({ password: value })}
                  />
                </Item>
            </View>

            <View style={styles.buttonGroup}>
                <Button
                  primary
                  large
                  style={styles.button}
                  onPress={() => this.onLogin()}
                >
                  <Text> Login </Text>
                </Button>
                <Button
                  warning
                  large
                  onPress={() => this.props.navigation.navigate("SignUp")}
                  style={styles.button}
                >
                  <Text> Sign Up </Text>
                </Button>
              </View>


          </View>
       
          </ImageBackground>
        </View>

       );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  Text: {
    backgroundColor: 'white',
    width: "70%",
    height: 50,
    margin: 10
  },
  buttonGroup: {
    flexDirection: "row",
  },
  button: {
    margin: 10
  },

});
