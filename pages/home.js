import React, { useState } from "react";
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

export default function Home({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      title: "Game Day",
      rating: 5,
      body: "This game is TTU vs xxx which hold on xxx.",
      date: "2020/09/20",
      address: "xxx street",
      key: "1",
    },
  ]);

  const addEvent = (event) => {
    event.key = Math.random().toString();
    setEvents((currentEvents) => {
      return [event, ...currentEvents];
    });
    setModalOpen(false);
  };

  // axios
  //   .post(
  //     "http://39.107.240.174/api/capstone/getevents?uid=1&appid=capstone&access_token=test_token&sign=capstone&info="
  //   )
  //   .then(function (response) {
  //     console.log(response.data.list);
  //   });

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
              <Text style={globalStyles.titleText}>{item.title}</Text>
            </Card>
          </TouchableOpacity>
        )}
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
