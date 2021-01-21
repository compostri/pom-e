import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, TextField, Select, Box, CircularProgress, Grid, MenuItem } from '@material-ui/core'
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

const [Email, Username, Firstname, Lastname, Capability] = ['user.email', 'user.username', 'user.firstname', 'user.lastname', 'capability']

const RegisterSchema = Yup.object().shape({
  user: Yup.object().shape({
    email: Yup.string()
      .email('Veuillez entrer un email.')
      .required('Le champ email est obligatoire'),
    username: Yup.string().required('Le pseudo est obligatoire'),
    firstname: Yup.string().required('Le prénom est obligatoire'),
    lastname: Yup.string().required('Le nom est obligatoire')
  }),
  [Capability]: Yup.string().required('Le role est obligatoire')
})

const initialValues = {
  user: {
    lastname: '',
    firstname: '',
    username: '',
    email: '',
    plainPassword: Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
  },
  [Capability]: ''
}

const FormikTextField = withFormikField(TextField)
const FormikSelectField = withFormikField(Select)

const buildFields = fields => {
  const buildField = (errors, touched, values) => ({ label, name }) =>
    name === Capability ? (
      values[name] !== 'Referent' && (
        <Grid item xs={6} key={name}>
          <FormikSelectField
            required
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            label={label}
            name={name}
            helperText={errors[name] && touched[name] ? errors[name] : null}
          >
            <MenuItem value="Opener">Ouvreur</MenuItem>
            <MenuItem value="User">Utilisateur</MenuItem>
          </FormikSelectField>
        </Grid>
      )
    ) : (
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
  return (errors, touched, values) => fields.map(buildField(errors, touched, values))
}

const renderFields = buildFields([
  { label: 'Email', name: Email },
  { label: 'Pseudo', name: Username },
  { label: 'Nom', name: Lastname },
  { label: 'Prénom', name: Firstname },
  { label: 'Role', name: Capability }
])

const propTypes = {
  onSubmit: PropTypes.func.isRequired
}

const RegisterForm = ({ onSubmit, userComposerToUpdate }) => {
  const classes = useStyles()

  const handleSubmit = submit => (values, { setSubmitting }) => {
    submit(values).finally(() => setSubmitting(false))
  }

  const initialValuesMerge = { ...initialValues, ...userComposerToUpdate }
  return (
    <Formik initialValues={initialValuesMerge} validationSchema={RegisterSchema} enableReinitialize onSubmit={handleSubmit(onSubmit)}>
      {({ errors, touched, isSubmitting, values }) => (
        <Form>
          <Grid container spacing={2}>
            {renderFields(errors, touched, values)}
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
