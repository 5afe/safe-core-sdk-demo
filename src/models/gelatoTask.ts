export type GelatoTask = {
  chainId: number;
  creationDate: string;
  taskId: string;
  taskState:
    | "CheckPending"
    | "WaitingForConfirmation"
    | "ExecPending"
    | "ExecSuccess"
    | "Cancelled";

  transactionHash?: string;
  executionDate?: string;
  lastCheckMessage?: string;
  blockNumber?: number;
};
