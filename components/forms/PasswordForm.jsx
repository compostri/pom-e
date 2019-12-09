import React, { useContext } from 'react'
import { Button, TextField, Grid, CircularProgress, Box } from '@material-ui/core'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { UserContext } from '~/context/UserContext'
import { useToasts, TOAST } from '../Snackbar'

const validationSchema = Yup.object({
  oldPassword: Yup.string().required('Ancien mot de passe requis'),
  plainPassword: Yup.string().required('Nouveau mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('plainPassword'), null], 'Les deux mots de passe doivent être identiques')
    .required('Confirmation du mot de passe requise')
})

const initialValues = {
  oldPassword: '',
  plainPassword: '',
  confirmPassword: ''
}

/**
 * Permet de changer le mot de passe dans le profil
 */

const PasswordForm = () => {
  const { userContext } = useContext(UserContext)
  const { addToast } = useToasts()

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const res = await userContext.updateUser(values)
    if (res.status === 200) {
      setSubmitting(false)
      resetForm(initialValues)
      addToast('Les modifications ont bien été prise en compte.', TOAST.SUCCESS)
    } else {
      addToast('Une erreur a eu lieu', TOAST.ERROR)
    }
  }
  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{ type: 'password' }}
                label="Ancien mot de passe"
                name="oldPassword"
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.oldPassword && touched.oldPassword}
                helperText={errors.oldPassword && touched.oldPassword ? errors.oldPassword : null}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              &nbsp;
            </Grid>
            <Grid item xs={12} md={6}>
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
          <Box align="center">
            <Button type="submit" variant="contained" color="primary">
              {isSubmitting ? <CircularProgress size={24} /> : 'Modifier mon mot de passe'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default PasswordForm
