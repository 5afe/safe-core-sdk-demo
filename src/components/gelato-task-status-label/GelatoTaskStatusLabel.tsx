import { useCallback } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { Theme } from "@mui/material";
import styled from "@emotion/styled";

import getGelatoTaskInfo from "src/api/getGelatoTaskInfo";
import useApi from "src/hooks/useApi";
import { LIGHT_THEME } from "src/theme/theme";
import { GelatoTask } from "src/models/gelatoTask";

type GelatoTaskStatusLabelProps = {
  gelatoTaskId: string;
};

const pollingTime = 4_000;

const GelatoTaskStatusLabel = ({
  gelatoTaskId,
}: GelatoTaskStatusLabelProps) => {
  const fetchGelatoTaskInfo = useCallback(
    (signal: AbortSignal) => getGelatoTaskInfo(gelatoTaskId, { signal }),
    [gelatoTaskId]
  );

  const { data: gelatoTaskInfo } = useApi(fetchGelatoTaskInfo, pollingTime);

  console.log("gelatoTaskInfo: ", gelatoTaskInfo);

  return (
    <Container
      component={Paper}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h6" component="h2">
        Gelato Task details
      </Typography>

      {/* Status label */}
      {gelatoTaskInfo?.taskState ? (
        <StatusContainer taskStatus={gelatoTaskInfo.taskState}>
          <Typography variant="body2">{gelatoTaskInfo.taskState}</Typography>
        </StatusContainer>
      ) : (
        <Skeleton variant="text" width={100} height={20} />
      )}
    </Container>
  );
};

export default GelatoTaskStatusLabel;

const Container = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
  padding: 16px;
`;

const StatusContainer = styled("div")<{
  theme?: Theme;
  taskStatus: GelatoTask["taskState"];
}>(
  ({ theme, taskStatus }) => `
    margin-right: 8px;
    border-radius: 4px;
    padding: 4px 12px;
    background-color: ${getGelatoTaskStatusColor(taskStatus, theme)};
    color: ${theme.palette.getContrastText(
      getGelatoTaskStatusColor(taskStatus, theme)
    )};
    `
);

const getGelatoTaskStatusColor = (
  taskStatus: GelatoTask["taskState"],
  theme: Theme
) => {
  const colors: Record<GelatoTask["taskState"], string> = {
    CheckPending: theme.palette.warning.light,
    WaitingForConfirmation: theme.palette.info.light,
    ExecPending: theme.palette.info.light,
    ExecSuccess: theme.palette.success.light,
    Cancelled: theme.palette.error.light,
  };

  return colors[taskStatus];
};
