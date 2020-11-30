import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";

// stacks
import HomeStack from "./homeStack";
import LoginStack from "./loginStack";
import FriendsStack from "./friendsStack";

// drawer navigation options
let RootDrawerNavigator = createDrawerNavigator({
  Login: {
    screen: LoginStack,
  },
  Home: {
    screen: HomeStack,
  },
  Friends: {
    screen: FriendsStack,
  },
});

export default createAppContainer(RootDrawerNavigator);
