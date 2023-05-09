import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import OpenInNew from '@mui/icons-material/OpenInNew'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'

import useMemoizedAddressLabel from 'src/hooks/useMemoizedAddressLabel'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

type AddressLabelProps = {
  address: string
  isTransactionAddress?: boolean
  showBlockExplorerLink?: boolean
  showCopyIntoClipboardButton?: boolean
}

const AddressLabel = ({
  address,
  isTransactionAddress,
  showBlockExplorerLink,
  showCopyIntoClipboardButton = true
}: AddressLabelProps) => {
  const { chain } = useAccountAbstraction()

  const addressLabel = useMemoizedAddressLabel(address)

  const blockExplorerLink = `${chain?.blockExplorerUrl}/${
    isTransactionAddress ? 'tx' : 'address'
  }/${address}`

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" component="span">
      <Tooltip title={address}>
        <span>{addressLabel}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip
          title={`Copy this ${
            isTransactionAddress ? 'transaction hash' : 'address'
          } into your clipboard`}
        >
          <IconButton
            onClick={() => navigator?.clipboard?.writeText?.(address)}
            size={'small'}
            color="inherit"
          >
            <FileCopyOutlinedIcon sx={{ fontSize: '14px' }} color="primary" />
          </IconButton>
        </Tooltip>
      )}

      {/* Button to etherscan */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip title={'View details on block explorer'}>
          <IconButton
            component="a"
            href={blockExplorerLink}
            target="_blank"
            rel="noopener"
            size={'small'}
            color="inherit"
          >
            <OpenInNew sx={{ fontSize: '14px' }} color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  )
}

export default AddressLabel
