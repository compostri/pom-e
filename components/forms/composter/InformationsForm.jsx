import React, { useContext } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { Box, FormGroup, FormControlLabel, Switch, Button, TextField, Grid, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import api from '~/utils/api'
import ImageInput from '~/components/forms/ImageInput'
import { ComposterContext } from '~/context/ComposterContext'

const useStyles = makeStyles(theme => ({}))

const LogInSchema = Yup.object().shape({
  openingProcedures: Yup.string(),
  acceptNewMembers: Yup.boolean()
})

const InformationsForm = props => {
  const { setSnackBarMessage, ...otherProps } = props
  const classes = useStyles()
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext

  const submit = async (values, { resetForm, setSubmitting }) => {
    const newValues = { ...values }
    if (values.image) {
      newValues.image = values.image['@id']
    } else {
      delete newValues.image
    }

    const response = await api.updateComposter(composter.slug, newValues)

    if (response.status === 200) {
      setSnackBarMessage('Votre modification a bien été prise en compte')
    } else {
      setSnackBarMessage('Une erreur est survenue')
    }
    setSubmitting(false)
  }

  return (
    <Box {...otherProps}>
      <Formik
        initialValues={{
          openingProcedures: composter.openingProcedures,
          acceptNewMembers: !!composter.acceptNewMembers,
          image: composter.image
        }}
        validationSchema={LogInSchema}
        onSubmit={submit}
      >
        {({ values, handleChange, field, setFieldValue, isSubmitting }) => (
          <Form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <ImageInput
                  label="Image"
                  name="image"
                  value={values.image}
                  onUpdate={images => {
                    setFieldValue('image', images, false)
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <Field
                  component={TextField}
                  margin="normal"
                  fullWidth
                  id="openingProcedures"
                  label="procédure d'ouverture"
                  name="openingProcedures"
                  value={values.openingProcedures}
                  onChange={handleChange}
                  type="openingProcedures"
                  autoComplete="openingProcedures"
                  autoFocus
                  autoOk
                  {...field}
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Switch value={values.acceptNewMembers} checked={values.acceptNewMembers} onChange={handleChange} />}
                    label="Accepte de nouveaux adhérents"
                    id="acceptNewMembers"
                    name="acceptNewMembers"
                    type="acceptNewMembers"
                    className={classes.switchLabel}
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Box align="center" mt={2}>
              <Button className={classes.valider} type="submit" variant="contained" color="secondary">
                {isSubmitting ? <CircularProgress /> : 'Enregistrer les modifications'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default InformationsForm
