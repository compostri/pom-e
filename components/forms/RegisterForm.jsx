import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, TextField, Box, CircularProgress, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import * as Yup from 'yup'

import { Formik, Form } from 'formik'
import palette from '~/variables'
import withFormikField from '~/utils/hoc/withFormikField'

const useStyles = makeStyles(theme => ({
  smallTxt: {
    color: palette.greyMedium,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: theme.spacing(2)
  }
}))

const [Email, Username, Firstname, Lastname] = ['email', 'username', 'firstname', 'lastname']

const RegisterSchema = Yup.object().shape({
  [Email]: Yup.string()
    .email('Veuillez entrer un email.')
    .required('Le champ email est obligatoire'),
  [Username]: Yup.string().required('Le pseudo est obligatoire'),
  [Firstname]: Yup.string().required('Le prénom est obligatoire'),
  [Lastname]: Yup.string().required('Le nom est obligatoire')
})

const initialValues = {
  [Lastname]: '',
  [Firstname]: '',
  [Username]: '',
  [Email]: '',
  plainPassword: Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
}

const FormikTextField = withFormikField(TextField)

const buildFields = fields => {
  const buildField = (errors, touched) => ({ label, name }) => (
    <Grid item xs={6} key={name}>
      <FormikTextField
        required
        fullWidth
        InputLabelProps={{
          shrink: true
        }}
        label={label}
        name={name}
        helperText={errors[name] && touched[name] ? errors[name] : null}
      />
    </Grid>
  )
  return (errors, touched) => fields.map(buildField(errors, touched))
}

const renderFields = buildFields([
  { label: 'Nom', name: Lastname },
  { label: 'Prénom', name: Firstname },
  { label: 'Pseudo', name: Username },
  { label: 'Email', name: Email }
])

const propTypes = {
  onSubmit: PropTypes.func.isRequired
}

const RegisterForm = ({ onSubmit }) => {
  const classes = useStyles()

  const handleSubmit = submit => (values, { setSubmitting }) => {
    submit(values).finally(() => setSubmitting(false))
  }

  return (
    <Formik initialValues={initialValues} validationSchema={RegisterSchema} enableReinitialize onSubmit={handleSubmit(onSubmit)}>
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            {renderFields(errors, touched)}
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

RegisterForm.propTypes = propTypes

export default RegisterForm
