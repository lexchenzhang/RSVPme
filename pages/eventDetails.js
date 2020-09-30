import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { globalStyles, images } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../components/card";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function EventDetails({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const rating = navigation.getParam("rating");
  const rows = [];
  for (var i = 0; i < rating; i++) {
    rows.push(<MaterialIcons name="star" size={24} key={i} />);
  }
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
                region={{
                  latitude: 33.577862,
                  longitude: -101.855164,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              ></MapView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Card>
        <Text style={{ ...globalStyles.titleText, ...styles.textTitle }}>
          {navigation.getParam("title")}
        </Text>
        <Text style={styles.textBody}>{navigation.getParam("body")}</Text>
        <Text style={styles.textDate}>{navigation.getParam("address")}</Text>
        <Text style={styles.textDate}>{navigation.getParam("date")}</Text>
        <View style={styles.rating}>
          <Text>Rating: </Text>
          {rows}
        </View>
        <MaterialIcons
          name="map"
          size={24}
          style={styles.modalToggle}
          onPress={() => setModalOpen(true)}
        />
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
});
