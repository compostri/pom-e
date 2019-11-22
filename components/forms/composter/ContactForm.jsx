import React, { useEffect, useState, useContext } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import { Box, FormGroup, FormControlLabel, Switch, Button, Typography, Chip, Avatar, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import api from '~/utils/api'
import { UserContext } from '~context/UserContext'
import { ComposterContext } from '~/context/ComposterContext'

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

const ContactForm = props => {
  const { setSnackBarMessage, ...otherProps } = props
  const [receivers, setReceivers] = useState()
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext

  useEffect(() => {
    composterContext.setComposter(composter)
  }, [])

  const {
    userContext: { user }
  } = useContext(UserContext)

  const getUserComposter = () =>
    api.getUserComposter({ composter: composter.rid }).then(res => {
      if (res.status === 200) {
        // On stocke toutes les relations user <-> composteur
        const rec = res.data['hydra:member']
        setReceivers(rec)
      }
    })

  useEffect(() => {
    getUserComposter()
  }, [composter.id])

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
      }
      setSubmitting(false)
    })
  }
  const classes = useStyles()

  return (
    <Box {...otherProps}>
      <Formik
        initialValues={{
          receive: isReceiver()
        }}
        validationSchema={ContactSchema}
        enableReinitialize
        onSubmit={submit}
      >
        {({ values, handleChange, isSubmitting }) => (
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
                    .map(receiver => (
                      <Chip className={classes.receiver} avatar={<Avatar>{receiver.username.substr(0, 1).toUpperCase()}</Avatar>} label={receiver.username} />
                    ))}
              </Box>
            </Box>
            <Box my={2}>
              <FormGroup>
                <FormControlLabel
                  control={<Switch value={values.receive} checked={values.receive} onChange={handleChange} />}
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
    </Box>
  )
}

export default ContactForm
