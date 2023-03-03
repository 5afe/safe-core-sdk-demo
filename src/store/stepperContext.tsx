import { createContext, useCallback, useContext, useState } from "react";

type stepperContextValue = {
  activeStep: number;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (newStep: number) => void;
};

const initialState = {
  activeStep: 0,
  nextStep: () => {},
  previousStep: () => {},
  setStep: () => {},
};

const stepperContext = createContext<stepperContextValue>(initialState);

const useStepper = () => {
  const context = useContext(stepperContext);

  if (!context) {
    throw new Error("useStepper should be used within Stepper Provider");
  }

  return context;
};

const StepperProvider = ({ children }: { children: JSX.Element }) => {
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

  const state = {
    activeStep,

    nextStep,
    previousStep,
    setStep,
  };

  return (
    <stepperContext.Provider value={state}>{children}</stepperContext.Provider>
  );
};

export { useStepper, StepperProvider };
