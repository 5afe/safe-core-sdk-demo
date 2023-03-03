import styled from "@emotion/styled";

import safeParticles from "src/assets/safe-particles.svg";

const BackgroundSafe = () => {
  return (
    <Wrapper>
      <img
        id="safe-background"
        src={safeParticles}
        alt="background logo"
        height="500px"
      />
    </Wrapper>
  );
};

export default BackgroundSafe;

const Wrapper = styled("div")`
  position: absolute;

  left: 50%;
  margin-left: -250px; /* Negative half of width. */

  margin-top: 12px;

  z-index: -1;

  animation: scale-up-down 15s cubic-bezier(0, 1, 0.06, 1.03) infinite;
  @keyframes scale-up-down {
    0% {
      transform: scale(0);
    }

    10% {
      transform: scale(1);
    }

    90% {
      transform: scale(1);
    }

    to {
      transform: scale(0);
    }
  }
`;
