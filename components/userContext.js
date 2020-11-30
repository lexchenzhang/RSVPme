import React, { createContext, useState } from "react";

export const UserContext = createContext();

// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  const [uid, setUID] = useState("null");

  return (
    <UserContext.Provider
      value={{
        uid,
        setUID,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
