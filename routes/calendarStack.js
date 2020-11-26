import React from "react";
//import { Calendar } from "react-native-calendars";
import { createStackNavigator } from "react-navigation-stack";
//import calendars from "../pages/calendar";
import Header from "../components/header";
import Calendars from "../pages/calendar";

const screens = {
  Calendar: {
    screen: Calendars,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title="Calendar" />,
      };
    },
  },
};

const CalendarStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerStyle: { backgroundColor: "#ddd", height: 60 },
    headerTintColor: "#444",
  },
});

export default CalendarStack;