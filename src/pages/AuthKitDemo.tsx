import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
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
      <Box
        component={Paper}
        sx={{ border: "1px solid #fff" }}
        padding="18px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography textAlign="center">
          The{" "}
          <Link
            href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit"
            target="_blank"
          >
            Auth kit
          </Link>{" "}
          authenticates a blockchain account using an email address, social
          media account, or traditional crypto wallets like Metamask. Check our{" "}
          <Link
            href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/auth-kit"
            target="_blank"
          >
            Auth Kit documentation
          </Link>{" "}
          for more details!
        </Typography>
      </Box>

      {/* Connect Owner button */}
      {isOwnerConnected ? (
        <>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            component={Paper}
            sx={{ border: "1px solid #fff" }}
            padding="18px 8px"
          >
            <Typography textAlign="center" variant="h4" component="h2">
              Now you are authenticated!
            </Typography>

            <Box display="flex" flexDirection="row" gap={3}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                flexBasis={"50%"}
              >
                <Typography textAlign="center" variant="h6" component="h3">
                  Safe Account
                </Typography>

                <Typography textAlign="center">
                  Your Safe account (Smart Contract) hold and protect your
                  assets
                </Typography>

                {/* Safe Info */}
                {safeSelected && (
                  <SafeInfo safeAddress={safeSelected} chainId={chainId} />
                )}
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                flexBasis={"50%"}
              >
                <Typography textAlign="center" variant="h6" component="h3">
                  Owner Account
                </Typography>
                <Typography textAlign="center">
                  Your Owner account signs transactions to unlock your assets
                </Typography>
                {/* Owner Info */}
                <ConnectedWalletLabel />
              </Box>
            </Box>

            {/* Next Step */}
            <Button variant="contained" onClick={nextStep}>
              Go to OnRamp Demo
            </Button>
          </Box>
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

      <Box
        component={Paper}
        sx={{ border: "1px solid #fff" }}
        padding="18px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography textAlign="center" variant="h5" component="h2">
          How to use it
        </Typography>

        <Typography textAlign="center">
          This implementation is defined in our{" "}
          <Link
            href="https://github.com/5afe/account-abstraction-demo-ui/blob/main/src/store/accountAbstractionContext.tsx#L94"
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
    </Box>
  );
};

export default AuthKitDemo;

const code = `import { SafeAuthKit, SafeAuthProviderType } from '@safe-global/auth-kit'

const safeAuthKit = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
  chainId: '0x5',
  authProviderConfig: {
    rpc: <Your rpc url>, // Add your RPC e.g. https://goerli.infura.io/v3/<your project id>
    clientId: <Your client id>, // Add your client id. Get it from the Web3Auth dashboard
    network: 'testnet' | 'mainnet', // The network to use for the Web3Auth modal.
    theme: 'light' | 'dark' // The theme to use for the Web3Auth modal
  }
})

// Allow to login and get the derived eoa
safeAuthKit.signIn()

// Logout
safeAuthKit.signOut()

// Get the provider
safeAuthKit.getProvider()

`;
