import { CodeBlock, atomOneDark } from 'react-code-blocks'
import Box from '@mui/material/Box'
import { Theme } from '@mui/material'
import styled from '@emotion/styled'

type CodeType = {
  text: string
  language: string
}

function Code({ text, language }: CodeType) {
  return (
    <CodeContainer>
      <CodeBlock text={text} language={language} showLineNumbers theme={atomOneDark} />
    </CodeContainer>
  )
}

export default Code

const CodeContainer = styled(Box)<{
  theme?: Theme
}>(
  ({ theme }) => `
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 16px;
`
)
