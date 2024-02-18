import React, { useState, createContext } from "react";

export const KeeperContext = createContext();

export function KeeperContextProvider(props) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <KeeperContext.Provider value={{ showRegister, setShowRegister }}>
      {props.children}
    </KeeperContext.Provider>
  );
}
