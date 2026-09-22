import { createContext, useContext, useState } from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <UiContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error("useUi must be used inside UiProvider");
  return value;
}
