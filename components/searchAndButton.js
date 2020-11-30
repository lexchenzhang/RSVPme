import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SearchAndButton({ placeholder, materialIcon, onSearch }) {
  let [textValue, setTextValue] = useState("")
  
  return (
    <View style={styles.card}>
      <TextInput style={styles.search} onChangeText={text => setTextValue(text)} autoCorrect={false} onSubmitEditing={() => onSearch(textValue)} placeholder={placeholder} multiline={false} />
      <TouchableOpacity style={styles.icon} onPress={() => onSearch(textValue)}>
        <MaterialIcons name={materialIcon} size={35}/>
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
    padding: 6,
    flexDirection: "row"
  },
  search: {
    borderRadius: 6,
    elevation: 3,
    fontSize: 25,
    marginRight: 'auto',
    width: "100%"
  },
  icon: {
    display: 'flex',
    alignSelf: 'flex-end',
    height: 'auto',
  }
});
