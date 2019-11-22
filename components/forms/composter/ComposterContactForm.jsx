import React, { useContext } from 'react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { Box, Button, CircularProgress, TextField, Grid } from '@material-ui/core'
import api from '~/utils/api'
import { ComposterContext } from '~context/ComposterContext'
import { useToasts, TOAST } from '~/components/Snackbar'

const ContactSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required('Le champ email est obligatoire'),
  message: Yup.string().required('Le champ message est obligatoire')
})

/**
 * La fameux formulaire de contact
 */

const ComposterContactForm = () => {
  const { addToast } = useToasts()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)

  const initialValues = {
    email: '',
    message: ''
  }

  const submit = async (values, { resetForm, setSubmitting }) => {
    const res = await api.sendComposterContact({ ...values, composter: composter['@id'] })
    if (res.status === 201) {
      resetForm(initialValues)
      addToast('Votre demande de contact a bien été enregistrée !', TOAST.SUCCESS)
    } else {
      addToast('Une erreur est intervenue. Veuillez rééssayer plus tard.', TOAST.ERROR)
    }
    setSubmitting(false)
  }

  return (
    <Box>
      <Formik initialValues={initialValues} validationSchema={ContactSchema} enableReinitialize onSubmit={submit}>
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
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email}
                  helperText={errors.email && touched.email ? errors.email : null}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Message"
                  multiline
                  InputLabelProps={{
                    shrink: true
                  }}
                  rows={5}
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message && touched.message}
                  helperText={errors.message && touched.message ? errors.message : null}
                />
              </Grid>
            </Grid>
            <Box my={2} align="center">
              <Button type="submit" variant="contained" color="secondary">
                {isSubmitting ? <CircularProgress /> : 'Envoyer'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default ComposterContactForm
