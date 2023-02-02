import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/safe-core-sdk";

async function createSafeTransaction(
  safeSdk: Safe,
  safeTransactionData: SafeTransactionDataPartial
) {
  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData,
  });

  return safeTransaction;
}

export default createSafeTransaction;
