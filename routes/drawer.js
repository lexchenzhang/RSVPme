import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";

// stacks
import HomeStack from "./homeStack";
import AboutStack from "./aboutStack";
import LoginStack from "./loginStack";
import CalendarStack from "./calendarStack";
import FriendsStack from "./friendsStack";

// drawer navigation options
const RootDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStack,
  },
  About: {
    screen: AboutStack,
  },
  Login: {
    screen: LoginStack,
  },
  Calendar: {
    screen: CalendarStack,
  },
  Friends: {
    screen: FriendsStack,
  }
});

export default createAppContainer(RootDrawerNavigator);
