import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../pages/login";
import Header from "../components/header";

const screens = {
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Login" />,
      };
    },
  },
};

const LoginStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerStyle: { backgroundColor: "#ddd", height: 60 },
    headerTintColor: "#444",
  },
});

export default LoginStack;
