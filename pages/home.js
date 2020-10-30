import React, { useState, useEffect } from "react";
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
import Event from "../components/event";
const qs = require("qs");

export default function Home({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      event_title: "Game Day",
      event_rating: 5,
      event_body: "This game is TTU vs xxx which hold on xxx.",
      event_date: "2020/09/20",
      event_address: "xxx street",
      key: "1",
    },
  ]);

  const addEvent = (event) => {
    async function uploadEvent(data) {
      let str = qs.stringify({
        uid: "1",
        appid: "capstone",
        access_token: "test_token",
        sign: "capstone",
        info: JSON.stringify({
          event_title: data.event_title,
          event_body: data.event_body,
          event_address: data.event_address,
          event_date: data.event_date,
          event_rating: data.event_rating
        }),
      });
      axios
        .post(
          "http://39.107.240.174/api/capstone/createevent",
          str
        )
        .then(function (response) {
          if (response.data.errno === 0) {
            console.log(response.data);
          }
        });
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
      axios
        .post(
          "http://39.107.240.174/api/capstone/getevents",
          qs.stringify({
            uid: "1",
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
            setEvents(response.data.list);
          }
        });
    }
    fetchEvents();
  }, []);

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
