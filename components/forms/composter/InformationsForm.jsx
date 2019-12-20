import React, { useContext } from 'react'
import { Formik, Form } from 'formik'
import { Box, FormControlLabel, Switch, Button, TextField, Grid, CircularProgress, Select, FormControl, MenuItem, InputLabel } from '@material-ui/core'
import api from '~/utils/api'

import withFormikField from '~/utils/hoc/withFormikField'
import ImageInput from '~/components/forms/ImageInput'
import { ComposterContext } from '~/context/ComposterContext'
import { useToasts, TOAST } from '~/components/Snackbar'

const FormikTextField = withFormikField(TextField)
const FormikSwitch = withFormikField(Switch)
const FormikSelect = withFormikField(Select)

const broyatLevels = { Empty: 'Vide', Reserve: 'Sur la réserve', Full: 'Plein' }

const InputLabelProps = {
  shrink: true
}

const InformationsForm = () => {
  const { composterContext } = useContext(ComposterContext)
  const {
    composter: { openingProcedures, slug, acceptNewMembers, image, publicDescription, permanencesDescription, broyatLevel }
  } = composterContext

  const { addToast } = useToasts()

  const Name = {
    openingProcedures: 'openingProcedures',
    acceptNewMembers: 'acceptNewMembers',
    image: 'image',
    publicDescription: 'publicDescription',
    permanencesDescription: 'permanencesDescription',
    broyatLevel: 'broyatLevel'
  }

  const initialValues = {
    openingProcedures,
    acceptNewMembers,
    image,
    publicDescription: publicDescription || '',
    permanencesDescription,
    broyatLevel
  }

  const submit = async ({ image: newImage, ...otherValues }, { setSubmitting, setFieldValue }) => {
    const response = await api.updateComposter(slug, { image: newImage ? newImage['@id'] : null, ...otherValues })

    if (response) {
      addToast('Votre modification a bien été prise en compte', TOAST.SUCCESS)
    } else {
      addToast('Une erreur est survenue', TOAST.ERROR)
    }
    setSubmitting(false)
  }

  const handleImageChange = setFieldValue => newImage => {
    setFieldValue(Name.image, newImage)
  }

  const renderBroyatlevelOptions = options => {
    const renderOption = ([value, label]) => (
      <MenuItem key={label} value={value}>
        {label}
      </MenuItem>
    )
    return options.map(renderOption)
  }

  return (
    <Formik initialValues={initialValues} onSubmit={submit} enableReinitialize>
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <ImageInput label="Photo" name={Name.image} onLoadEnd={handleImageChange(setFieldValue)} value={values.image} />
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormikTextField fullWidth InputLabelProps={InputLabelProps} multiline rows="4" label="Description publique" name={Name.publicDescription} />
              <FormikTextField fullWidth InputLabelProps={InputLabelProps} label="Procédure d'ouverture" name={Name.openingProcedures} />
              <FormikTextField fullWidth InputLabelProps={InputLabelProps} label="Description des permanences" name={Name.permanencesDescription} />
              <FormControl fullWidth>
                <InputLabel id="broyat-label">Niveau de broyat</InputLabel>
                <FormikSelect label="Description des permanences" name={Name.broyatLevel}>
                  {renderBroyatlevelOptions(Object.entries(broyatLevels))}
                </FormikSelect>
              </FormControl>
              <FormControlLabel
                label="Accepte de nouveaux adhérents"
                control={<FormikSwitch name={Name.acceptNewMembers} checked={values.acceptNewMembers} />}
              />
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
