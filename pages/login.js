import React, { useState, useContext } from 'react'
import { Container, TextField, Paper, Typography, Button, Snackbar, SnackbarContent } from '@material-ui/core'
import Link from 'next/link'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import api from '../utils/api'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { UserContext } from '../context/UserContext'

const LogInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email non valide')
    .required('Email requis'),
  password: Yup.string().required('Mot de passe requis')
})

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4, 8)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 1)
  }
}))

const LogIn = () => {
  const classes = useStyles()
  const { userContext } = useContext(UserContext)

  const [snackBarMessage, setSnackBarMessage] = useState(false)

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Se connecter
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LogInSchema}
          onSubmit={async values => {
            userContext.login(values)
            // try {

            //   if (response.status === 200 && response.data.token) {
            //     Router.replace('/')
            //   } else {
            //     setSnackBarMessage('Une erreur est survenue')
            //   }
            // } catch (e) {
            //   setSnackBarMessage('Combinaison d‘email et mot de passe incorrect')
            // }
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                value={values.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                autoFocus
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : undefined}
              />
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                error={errors.password && touched.password}
                helperText={errors.password && touched.password ? errors.password : undefined}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                Connexion
              </Button>
            </Form>
          )}
        </Formik>
        <Link href="/" passHref>
          <Button>Forgot password?</Button>
        </Link>

        <Snackbar open={snackBarMessage} onClose={() => setSnackBarMessage(false)}>
          <SnackbarContent variant="error" message={snackBarMessage} />
        </Snackbar>
      </Paper>
    </Container>
  )
}

export default LogIn
