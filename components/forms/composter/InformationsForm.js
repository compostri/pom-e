import React from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import { Box, FormGroup, FormControlLabel, Switch, Button, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import api from '~/utils/api'
import ImageInput from '~/components/forms/ImageInput'

const useStyles = makeStyles(theme => ({}))

const LogInSchema = Yup.object().shape({
  openingProcedures: Yup.string(),
  acceptNewMembers: Yup.boolean()
})

const InformationsForm = props => {
  const { composter, setSnackBarMessage, ...otherProps } = props
  const classes = useStyles()

  return (
    <Box {...otherProps}>
      <Formik
        initialValues={{ openingProcedures: composter.openingProcedures, acceptNewMembers: composter.acceptNewMembers, image: composter.image }}
        validationSchema={LogInSchema}
        onSubmit={async values => {
          const response = await api.updateComposter(composter.slug, values)
          if (response.status === 200) {
            setSnackBarMessage('Votre modification a bien été prise en compte')
          } else {
            setSnackBarMessage('Une erreur est survenue')
          }
        }}
      >
        {({ values, handleChange, field, setFieldValue }) => (
          <Form className={classes.form}>
            <Grid container>
              <Grid item xs="2">
                <ImageInput
                  label="Image"
                  name="image"
                  value={values.image}
                  onDelete={() => {
                    setFieldValue('image', null, false)
                  }}
                  onUpload={image => {
                    setFieldValue('image', image, false)
                  }}
                />
              </Grid>
              <Grid item xs="10">
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
                    control={<Switch value={values.acceptNewMembers} onChange={handleChange} />}
                    label="Accepte de nouveaux adhérents"
                    id="acceptNewMembers"
                    name="acceptNewMembers"
                    type="acceptNewMembers"
                    className={classes.switchLabel}
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Button className={classes.valider} type="submit" variant="contained" color="secondary">
              Enregistrer les modifications
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default InformationsForm
