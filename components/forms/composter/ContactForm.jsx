import React, { useEffect, useState, useContext, useCallback } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import { Box, FormGroup, FormControlLabel, Switch, Button, Typography, Chip, Avatar, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import api from '~/utils/api'
import { UserContext } from '~context/UserContext'
import { ComposterContext } from '~/context/ComposterContext'
import { useToasts, TOAST } from '~/components/Snackbar'
import { getInitial } from '~/utils/utils'

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
 * Permet de choisir d'être destinataire des formulaires de contact
 */

const ContactForm = () => {
  const [receivers, setReceivers] = useState()
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext
  const { addToast } = useToasts()

  const {
    userContext: { user }
  } = useContext(UserContext)

  const getUserComposter = useCallback(async () => {
    const data = await api.getUserComposter({ composter: composter.rid }).catch(console.error)
    if (data) {
      setReceivers(data['hydra:member'])
    }
  }, [composter.rid])

  useEffect(() => {
    getUserComposter()
  }, [getUserComposter])

  const isReceiver = () => {
    // Parmi toutes les relations, on filtre celles du user en cours et qui sont classées receivers
    return receivers && receivers.filter(uc => uc.user['@id'] === `/users/${user.id}` && uc.composterContactReceiver === true).length > 0
  }

  const submit = async (values, { setSubmitting }) => {
    // On cherche la relation du user en cours et on l'update
    const uc = receivers.find(ucom => ucom.user['@id'])
    api.updateUserComposter(uc['@id'], { composterContactReceiver: values.receive }).then(res => {
      if (res.status === 200) {
        getUserComposter()
        addToast('Votre demande a bien été prise en compte !', TOAST.SUCCESS)
      } else {
        addToast('Une erreur a eu lieu', TOAST.ERROR)
      }
      setSubmitting(false)
    })
  }
  const classes = useStyles()

  return (
    <Formik
      initialValues={{
        receive: isReceiver()
      }}
      validationSchema={ContactSchema}
      enableReinitialize
      onSubmit={submit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <Box my={2}>
            <Typography>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id nulla eaque doloremque atque nesciunt incidunt ipsam rem perferendis molestiae?
              Nesciunt aperiam iste quae eaque obcaecati. Corporis nam suscipit dolores doloremque!
            </Typography>
          </Box>
          <Box my={2}>
            <Typography variant="h2" className={classes.title}>
              Liste des personnes recevant les formulaires de contact
            </Typography>
            <Box>
              {receivers &&
                receivers
                  .filter(uc => uc.composterContactReceiver === true)
                  .map(uc => uc.user)
                  .map((receiver, index) => (
                    <Chip
                      key={`rece-${index}`}
                      className={classes.receiver}
                      avatar={<Avatar>{getInitial(receiver.username)}</Avatar>}
                      label={receiver.username}
                    />
                  ))}
            </Box>
          </Box>
          <Box my={2}>
            <FormGroup>
              <FormControlLabel
                control={<Switch value="receive" checked={values.receive} onChange={() => setFieldValue('receive', !values.receive)} />}
                label="Je veux recevoir les formulaires de contact"
                id="receive"
                name="receive"
                type="receive"
                className={classes.switchLabel}
              />
            </FormGroup>
          </Box>
          <Box my={2} align="center">
            <Button type="submit" variant="contained" color="secondary">
              {isSubmitting ? <CircularProgress /> : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default ContactForm
