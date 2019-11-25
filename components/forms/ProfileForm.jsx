import React, { useContext } from 'react'
import { Button, TextField, Grid, CircularProgress, Box } from '@material-ui/core'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { UserContext } from '~/context/UserContext'
import { useToasts, TOAST } from '../Snackbar'

const profile = Yup.object().shape({
  lastname: Yup.string().required('Nom requis'),
  firstname: Yup.string().required('Prénom requis'),
  email: Yup.string()
    .email('Email non valide')
    .required('Email requis'),
  username: Yup.string().required('Pseudo requis')
})

const ProfileForm = () => {
  const { userContext } = useContext(UserContext)
  const { addToast } = useToasts()

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await userContext.updateUser(values)
    if (res.status === 200) {
      setSubmitting(false)
      addToast('Les modifications ont bien été prise en compte.', TOAST.SUCCESS)
    } else {
      addToast('Une erreur a eu lieu', TOAST.ERROR)
    }
  }
  return (
    <Formik enableReinitialize initialValues={userContext.user} validationSchema={profile} onSubmit={handleSubmit}>
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
                error={errors.username && touched.usernames}
                helperText={errors.usernames && touched.username ? errors.usernames : null}
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
          <Box align="center">
            <Button type="submit" variant="contained" color="primary">
              {isSubmitting ? <CircularProgress /> : 'Modifier mes informations'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default ProfileForm
