import React, { useState, createContext } from "react";

export const RegionContext = createContext();

export const RegionContextProvider = (props) => {
  const [region, setRegion] = useState({
    latitude: 33.577862,
    longitude: -101.855164,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  return (
    <RegionContext.Provider value={[region, setRegion]}>
      {props.children}
    </RegionContext.Provider>
  );
};
