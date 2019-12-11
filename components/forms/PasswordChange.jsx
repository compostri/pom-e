import React from 'react'
import { TextField, Button, CircularProgress, Grid, Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import api from '~/utils/api'
import { useToasts, TOAST } from '../Snackbar'

const PasswordChangeSchema = Yup.object().shape({
  newPassword: Yup.string().required('Nouveau mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Les deux mots de passe doivent être identiques')
    .required('Confirmation du mot de passe requise')
})

/**
 * Permet de confirmer son compte et changer son mdp
 * ou de reset le password
 */

const useStyles = makeStyles(() => ({
  form: {
    width: '100%'
  }
}))

const PasswordChange = () => {
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
      if (res.status === 201) {
        resetForm(initialValues)
        addToast('Votre mot de passe a bien été modifié ! Vous allez être redirigé...', TOAST.SUCCESS)
        router.push('/login')
      } else {
        addToast('Une erreur a eu lieu', TOAST.ERROR)
      }
    } catch (error) {
      addToast('Une erreur a eu lieu', TOAST.ERROR)
    }
    setSubmitting(false)
  }

  return (
    <Formik initialValues={initialValues} validationSchema={PasswordChangeSchema} enableReinitialize onSubmit={submit}>
      {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
        <Form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{ type: 'password' }}
                label="Nouveau mot de passe"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.newPassword && touched.newPassword}
                helperText={errors.newPassword && touched.newPassword ? errors.newPassword : null}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
  )
}

PasswordChange.propTypes = {
  cb: PropTypes.func.isRequired
}

export default PasswordChange
