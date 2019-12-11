import React from 'react'
import { Container, TextField, Paper, Typography, Button, CircularProgress, Grid, Box } from '@material-ui/core'

import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import api from '~/utils/api'
import { useToasts, TOAST } from '../components/Snackbar'
import PasswordChange from '~/components/forms/PasswordChange'
import ReinitPassword from '~/components/forms/ReinitPassword'

const ReinitSchema = Yup.object().shape({
  newPassword: Yup.string().required('Nouveau mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('plainPassword'), null], 'Les deux mots de passe doivent être identiques')
    .required('Confirmation du mot de passe requise')
})

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2)
    }
  },
  h1: {
    fontSize: 20,
    fontWeight: '700'
  },
  form: {
    width: '100%'
  }
}))

const Reinit = () => {
  const classes = useStyles()
  const router = useRouter()
  const { token } = router.query
  const { addToast } = useToasts()

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <Box mb={2}>
          <Typography className={classes.h1} component="h1" variant="h5">
            Réinitialisation du mot de passe
          </Typography>
          {token ? <Typography>Veuillez définir un nouveau mot de passe</Typography> : <Typography>Veuillez renseigner votre adresse email</Typography>}
        </Box>
        {token ? <PasswordChange /> : <ReinitPassword />}
      </Paper>
    </Container>
  )
}

export default Reinit
