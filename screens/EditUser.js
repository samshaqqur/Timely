import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, TextInput, Alert } from "react-native";
import { Input, Item,Button, Text} from "native-base";
import firebase from "firebase";
import PhoneInput from 'react-native-phone-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js'



export default class EditUser extends Component {
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

  componentWillMount(){
    this.GetEmail();
    console.log(this.state.email);
  }

  writeUserData(userId, firstName, lastName, Phone) {
    firebase
      .database()
      .ref(`users/${userId}`)
      .set({
        firstName,
        lastName,
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


  OnUpdate() {
    const { password, firstName, lastName, Phone } = this.state;
    const phonee=parsePhoneNumberFromString(`+1 ${Phone}`);
    const phone=phonee.formatInternational();
    console.log(phonee.formatInternational());
    const userID = firebase.auth().currentUser.uid;

    firebase.database().ref().child('/users/' + userID).update({ firstName: firstName, lastName: lastName, Phone: phone,});

    Alert.alert(
    'Profile Updated!',
    '',
    [
        {text: 'OK', onPress: () => this.props.navigation.navigate("main")},
    ],
    );

  }


  GetEmail() {
    const self = this;

    if (this.state.email === "" ) {
      const user = firebase.auth().currentUser;
      if (user !== null) {
        const userId = user.uid;
        firebase
          .database()
          .ref(`/users/${userId}`)
          .once("value")
          .then(snapshot => {
            self.setState({
              email: snapshot.val().email,
              firstName: snapshot.val().firstName,
              lastName: snapshot.val().lastName,
              Phone:snapshot.val().Phone,
            });
          });
      }
    }
  }



  render(){
      return (
        <View>
          <ImageBackground
            source={require("/Users/samuelshaqqur/Desktop/Timely/assets/SignUp.jpg")}
            style={{ width: "100%", height: "100%" }}
          >
          <View style={styles.container}>

          <Text style={{fontSize:25, color:'yellow', fontWeight: 'bold', textAlign:'center', margin:10}}>*Please note: Your email can not be changed!</Text>


          <View style={styles.inputGroup}>      

                 <Text style={{fontSize:20, color:'white', fontWeight: 'bold', marginTop:10, borderColor: 'red'}}>Email</Text>
                 <Item regular style={styles.Text}>
                    <Input
                      placeholder="Email"
                      value={this.state.email}
                      onChangeText={value => this.setState({ email: value })}
                      editable={false}
                    />
                  </Item>
                  <Text style={{fontSize:20, color:'white', fontWeight: 'bold', marginTop:10, borderColor: 'red', borderWidth:2}}>First Name</Text>
                  <Item regular style={styles.Text}>
                    <Input
                      placeholder="First Name"
                      value={this.state.firstName}
                      onChangeText={value =>
                        this.setState({ firstName: value })
                      }
                    />
                  </Item>

                  <Text style={{fontSize:20, color:'white', fontWeight: 'bold', marginTop:10, borderColor: 'red', borderWidth:2}}>Last Name</Text>
                  <Item regular style={styles.Text}>
                    <Input
                      placeholder="Last Name"
                      value={this.state.lastName}
                      onChangeText={value => this.setState({ lastName: value })}
                    />
                  </Item>

                  <Text style={{fontSize:20, color:'white', fontWeight: 'bold', marginTop:10, borderColor: 'red', borderWidth:2}}>Phone</Text>
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
                  onPress={() => this.OnUpdate()}
                  style={styles.button}
                >
                  <Text> Update </Text>
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
  },
  buttonGroup: {
    flexDirection: "row",
  },
  button: {
    margin: 10
  },
});
