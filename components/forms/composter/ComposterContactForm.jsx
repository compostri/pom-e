import React, { useEffect, useState, useContext } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import { Box, FormGroup, FormControlLabel, Switch, Button, Typography, Chip, Avatar, CircularProgress, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import api from '~/utils/api'
import { UserContext } from '~context/UserContext'
import { ComposterContext } from '~context/ComposterContext'

const ContactSchema = Yup.object().shape({
  receive: Yup.boolean()
})

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(1)
  },
  receiver: {
    marginRight: theme.spacing(1)
  }
}))

/**
 * La fameux formulaire de contact
 */

const ComposterContactForm = props => {
  const { setSnackBarMessage, ...otherProps } = props
  const {
    userContext: { user }
  } = useContext(UserContext)
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)

  const submit = async (values, { setSubmitting }) => {
    // On cherche la relation du user en cours et on l'update

    setSubmitting(false)
  }

  return (
    <Box {...otherProps}>
      <Formik
        initialValues={{
          subject: '',
          message: ''
        }}
        validationSchema={ContactSchema}
        enableReinitialize
        onSubmit={submit}
      >
        {({ values, handleChange, field, isSubmitting }) => (
          <Form>
            <Field
              component={TextField}
              margin="normal"
              fullWidth
              id="subject"
              label="Sujet"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              type="subject"
              autoComplete="subject"
              autoFocus
              autoOk
              {...field}
            />

            <Field
              component={TextField}
              margin="normal"
              fullWidth
              id="message"
              label="Message"
              name="message"
              value={values.message}
              onChange={handleChange}
              type="message"
              autoComplete="message"
              autoFocus
              autoOk
              {...field}
            />
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
