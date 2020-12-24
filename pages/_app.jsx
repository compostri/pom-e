/* eslint-disable react/jsx-props-no-spreading */
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
import Head from 'next/head'

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    // eslint-disable-next-line no-undef
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
            <Head>
              <meta charSet="utf-8" />
              <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
              {/* PWA primary color */}
              <meta name="theme-color" content={theme.palette.primary.main} />
              <link rel="icon" href="/favicon.ico" />
              <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
              <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#a4c538" />
              <meta name="msapplication-TileColor" content="#a4c538" />

              <link rel="manifest" href="/manifest.json" />
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Sans:400,700&display=swap" />
              <title>Pom-e</title>
            </Head>
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
