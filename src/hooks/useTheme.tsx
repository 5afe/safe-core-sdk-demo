import { useCallback, useMemo } from "react";
import { PaletteMode, Theme } from "@mui/material";

import getTheme, { DARK_THEME, LIGHT_THEME } from "src/theme/theme";
import useLocalStorageState from "src/hooks/useLocalStorageState";

type useThemeReturnValue = {
  theme: Theme;
  themeMode: PaletteMode;
  switchThemeMode: () => void;
  isDarkTheme: boolean;
  isLightTheme: boolean;
};

const STORAGE_KEY_THEME_MODE = "THEME_MODE_REACT_SERVICE_STATUS_KEY";

function useTheme(): useThemeReturnValue {
  const [themeMode, setThemeMode] = useLocalStorageState<PaletteMode>(
    STORAGE_KEY_THEME_MODE, // key
    DARK_THEME // initial value
  );

  const switchThemeMode = useCallback(() => {
    setThemeMode((prevThemeMode: PaletteMode) => {
      const isDarkTheme = prevThemeMode === DARK_THEME;
      return isDarkTheme ? LIGHT_THEME : DARK_THEME;
    });
  }, [setThemeMode]);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const isDarkTheme = themeMode === DARK_THEME;
  const isLightTheme = themeMode === LIGHT_THEME;

  return {
    theme,
    themeMode,
    switchThemeMode,

    isDarkTheme,
    isLightTheme,
  };
}

export default useTheme;
