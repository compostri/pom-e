import React, { useContext } from 'react'
import { Container, TextField, Paper, Typography, Button } from '@material-ui/core'
import Link from 'next/link'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { UserContext } from '~/context/UserContext'
import palette from '../variables'
import { useToasts, TOAST } from '~/components/Snackbar'

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
  h1: {
    color: palette.greyDark,
    fontSize: 20,
    fontWeight: '700'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 1),
    fontStyle: 'inherit'
  },
  forgotMdp: {
    color: palette.greyMedium,
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '400'
  }
}))

const LogIn = () => {
  const classes = useStyles()
  const { userContext } = useContext(UserContext)
  const { addToast } = useToasts()

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography className={classes.h1} component="h1" variant="h5">
          Se connecter
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LogInSchema}
          onSubmit={async values => {
            try {
              const response = await userContext.login(values)
              if (response.status === 200 && response.data.token) {
                const route = Router.query.ref || '/'
                Router.replace(route)
              } else {
                addToast('Une erreur est survenue', TOAST.ERROR)
              }
            } catch (e) {
              addToast('Combinaison d‘email et mot de passe incorrect', TOAST.ERROR)
            }
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
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
              <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submit}>
                Connexion
              </Button>
            </Form>
          )}
        </Formik>
        <Link href="/" passHref>
          <Button className={classes.forgotMdp}>Mot de passe oublié ?</Button>
        </Link>
      </Paper>
    </Container>
  )
}

export default LogIn
