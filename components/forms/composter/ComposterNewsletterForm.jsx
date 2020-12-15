import * as Yup from 'yup'
import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, TextField, Grid, InputLabel, Input } from '@material-ui/core'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import api from '~/utils/api'
import variables from '~/variables'
import { ComposterContext } from '~context/ComposterContext'
import { useToasts, TOAST } from '~/components/Snackbar'

const ContactSchema = Yup.object().shape({
  subject: Yup.string().required('Le champ titre est obligatoire'),
  message: Yup.string().required('Le champ message est obligatoire')
})
/**
 * La fameux formulaire de contact
 */

const ComposterNewsletterForm = () => {
  const { addToast } = useToasts()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [subjectTouched, setSubjectTouched] = useState(false)
  const [messageTouched, setMessageTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState([])

  const {
    composterContext: { composter }
  } = useContext(ComposterContext)

  const resetForm = () => {
    setSubject('')
    setMessage('')
  }

  useEffect(() => {
    if (subjectTouched && messageTouched) {
      ContactSchema.validate({ subject, message })
        .then(setFormError([]))
        .catch(err => {
          setFormError(err.errors)
        })
    }
  }, [subject, message])

  const submit = async event => {
    event.preventDefault()
    setIsSubmitting(true)
    ContactSchema.validate({ subject, message })
      .then(async () => {
        const res = await api.sendComposterNewsletter({ subject, message, composter: composter['@id'] })
        if (res.status === 201) {
          resetForm()
          addToast('Votre newsletter a bien été envoyée !', TOAST.SUCCESS)
        } else {
          addToast('Une erreur est intervenue. Veuillez rééssayer plus tard.', TOAST.ERROR)
        }
      })
      .catch(err => {
        setFormError(err.errors)
      })

    setIsSubmitting(false)
  }

  return (
    <Box>
      <form onSubmit={submit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              label="Titre"
              name="subject"
              value={subject}
              onBlur={() => setSubjectTouched(true)}
              onChange={e => setSubject(e.currentTarget.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'],
                removePlugins: ['EasyImage', 'Image', 'MediaEmbed', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload']
              }}
              required
              name="message"
              data={message}
              onBlur={() => setMessageTouched(true)}
              onChange={(event, editor) => setMessage(editor.getData())}
            />
            {formError &&
              formError.map((e, index) => (
                <p key={`error-${index}`} style={{ color: variables.red }}>
                  {e}
                </p>
              ))}
          </Grid>
        </Grid>
        <Box my={2} align="center">
          <Button type="submit" variant="contained" color="secondary">
            {isSubmitting ? <CircularProgress size={26} /> : 'Envoyer'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default ComposterNewsletterForm
