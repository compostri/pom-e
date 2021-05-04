import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, TextField, Grid, CircularProgress, Box } from '@material-ui/core'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { UserContext } from '~/context/UserContext'

const profile = Yup.object().shape({
  lastname: Yup.string().required('Nom requis'),
  firstname: Yup.string().required('Prénom requis'),
  email: Yup.string()
    .email('Email non valide')
    .required('Email requis'),
  username: Yup.string().required('Pseudo requis')
})

const propTypes = {
  onUserInformationUpdate: PropTypes.func.isRequired
}
const ProfileForm = ({ onUserInformationUpdate, user }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    onUserInformationUpdate(values).finally(() => setSubmitting(false))
  }
  return (
    <Formik enableReinitialize initialValues={user} validationSchema={profile} onSubmit={handleSubmit}>
      {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
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
            <Grid item sm={6} xs={12}>
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
            <Grid item sm={6} xs={12}>
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
                helperText={errors.usernames && touched.username ? errors.username : null}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
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

ProfileForm.propTypes = propTypes

export default ProfileForm
