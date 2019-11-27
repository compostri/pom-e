import React from 'react'
import { DefaultToastContainer } from 'react-toast-notifications'

const AppToastContainer = props => <DefaultToastContainer {...props} style={{ zIndex: 1500 }} />

export default AppToastContainer
