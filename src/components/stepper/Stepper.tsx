import { ReactNode } from "react";
import StepperMUI from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Container from "@mui/material/Container";
import styled from "@emotion/styled";

import BackgroundSafe from "src/components/background-safe/BackgroundSafe";
import { useStepper } from "src/store/stepperContext";

type StepperType = {
  children: ReactNode[];
  labels: string[];
};

const Stepper = ({ children, labels }: StepperType) => {
  const { activeStep } = useStepper();

  return (
    <StepperContainer>
      <StepperMUI activeStep={activeStep} sx={{ marginBottom: "24px" }}>
        {labels.map((label) => (
          <Step key={label}>
            {/* Stepper labels */}
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </StepperMUI>

      {/* Background Safe particles */}
      <BackgroundSafe />

      {/* Current step component */}
      <StepperContentWrapper component="main">
        {children[activeStep]}
      </StepperContentWrapper>
    </StepperContainer>
  );
};

export default Stepper;

const StepperContainer = styled("div")`
  max-width: 800px;
  margin: 16px auto;
`;

const StepperContentWrapper = styled(Container)<{
  component: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;
