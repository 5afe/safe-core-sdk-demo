import CssBaseline from "@mui/material/CssBaseline";
import Header from "src/components/header/Header";

import GelatoRelayer from "src/pages/GelatoRelayer";
import Providers from "./components/providers/Providers";

function App() {
  return (
    <Providers>
      <>
        <CssBaseline />

        {/* App header */}
        <Header />

        {/* App Routes */}
        <GelatoRelayer />
      </>
    </Providers>
  );
}

export default App;
