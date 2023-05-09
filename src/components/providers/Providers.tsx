import { ThemeProvider } from 'src/store/themeContext'
import { AccountAbstractionProvider } from 'src/store/accountAbstractionContext'

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <ThemeProvider>
      <AccountAbstractionProvider>{children}</AccountAbstractionProvider>
    </ThemeProvider>
  )
}

export default Providers
