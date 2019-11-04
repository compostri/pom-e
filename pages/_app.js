import React from 'react'
import App from 'next/app'
import CssBaseline from '@material-ui/core/CssBaseline'

import { ThemeProvider } from '@material-ui/styles'
import theme from '../theme'
import UserProvider from '../context/UserContext'

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <UserProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    )
  }
}

export default MyApp
