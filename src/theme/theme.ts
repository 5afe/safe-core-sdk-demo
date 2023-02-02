import {
  Theme,
  ThemeOptions,
  PaletteMode,
  responsiveFontSizes,
  createTheme,
} from "@mui/material";

export const DARK_THEME: PaletteMode = "dark";
export const LIGHT_THEME: PaletteMode = "light";

const themeOptions: ThemeOptions = {
  palette: {
    mode: DARK_THEME,
  },
};

const getTheme = (themeMode: PaletteMode): Theme => {
  return responsiveFontSizes(
    createTheme({
      ...themeOptions,
      palette: {
        ...themeOptions.palette,

        mode: themeMode,

        background:
          themeMode === LIGHT_THEME
            ? {
                default: "#f5f5f5", // light body background color
              }
            : {},
      },
    })
  );
};

export default getTheme;
