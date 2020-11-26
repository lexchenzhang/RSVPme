import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";

// stacks
import HomeStack from "./homeStack";
import AboutStack from "./aboutStack";
import LoginStack from "./loginStack";
import CalendarStack from "./calendarStack";

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
});

export default createAppContainer(RootDrawerNavigator);
