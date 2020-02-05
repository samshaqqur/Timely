import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, TextInput } from "react-native";
import { Input, Item,Button, Text} from "native-base";
import firebase from "firebase";
import PhoneInput from 'react-native-phone-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js'



export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      Phone:"",
    };

  
  }


  writeUserData(userId, firstName, lastName, email, Phone) {
    firebase
      .database()
      .ref(`users/${userId}`)
      .set({
        firstName,
        lastName,
        email,
        Phone
      })
      .then(data => {
        //success callback
        console.log("data ", data);
      })
      .catch(error => {
        //error callback
        console.log("error ", error);
      });
  }



  OnSignUp() {
    const { email, password, firstName, lastName, Phone } = this.state;
    const phonee=parsePhoneNumberFromString(`+1 ${Phone}`);
    const phone=phonee.formatInternational();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.writeUserData(
          firebase.auth().currentUser.uid,
          firstName,
          lastName,
          email,
          phone
        );
        this.props.navigation.navigate("main");
      })
      .catch(error => {
        console.log("error ", error);
      });
  }




  render(){
      return (
        

        <View>
          <ImageBackground
            source={require("/Users/samuelshaqqur/Desktop/Timely/assets/SignUp.jpg")}
            style={{ width: "100%", height: "100%" }}
          >
          <View style={styles.container}>
          <View style={styles.inputGroup}>
                  <Item regular style={styles.Text}>
                    <Input
                      placeholder="First Name"
                      value={this.state.firstName}
                      onChangeText={value =>
                        this.setState({ firstName: value })
                      }
                    />
                  </Item>
                  <Item regular style={styles.Text}>
                    <Input
                      placeholder="Last Name"
                      value={this.state.lastName}
                      onChangeText={value => this.setState({ lastName: value })}
                    />
                  </Item>


                  <Item regular style={styles.Text}>
                    <Input
                      placeholder="Email"
                      value={this.state.email}
                      onChangeText={value => this.setState({ email: value })}
                    />
                  </Item>
                  <Item regular style={styles.Text}>
                    <Input
                      secureTextEntry
                      placeholder="Password"
                      value={this.state.password}
                      onChangeText={value => this.setState({ password: value })}
                    />
                  </Item>
                  <Item regular style={styles.Text}>
                  <Input 
                    keyboardType='phone-pad'
                    placeholder="Phone"
                    value={this.state.Phone}
                    onChangeText={value => this.setState({ Phone: value })} />
                  </Item>


                </View>

            <View style={styles.buttonGroup}>
                <Button
                  warning
                  large
                  onPress={() => this.OnSignUp()}
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
