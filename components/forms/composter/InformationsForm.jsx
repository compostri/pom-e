import React, { useContext } from 'react'
import { Formik, Form } from 'formik'
import { Box, FormControlLabel, Switch, Button, TextField, Grid, CircularProgress } from '@material-ui/core'
import api from '~/utils/api'

import withFormikField from '~/utils/hoc/withFormikField'
import ImageInput from '~/components/forms/ImageInput'
import { ComposterContext } from '~/context/ComposterContext'
import { useToasts, TOAST } from '~/components/Snackbar'

const InformationsForm = () => {
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext
  const { addToast } = useToasts()

  const initialValues = {
    openingProcedures: composter.openingProcedures,
    acceptNewMembers: !!composter.acceptNewMembers,
    image: composter.image
  }

  const submit = async ({ image, openingProcedures, acceptNewMembers }, { setSubmitting }) => {
    const response = await api.updateComposter(composter.slug, { image: image['@id'], openingProcedures, acceptNewMembers })

    if (response) {
      addToast('Votre modification a bien été prise en compte', TOAST.SUCCESS)
    } else {
      addToast('Une erreur est survenue', TOAST.ERROR)
    }
    setSubmitting(false)
  }

  const FormikTextField = withFormikField(TextField)
  const FormikSwitch = withFormikField(Switch)

  const handleImageChange = setFieldValue => image => {
    setFieldValue('image', image)
  }

  return (
    <Formik initialValues={initialValues} onSubmit={submit}>
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <ImageInput label="Photo" width={100} name="image" onLoadEnd={handleImageChange(setFieldValue)} value={values.image} />
            </Grid>
            <Grid item xs={10}>
              <FormikTextField fullWidth label="procédure d'ouverture" name="openingProcedures" />
              <FormControlLabel label="Accepte de nouveaux adhérents" control={<FormikSwitch name="acceptNewMembers" checked={values.acceptNewMembers} />} />
            </Grid>
          </Grid>

          <Box align="center" mt={2}>
            <Button type="submit" variant="contained" color="secondary">
              {isSubmitting ? <CircularProgress /> : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default InformationsForm
