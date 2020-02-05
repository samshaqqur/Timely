import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import main from './screens/main';
import SearchPlace from './screens/SearchPlace';
import addPlace from './screens/addPlace';
import schedule from './screens/schedule';
import Slot from './screens/Slot';
import StoreInformation from './screens/StoreInformation';
import RetrieveBusinesses from './screens/RetrieveBusinesses';
import MainScreen from './screens/MainScreen';
import Booking from './screens/Booking';
import editPlace from './screens/editPlace';
import EditUser from './screens/EditUser';
import MyAppointments from './screens/MyAppointments';
import test from './screens/test';



const MainNavigator = createStackNavigator({
  MainScreen: {screen: MainScreen},
  Login: {screen: Login},
  SignUp: {screen: SignUp},
  main: {screen: main},
  SearchPlace: {screen: SearchPlace},
  schedule: {screen: schedule},
  Slot: {screen: Slot},
  addPlace: {screen: addPlace},
  StoreInformation: {screen: StoreInformation},
  RetrieveBusinesses: {screen: RetrieveBusinesses},
  Booking: {screen: Booking},
  editPlace: {screen: editPlace},
  EditUser: {screen: EditUser},
  MyAppointments: {screen: MyAppointments},
  test: {screen: test},

});

const Appcon = createAppContainer(MainNavigator);

export default function index() {
  console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

  return (
    <Appcon/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
