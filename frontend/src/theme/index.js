import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
}

const theme = extendTheme({
  config,
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif'
  }
})

export default theme
