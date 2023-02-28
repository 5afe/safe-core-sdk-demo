import CssBaseline from "@mui/material/CssBaseline";
import Header from "src/components/header/Header";

import Providers from "./components/providers/Providers";
import AccountAbstractionDemo from "./pages/AccountAbstractionDemo";

function App() {
  return (
    <Providers>
      <>
        <CssBaseline />

        {/* App header */}
        <Header />

        {/* App Routes */}
        <AccountAbstractionDemo />
      </>
    </Providers>
  );
}

export default App;
