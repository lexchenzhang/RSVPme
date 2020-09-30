import React, { useState } from "react";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import Navigator from "./routes/drawer";
import { RegionContextProvider, RegionContext } from "./components/region";

const getFonts = () => {
  return Font.loadAsync({
    "font-regular": require("./assets/fonts/Solway-Regular.ttf"),
    "font-bold": require("./assets/fonts/Solway-Bold.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  if (fontsLoaded) {
    return (
      <RegionContextProvider>
        <Navigator />
      </RegionContextProvider>
    );
  } else {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => setFontsLoaded(true)} />
    );
  }
}
