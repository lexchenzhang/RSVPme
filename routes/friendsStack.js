import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Friends from "../pages/friends";
import Header from "../components/header";

const screens = {
  Friends: {
    screen: Friends,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Friends" />,
      };
    },
  },
};

const FriendsStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerStyle: { backgroundColor: "#ddd", height: 60 },
    headerTintColor: "#444",
  },
});

export default FriendsStack;
