import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Header({ title, navigation }) {
  const openMenu = () => {
    navigation.openDrawer();
  };

  return (
    <ImageBackground
      source={require("../assets/pics/game_bg.png")}
      style={styles.header}
    >
      <View
        style={{
          width: "100%",
          // backgroundColor: "red",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name="menu"
          size={28}
          onPress={openMenu}
          style={styles.icon}
        />
        <View style={styles.headerTitle}>
          <MaterialIcons name="face" size={28} style={styles.headerImage} />
          <Text style={styles.headerText}>{title}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get("screen").width,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    letterSpacing: 1,
  },
  icon: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 26,
    height: 26,
    marginHorizontal: 10,
  },
});
