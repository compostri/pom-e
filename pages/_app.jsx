import React from 'react'
import App from 'next/app'
import CssBaseline from '@material-ui/core/CssBaseline'
import nextCookie from 'next-cookies'
import { ThemeProvider } from '@material-ui/styles'
import { ToastProvider } from 'react-toast-notifications'
import theme from '~/theme'
import UserProvider from '~/context/UserContext'
import Snackbar from '../components/Snackbar'
import AppToastContainer from '~/components/AppToastContainer'

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps, token } = this.props
    return (
      <ThemeProvider theme={theme}>
        <ToastProvider autoDismissTimeout={2500} components={{ Toast: Snackbar, ToastContainer: AppToastContainer }}>
          <UserProvider token={token}>
            <CssBaseline />
            <Component {...pageProps} />
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    )
  }
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = nextCookie(ctx)
  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps, token }
}

export default MyApp
