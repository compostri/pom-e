import React, { useContext } from 'react'
import { Typography, Button, TextField, Box, CircularProgress, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import * as Yup from 'yup'

import { Formik, Form } from 'formik'
import api from '~/utils/api'
import palette from '~/variables'
import { useToasts, TOAST } from '../Snackbar'
import { ComposterContext } from '~/context/ComposterContext'

const useStyles = makeStyles(theme => ({
  smallTxt: {
    color: palette.greyMedium,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: theme.spacing(2)
  }
}))

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Veuillez entrer un email.')
    .required('Le champ email est obligatoire'),
  username: Yup.string().required('Le pseudo est obligatoire'),
  firstname: Yup.string().required('Le prénom est obligatoire'),
  lastname: Yup.string().required('Le nom est obligatoire')
})

const RegisterForm = ({ handleClose }) => {
  const { addToast } = useToasts()
  const classes = useStyles()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)

  const submit = async (values, { setSubmitting }) => {
    // On cherche la relation du user en cours et on l'update

    const addRelation = await api.createUserComposter({ user: { ...values }, composter: composter['@id'] })
    if (addRelation.status === 201) {
      addToast('Votre invitation a bien été envoyée.', TOAST.SUCCESS)
    } else {
      addToast('Une erreur a eu lieu', TOAST.ERROR)
    }

    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{
        lastname: '',
        firstname: '',
        username: '',
        plainPassword: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, ''),
        userConfirmedAccountURL: `${window.location.origin}/confirmation`,
        email: ''
      }}
      validationSchema={RegisterSchema}
      enableReinitialize
      onSubmit={submit}
    >
      {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                label="Nom"
                name="lastname"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastname && touched.lastname}
                helperText={errors.lastname && touched.lastname ? errors.lastname : null}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                label="Prénom"
                name="firstname"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstname && touched.firstname}
                helperText={errors.firstname && touched.firstname ? errors.firstname : null}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                label="Pseudo"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.username && touched.username}
                helperText={errors.username && touched.username ? errors.username : null}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : null}
              />
            </Grid>
          </Grid>
          <Box my={2} align="center">
            <Button type="submit" variant="contained" color="secondary">
              {isSubmitting ? <CircularProgress /> : 'Envoyer'}
            </Button>
          </Box>
          <Typography className={classes.smallTxt}>Attention ! L’ouvreur devra accepter l’invitation reçue par email avant d’être actif.</Typography>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
