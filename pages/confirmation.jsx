import React from 'react'
import { Container, Paper, Typography, Box } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import PasswordChange from '~/components/forms/PasswordChange'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  paper: {
    padding: theme.spacing(4)
  }
}))

const Confirmation = () => {
  const classes = useStyles()
  const router = useRouter()
  const { token } = router.query

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <Box mb={2}>
          <Typography component="h1" variant="h2">
            Confirmation du compte
          </Typography>
          <Typography>Afin de confirmer votre compte, veuillez définir un nouveau mot de passe</Typography>
        </Box>
        {token ? <PasswordChange /> : <Typography>Le jeton d&apos;authentification est manquant</Typography>}
      </Paper>
    </Container>
  )
}

export default Confirmation
