import React from 'react'
import { TextField, Button, CircularProgress, Grid, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import api from '~/utils/api'
import { useToasts, TOAST } from '../Snackbar'

const ReinitPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Veuillez entrer un email')
    .required('Email requis')
})

/**
 * Permet de reset le password via une adresse email
 * A mettre en relation avec le fichier PasswordChange
 */

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%'
  }
}))

const ReinitPassword = () => {
  const classes = useStyles()
  const { addToast } = useToasts()
  const initialValues = {
    email: ''
  }

  async function submit(values, { resetForm, setSubmitting }) {
    try {
      const res = await api.reinit({ ...values, newPasswordUrl: `${window.location.origin}/reinitialisation` })
      if (res.status === 201) {
        resetForm(initialValues)
        addToast('Un email vous a été adressé.', TOAST.SUCCESS)
      } else {
        addToast('Une erreur a eu lieu', TOAST.ERROR)
      }
    } catch (error) {
      const err = error.response.data ? error.response.data['hydra:description'] : 'Une erreur a eu lieu'
      addToast(err, TOAST.ERROR)
    }
    setSubmitting(false)
  }

  return (
    <Formik initialValues={initialValues} validationSchema={ReinitPasswordSchema} enableReinitialize onSubmit={submit}>
      {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
        <Form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
              {isSubmitting ? <CircularProgress size={24} /> : 'Envoyer'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default ReinitPassword
