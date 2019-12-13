import React from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import { redirect } from '~/utils/utils'
import { isValid } from '~/utils/auth'

export default WrappedPage => {
  const WithAuthGuard = props => <WrappedPage {...props} />

  WithAuthGuard.getInitialProps = ctx => {
    if (!isValid(nextCookie(ctx).token)) {
      redirect({ Router, ctx, location: '/' })
    }
    return WrappedPage.getInitialProps ? WrappedPage.getInitialProps(ctx) : {}
  }

  return WithAuthGuard
}
