import { ThemeProvider } from "src/store/themeContext";
import { AccountAbstractionProvider } from "src/store/accountAbstractionContext";
import { StepperProvider } from "src/store/stepperContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <ThemeProvider>
      <AccountAbstractionProvider>
        <StepperProvider>{children}</StepperProvider>
      </AccountAbstractionProvider>
    </ThemeProvider>
  );
};

export default Providers;
