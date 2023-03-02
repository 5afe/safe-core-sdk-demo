import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import SafeInfo from "src/components/safe-info/SafeInfo";
import ConnectedWalletLabel from "src/components/connected-wallet-label/ConnectedWalletLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { useStepper } from "src/store/stepperContext";

// TODO: ADD Deployed / Non deployed safe labels

const AuthKitDemo = () => {
  const { connectWeb2Login, isOwnerConnected, safeSelected, chainId } =
    useAccountAbstraction();

  const { nextStep } = useStepper();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography textAlign="center">
        The{" "}
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit"
          target="_blank"
        >
          Auth kit
        </Link>{" "}
        authenticates a blockchain account using an email address, social media
        account, or traditional crypto wallets like Metamask. Check our{" "}
        <Link
          href="https://docs.gnosis-safe.io/learn/safe-core-account-abstraction-sdk/auth-kit"
          target="_blank"
        >
          Auth Kit documentation
        </Link>{" "}
        for more details!
      </Typography>

      {/* Connect Owner button */}
      {isOwnerConnected ? (
        <>
          <Typography textAlign="center" variant="h5" component="h3">
            You are authenticated!
          </Typography>

          {/* Next Step */}
          <Button variant="contained" onClick={nextStep}>
            Go to OnRamp Demo
          </Button>

          <Typography textAlign="center" variant="h6" component="h3">
            This is Your Safe (Contract Address)
          </Typography>

          {/* Safe Info */}
          {safeSelected && (
            <SafeInfo safeAddress={safeSelected} chainId={chainId} />
          )}

          <Typography textAlign="center" variant="h6" component="h3">
            This is Your Owner (EOA Address)
          </Typography>

          {/* Owner Info */}
          <ConnectedWalletLabel />
        </>
      ) : (
        <Button
          startIcon={<WalletIcon />}
          variant="contained"
          onClick={connectWeb2Login}
        >
          Connect
        </Button>
      )}

      <Typography textAlign="center" variant="h5" component="h2">
        How to use it
      </Typography>

      <Typography textAlign="center">
        This implementation is defined in our{" "}
        <Link
          href="https://github.com/5afe/account-abstraction-demo-ui/blob/main/src/store/accountAbstractionContext.ts#L94"
          target="_blank"
        >
          <code>accountAbstractionContext.tsx</code>
        </Link>{" "}
        file.
      </Typography>

      <CodeBlock
        text={code}
        language={"javascript"}
        showLineNumbers
        startingLineNumber={96}
        theme={atomOneDark}
      />
    </Box>
  );
};

export default AuthKitDemo;

const code = `try {
  const safeAuth = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
    chainId: chain.id,
    txServiceUrl: chain.transactionServiceUrl,
    authProviderConfig: {
      rpcTarget: chain.rpcUrl,
      clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || "",
      network: "testnet",
      theme: "dark",
    },
  });

  if (safeAuth) {
    const { safes, eoa } = await safeAuth.signIn();
    const provider =
      safeAuth.getProvider() as ethers.providers.ExternalProvider;

    // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
    setChainId(chain.id);
    setOwnerAddress(eoa);
    setSafes(safes || []);
    setWeb3Provider(new ethers.providers.Web3Provider(provider));
  }
} catch (error) {
  console.log("error: ", error);
}`;
