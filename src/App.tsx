import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Header from "src/components/header/Header";

import WalletProviders from "src/components/providers/WalletProviders";
import useTheme from "src/hooks/useTheme";
import GelatoRelayer from "src/pages/GelatoRelayer";

function App() {
  const { theme, switchThemeMode, isDarkTheme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <WalletProviders>
        <CssBaseline />

        {/* App header */}
        <Header isDarkTheme={isDarkTheme} switchThemeMode={switchThemeMode} />

        {/* App Routes */}
        <GelatoRelayer />
      </WalletProviders>
    </ThemeProvider>
  );
}

export default App;
