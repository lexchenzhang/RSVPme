import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import About from "../pages/about";
import Header from "../components/header";

const screens = {
  About: {
    screen: About,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="About" />,
      };
    },
  },
};

const AboutStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerStyle: { backgroundColor: "#ddd", height: 60 },
    headerTintColor: "#444",
  },
});

export default AboutStack;
