import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function FriendCard({ username, onRemove, removeIcon }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{username}</Text>
      <TouchableOpacity style={styles.icon} onPress={onRemove}>
        <MaterialIcons name={removeIcon} size={35}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: 'center',
    paddingLeft: 6
  },
  name: {
    display: 'flex',
    alignSelf: 'flex-start',
    fontSize: 30,
    marginRight: 'auto'
  },
  icon: {
    display: 'flex',
    alignSelf: 'flex-end',
    height: 'auto',
  }
});
