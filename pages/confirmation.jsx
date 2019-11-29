import React from 'react'
import { Container, TextField, Paper, Typography, Button, CircularProgress, Grid, Box } from '@material-ui/core'

import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import api from '~/utils/api'
import { useToasts, TOAST } from '../components/Snackbar'

const ConfirmationSchema = Yup.object().shape({
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
    padding: theme.spacing(4)
  },
  form: {
    width: '100%'
  }
}))

const Confirmation = () => {
  const classes = useStyles()
  const router = useRouter()
  const { token } = router.query
  const { addToast } = useToasts()
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
    token
  }

  async function submit(values, { resetForm, setSubmitting }) {
    try {
      const res = await api.validate(values)
      if (res.status === 200) {
        resetForm(initialValues)
        addToast('Votre compte a bien été confirmé ! Vous allez être redirigé<div className=""></div>', TOAST.SUCCESS)
      } else {
        addToast('Une erreur a eu lieu', TOAST.ERROR)
      }
    } catch (error) {
      addToast('Une erreur a eu lieu', TOAST.ERROR)
    }
    setSubmitting(false)
  }

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <Box mb={2}>
          <Typography component="h1" variant="h2">
            Confirmation du compte
          </Typography>
          <Typography>Afin de confirmer votre compte, veuillez définir un nouveau mot de passe</Typography>
        </Box>
        {token ? (
          <Formik initialValues={initialValues} validationSchema={ConfirmationSchema} enableReinitialize onSubmit={submit}>
            {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{ type: 'password' }}
                      label="Nouveau mot de passe"
                      name="plainPassword"
                      value={values.plainPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.plainPassword && touched.plainPassword}
                      helperText={errors.plainPassword && touched.plainPassword ? errors.plainPassword : null}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{ type: 'password' }}
                      label="Confirmer le mot de passe"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.confirmPassword && touched.confirmPasswords}
                      helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : null}
                    />
                  </Grid>
                </Grid>
                <Box my={2} align="center">
                  <Button type="submit" variant="contained" color="secondary">
                    {isSubmitting ? <CircularProgress size={24} /> : 'Envoyer'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <Typography>Le jeton d&apos;authentification est manquant</Typography>
        )}
      </Paper>
    </Container>
  )
}

export default Confirmation
