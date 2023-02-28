type Chain = {
  id: string;
  token: string;
  rpcUrl: string;
  shortName: string;
  label: string;
  color?: string;
  icon?: string;
  blockExplorerUrl: string;
  transactionServiceUrl?: string;
};

export default Chain;
