import React, { Component } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { globalStyles, images } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../components/card";

export default function EventDetails({ navigation }) {
  const rating = navigation.getParam("rating");
  const rows = [];
  for (var i = 0; i < rating; i++) {
    rows.push(<MaterialIcons name="star" size={24} key={i} />);
  }
  return (
    <View style={globalStyles.container}>
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
    paddingHorizontal: 200,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
