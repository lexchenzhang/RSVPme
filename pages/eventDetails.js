import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { globalStyles, images } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../components/card";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { RegionContext } from "../components/region";
import { UserContext } from "../components/userContext";
import axios from "axios";
import FriendCard from "../components/friendCard";
const qs = require("qs");


export default function EventDetails({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [region] = useContext(RegionContext);
  const user = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421, 
  })
  const rating = navigation.getParam("event_rating");
  const rows = [];
  for (var i = 0; i < rating; i++) {
    rows.push(<MaterialIcons name="star" size={24} key={i} />);
  }

  useEffect(() => {
    async function fetchFriends() {
      if(user.uid) {
        axios
        .post(
          "https://www.splitvision.top/api/capstone/getFriendList",
          qs.stringify({
            uid: user.uid,
            appid: "capstone",
            access_token: "test_token",
            sign: "capstone",
            info: null,
          })
        )
        .then(function (response) {
          if (response.data.errno === 0) {
            response.data.list.map((e) => {
              e.key = e._ctime;
            });
            setFriends(response.data.list);
          } else if (response.data.errno === 4) {
            setFriends([]);
          }
        }).catch((error) => {console.log(`axios ${error}`)});
      } else {
        setFriends([]);
      }
    }

    async function fetchLocation() {
      axios
        .post(
          "https://api.geocod.io/v1.6/geocode",
          qs.stringify({
            q: navigation.getParam("event_address"),
            api_key: "a78a8ac5afc37554c49a9a6f69f557335854643",
          })
        )
        .then((response) => {
          if(response.status === 200) {
            setLocation({
              latitude: response.data.results.q.response.results[0].location.lat,
              longitude: response.data.results.q.response.results[0].location.lng,
              latitudeDelta: location.latitudeDelta,
              longitudeDelta: location.longitudeDelta,
            })
          }
        })
    }
    fetchFriends();
    fetchLocation();
  }, [])

  return (
    <View style={globalStyles.container}>
      <Modal visible={modalOpen} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalOpen(false)}
            />
            <View style={styles.mcontainer}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={location}
                showsUserLocation={true}
              >
                <Marker 
                  key={0} 
                  coordinate={location} 
                  title={navigation.getParam("event_title")}
                  description={navigation.getParam("event_body")}
                />
              </MapView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={modalOpen2} animationType="slide">
        <View style={styles.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModalOpen2(false)}
          />
          {
            friends.map((value, index) => {
              return <FriendCard username={value.user_name} removeIcon="add" onRemove={() => {
                axios
                  .post(
                    "https://www.splitvision.top/api/capstone/getInvitations",
                    qs.stringify({
                      uid: value.fid,
                      appid: "capstone",
                      access_token: "test_token",
                      sign: "capstone",
                      info: null,
                    })
                  )
                  .then(function (response) {
                    if (response.data.errno === 0) {
                      // Check if already been added to event
                      let addedToEvent = false;
                      let event_title = navigation.getParam("event_title");
                      response.data.list.map((e) => {
                        console.log(e.event_title);
                        if(e.event_title === event_title) {
                          console.log("Already invited");
                          addedToEvent = true;
                        }
                      });
                      if(!addedToEvent) {
                        axios
                          .post(
                            "https://www.splitvision.top/api/capstone/inviteFriends",
                            qs.stringify({
                              uid: user.uid,
                              appid: "capstone",
                              access_token: "test_token",
                              sign: "capstone",
                              info: JSON.stringify({
                                users: value.fid,
                                event_title: navigation.getParam("event_title"),
                              }),
                            })
                          )
                      }
                    } else if (response.data.errno === 4) {
                      axios
                        .post(
                          "https://www.splitvision.top/api/capstone/inviteFriends",
                          qs.stringify({
                            uid: user.uid,
                            appid: "capstone",
                            access_token: "test_token",
                            sign: "capstone",
                            info: JSON.stringify({
                              users: value.fid,
                              event_title: navigation.getParam("event_title"),
                            }),
                          })
                        )
                    }
                  }).catch((error) => {console.log(`axios ${error}`)});
              }} key={index} />
            })
          } 

        </View>
      </Modal>

      <Card>
        <Text style={{ ...globalStyles.titleText, ...styles.textTitle }}>
          {navigation.getParam("event_title")}
        </Text>
        <Text style={styles.textBody}>{navigation.getParam("event_body")}</Text>
        <Text style={styles.textDate}>
          {navigation.getParam("event_address")}
        </Text>
        <Text style={styles.textDate}>{navigation.getParam("event_date")}</Text>
        <View style={styles.showonmap}>
          <MaterialIcons
            name="map"
            size={24}
            style={styles.mbtn}
            onPress={() => setModalOpen(true)}
          />
          <MaterialIcons
              name="person-add"
              size={24}
              style={styles.mbtn}
              onPress={() => setModalOpen2(true)}
            />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    paddingBottom: 10,
  },
  textBody: {
    borderTopWidth: 1,
    padding: 10,
  },
  textDate: {
    alignSelf: "flex-end",
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  showonmap: {
    flexDirection: "row",
  },
  mcontainer: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 100,
    paddingTop: 100,
    flexDirection: "column",
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    flex: 1,
  },
  modalToggle: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  mbtn: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
});
