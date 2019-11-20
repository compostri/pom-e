import React from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import { Box, FormGroup, FormControlLabel, Switch, Button, TextField, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import api from '~/utils/api'
import ImageInput from '~/components/forms/ImageInput'

const ContactForm = props => {
  const { composter, setSnackBarMessage, ...otherProps } = props
  return (
    <Box {...otherProps}>
      <Typography paragraph>Formulaire de contact</Typography>
    </Box>
  )
}

export default ContactForm
