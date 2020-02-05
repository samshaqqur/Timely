import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Input, Button, ActivityIndicator, FlatList, Platform, TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as firebase from 'firebase';
import 'firebase/firestore';
import SearchableFlatList from 'react-native-searchable-list';

let posts= [];


class SearchPlace extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Stores');
    this.state = {
        search: '',
        userKeys: null,
        StoreLat:'',
        StoreLong:'',
        placeName:'',
        placeAddress:'',
        placePhone:'',
        placeKey:'',
        docKey:'',
        loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const postss = [];
    querySnapshot.forEach((doc) => {
      const { storeAddress, name, storePhone, userKey, StoreLat, StoreLong } = doc.data();
      postss.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        name,
        storeAddress,
        storePhone,
        userKey,
        StoreLat,
        StoreLong,
      });
      posts=postss;
      this.setState({loading:false})
    });

  }
  
  search = text => {
    console.log(text);
  };

  clear = () => {
    this.search.clear();
  };

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = posts.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      search: text,
    });
  }

  ListViewItemSeparator = () => {
    //Item sparator view
    return (
      <View
        style={{
          height: 0.3,
          width: '90%',
          backgroundColor: '#080808',
        }}
      />
    );
  };
  

  onSavePress = () => {

    const { docKey, placeName, placeAddress, placePhone, placeKey } = this.state;
    this.props.navigation.navigate("Booking",{docKey, placeName, placeAddress, placePhone, placeKey});

  };

  render() {
    if (this.state.loading) {
      //Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      //ListView to show with textinput used as search bar
      <View style={styles.viewStyle}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder="Search Place..."
          value={this.state.search}
        />
        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          //Item Separator View
          renderItem={({ item }) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <Text style={styles.textStyle} 
            onPress={() => {
                this.state.docKey=item.key,
                this.state.placeName= item.name,
                this.state.placeAddress= item.storeAddress,
                this.state.placePhone=item.storePhone,
                this.state.placeKey=item.userKey,
                this.onSavePress();

            }}
          >{item.name}{'\n'}{item.storeAddress}</Text>

          )}
          enableEmptySections={true}
          style={{ marginTop: 10 }}
          keyExtractor={(item, index) => index.toString()}
        />
      
        </View>
    );
  }
}
  
const styles = StyleSheet.create({
  Content: {
    top: 10
  },
  Text: {
    flex: 1,
    fontSize: 20,
    left: 30
  },
  forIconText: {
    fontSize: 20,
    alignItems: "center",
    color: "white"
  },
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS == 'ios' ? 0 : 0,
  },
  textStyle: {
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    width: "80%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: '10%',
    marginRight: '10%',
    padding: "10%",
    fontSize:  25,
    marginTop: '10%'
  },
});

export default SearchPlace;