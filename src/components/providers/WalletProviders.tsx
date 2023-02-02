import { ReactNode } from "react";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

import chains from "src/chains/chains";
import safeLogo from "src/assets/safe-logo.svg";

// see https://www.npmjs.com/package/@web3-onboard/react

const injected = injectedModule();

// TODO: ADD WALLETCONNECT

const web3Onboard = init({
  wallets: [injected],
  chains: chains.map(({ transactionServiceUrl, shortName, ...chain }) => chain),
  appMetadata: {
    name: "Safe Account Abstraction POC",
    icon: safeLogo,
    description: "A demo of Safe Account Abstraction",
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
});

type WalletProvidersProps = {
  children?: ReactNode;
};

function WalletProviders({ children }: WalletProvidersProps) {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      {children}
    </Web3OnboardProvider>
  );
}

export default WalletProviders;
