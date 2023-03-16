import { useCallback, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import "@safe-global/safe-react-components/dist/fonts.css";

import Intro from "src/pages/Intro";
import AuthKitDemo from "src/pages/AuthKitDemo";
import OnRampKitDemo from "src/pages/OnRampKitDemo";
import RelayerKitDemo from "src/pages/RelayerKitDemo";
import LastStep from "src/pages/LastStep";
import Header from "src/components/header/Header";
import Providers from "src/components/providers/Providers";
import SafeCoreInfo from "./components/safe-core-info/SafeCoreInfo";
import NavMenu from "./components/nav-menu/NavMenu";

const FIRST_STEP = 0;
const LAST_STEP = 4;

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = useCallback(() => {
    setActiveStep((activeStep) => activeStep + 1);
  }, []);

  const previousStep = useCallback(() => {
    setActiveStep((activeStep) => activeStep - 1);
  }, []);

  const setStep = useCallback((newStep: number) => {
    setActiveStep(newStep);
  }, []);

  const isFirstStep = activeStep === FIRST_STEP;
  const isLastStep = activeStep === LAST_STEP;

  const showSafeCoreVideo = isFirstStep || isLastStep;

  return (
    <Providers>
      <>
        <CssBaseline />

        {/* App header */}
        <Header setStep={setStep} />

        <Box
          display="flex"
          gap={3}
          alignItems="flex-start"
          maxWidth="1200px"
          margin="120px auto 42px auto"
        >
          {showSafeCoreVideo ? (
            <SafeCoreInfo />
          ) : (
            <NavMenu setStep={setStep} activeStep={activeStep} />
          )}

          {/* TODO: create Array of steps */}
          <main style={{ flexGrow: 1 }}>
            {/* Intro Step */}
            {isFirstStep && <Intro nextStep={nextStep} />}

            {/* Auth kit Step */}
            {activeStep === 1 && (
              <AuthKitDemo previousStep={previousStep} nextStep={nextStep} />
            )}

            {/* Onramp kit Step */}
            {activeStep === 2 && (
              <OnRampKitDemo previousStep={previousStep} nextStep={nextStep} />
            )}

            {/* Relay kit Step */}
            {activeStep === 3 && (
              <RelayerKitDemo previousStep={previousStep} nextStep={nextStep} />
            )}

            {/* Final Screen */}
            {isLastStep && <LastStep previousStep={previousStep} />}
          </main>
        </Box>
      </>
    </Providers>
  );
}

export default App;
