import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, TextField, Select, Switch, FormControlLabel, InputLabel, Box, CircularProgress, Grid, MenuItem } from '@material-ui/core'
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

const [Email, Username, Firstname, Lastname, Capability, Newsletter] = [
  'user.email',
  'user.username',
  'user.firstname',
  'user.lastname',
  'capability',
  'newsletter'
]

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
  [Capability]: 'User',
  [Newsletter]: true
}

const FormikTextField = withFormikField(TextField)
const FormikSwitchField = withFormikField(Switch)
const FormikSelectField = withFormikField(Select)

const buildFields = fields => {
  const buildField = (errors, touched, values) => ({ label, name, type, choices }) => {
    let field = ''
    switch (type) {
      case 'select':
        field = (
          <Grid item xs={6} key={name}>
            <InputLabel shrink={true} id={name}>
              {label}
            </InputLabel>
            <FormikSelectField
              required
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              labelId={name}
              name={name}
              helperText={errors[name] && touched[name] ? errors[name] : null}
            >
              {choices.map(({ value, label }) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </FormikSelectField>
          </Grid>
        )
        break
      case 'text':
        field = (
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
        break
      case 'boolean':
        field = (
          <Grid item xs={6} key={name}>
            <FormControlLabel
              control={<FormikSwitchField checked={values[name]} name={name} required />}
              label={label}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        )
        break
    }

    return field
  }

  return (errors, touched, values) => fields.map(buildField(errors, touched, values))
}

const renderFields = buildFields([
  { label: 'Email', name: Email, type: 'text' },
  { label: 'Pseudo', name: Username, type: 'text' },
  { label: 'Nom', name: Lastname, type: 'text' },
  { label: 'Prénom', name: Firstname, type: 'text' },
  {
    label: 'Role',
    name: Capability,
    type: 'select',
    choices: [
      { value: 'Opener', label: 'Ouvreur' },
      { value: 'User', label: 'Utilisateur' }
    ]
  },
  { label: 'Newsletter', name: Newsletter, type: 'boolean' }
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
