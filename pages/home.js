import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../components/card";
import EventForm from "./eventForm";
import axios from "axios";
import { UserContext } from "../components/userContext";
const qs = require("qs");

export default function Home({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useContext(UserContext)

  const addEvent = (event) => {
    async function uploadEvent(data) {
      let str = qs.stringify({
        uid: user.uid,
        appid: "capstone",
        access_token: "test_token",
        sign: "capstone",
        info: JSON.stringify({
          event_title: data.event_title,
          event_body: data.event_body,
          event_address: data.event_address,
          event_date: data.event_date,
          event_rating: data.event_rating,
        }),
      });
      axios
        .post("https://www.splitvision.top/api/capstone/createevent", str)
        .then(function (response) {
          if (response.data.errno === 0) {
            console.log(response.data);
          }
        });
      axios
        .post(
          "https://www.splitvision.top/api/capstone/inviteFriends",
          qs.stringify({
            uid: user.uid,
            appid: "capstone",
            access_token: "test_token",
            sign: "capstone",
            info: JSON.stringify({
              users: user.uid,
              event_title: data.event_title,
            }),
          })
        )
    }
    event.key = Math.random().toString();
    uploadEvent(event);
    setEvents((currentEvents) => {
      return [event, ...currentEvents];
    });
    setModalOpen(false);
  };

  useEffect(function effectFunction() {
    async function fetchEvents() {
      if(user.uid) {
        axios
        .post(
          "https://www.splitvision.top/api/capstone/getInvitations",
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
            let eventList = [];
            let eventCount = response.data.list.length;
            response.data.list.map((e, i) => {
              axios
                .post(
                  "https://www.splitvision.top/api/capstone/getEventByTitAndUID",
                  qs.stringify({
                    uid: e.uid,
                    appid: "capstone",
                    access_token: "test_token",
                    sign: "capstone",
                    info: JSON.stringify({
                      event_title: e.event_title,
                    }),
                  })
                )
                .then(function (response) {
                  if (response.data.errno === 0) {
                    eventList = [response.data.list[0], ...eventList]
                    eventList[0].key = eventList[0]._ctime;
                    if (i + 1 === eventCount) {
                      setEvents(eventList);
                    }
                  }
                }).catch((error) => {console.log(`axios ${error}`)});
            })
          }
          setLoading(false);
        }).catch((error) => {console.log(`axios ${error}`)});
      } else {
        setEvents([]);
        setLoading(false);
      }
    }
    setLoading(true);

    const intervalId = setInterval(() => {
      fetchEvents()
    }, 10000)
  }, [user.uid]);

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.headers}>Loading</Text>
      </View>
    );
  } else {
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
              <EventForm addEvent={addEvent} />
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <MaterialIcons
          name="add"
          size={24}
          style={styles.modalToggle}
          onPress={() => setModalOpen(true)}
        />

        <FlatList
          data={events}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ReviewDetails", item)}
            >
              <Card>
                <Text style={globalStyles.titleText}>{item.event_title}</Text>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
  },
});
