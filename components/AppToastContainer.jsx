import React from 'react'
import { DefaultToastContainer } from 'react-toast-notifications'
import theme from '~/theme'

const AppToastContainer = props => <DefaultToastContainer {...props} style={{ zIndex: theme.zIndex.snackbar }} />

export default AppToastContainer
