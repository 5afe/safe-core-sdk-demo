import { useEffect, useState } from "react";
import { useWallets } from "@web3-onboard/react";
import Safe from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { ethers } from "ethers";

function useSafeCoreSDK(safeAddress: string) {
  const [connectedWallet] = useWallets();

  const [safeSdk, setSafeSdk] = useState<Safe>();

  useEffect(() => {
    (async () => {
      if (connectedWallet && safeAddress) {
        const provider = new ethers.providers.Web3Provider(
          connectedWallet.provider
        );
        const safeOwner = provider.getSigner(0);

        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: safeOwner,
        });

        const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress });
        setSafeSdk(safeSdk);
      }
    })();
  }, [connectedWallet, safeAddress]);

  return safeSdk;
}

export default useSafeCoreSDK;
