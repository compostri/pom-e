import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import classNames from 'classnames'
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { CheckCircle, Error, Info, Close, Warning } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

import palette from '../variables'

const toastStyles = makeStyles(
  theme => ({
    success: {
      color: green[700]
    },
    error: {
      color: theme.palette.error.dark
    },
    info: {
      color: theme.palette.primary.dark
    },
    warning: {
      color: theme.palette.error.dark
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    defaultColor: {
      color: palette.white
    },
    snack: {
      zIndex: 1500
    }
  }),
  { name: 'HookToast', index: 10 }
)

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info
}

export const TOAST = {
  SUCCESS: { appearance: 'success' },
  ERROR: { appearance: 'error' },
  INFO: { appearance: 'info' },
  WARNING: { appearance: 'warning' }
}

export { useToasts }

export default function MNSnackbar({ className, action, appearance, children, autoDismissTimeout = 4000, ...other }) {
  const classes = toastStyles()
  const [openSnackBar, setOpenSnackBar] = useState(true)

  // Extra action can be passed as callback, mostly like an action button to Undo, to go to some other page, etc.

  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackBar(false)
  }

  let extras = []
  if (action) {
    extras = [...action]
  }

  const Icon = variantIcon[appearance]
  return (
    <Snackbar
      className={classes.snack}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={onClose}
      open={openSnackBar}
      autoHideDuration={autoDismissTimeout}
    >
      <SnackbarContent
        className={classNames(classes[appearance], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            <span className={classes.defaultColor}>{children}</span>
          </span>
        }
        action={[
          ...extras,
          <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
            <Close className={classes.icon} />
          </IconButton>
        ]}
        {...other}
      />
    </Snackbar>
  )
}
