import { ThemeProvider } from "src/store/themeContext";
import { WalletProvider } from "src/store/walletContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <ThemeProvider>
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  );
};

export default Providers;
