import { createContext, useContext, useEffect } from "react";
import { PaletteMode, Theme } from "@mui/material";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import {
  SafeThemeProvider,
  useThemeMode,
} from "@safe-global/safe-react-components";

import useLocalStorageState from "src/hooks/useLocalStorageState";

const STORAGE_KEY_THEME_MODE = "THEME_MODE_REACT_SERVICE_STATUS_KEY";

export const DARK_THEME: PaletteMode = "dark";
export const LIGHT_THEME: PaletteMode = "light";

type themeContextValue = {
  themeMode: PaletteMode;
  switchThemeMode: () => void;
  isDarkTheme: boolean;
  isLightTheme: boolean;
};

const initialState = {
  themeMode: DARK_THEME,
  switchThemeMode: () => {},
  isDarkTheme: true,
  isLightTheme: false,
};

const themeContext = createContext<themeContextValue>(initialState);

const useTheme = () => {
  const context = useContext(themeContext);

  if (!context) {
    throw new Error("useTheme should be used within a ThemeContext Provider");
  }

  return context;
};

const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  const [initialThemeMode, setInitialThemeMode] =
    useLocalStorageState<PaletteMode>(
      STORAGE_KEY_THEME_MODE, // local storage key
      DARK_THEME // default value
    );

  const { themeMode, switchThemeMode } = useThemeMode(initialThemeMode);

  const isDarkTheme = themeMode === DARK_THEME;
  const isLightTheme = themeMode === LIGHT_THEME;

  useEffect(() => {
    setInitialThemeMode(themeMode);
  }, [themeMode, setInitialThemeMode]);

  const state = {
    themeMode,

    switchThemeMode,

    isDarkTheme,
    isLightTheme,
  };

  return (
    <themeContext.Provider value={state}>
      <SafeThemeProvider mode={themeMode}>
        {(safeTheme: Theme) => (
          <MUIThemeProvider theme={safeTheme}>{children}</MUIThemeProvider>
        )}
      </SafeThemeProvider>
    </themeContext.Provider>
  );
};

export { useTheme, ThemeProvider };
