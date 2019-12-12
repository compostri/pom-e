import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Box, Typography, Chip, Avatar, Link as MatLink } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import api from '~/utils/api'
import { ComposterContext } from '~/context/ComposterContext'
import { getInitial } from '~/utils/utils'

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
  const classes = useStyles()

  const getUserComposter = useCallback(async () => {
    const data = await api.getUserComposter({ composter: composter.rid }).catch(console.error)
    if (data) {
      setReceivers(data['hydra:member'])
    }
  }, [composter.rid])

  useEffect(() => {
    getUserComposter()
  }, [getUserComposter])

  return (
    <>
      <Box my={2}>
        <Typography>
          Pour recevoir le formulaire de contact, activez l&apos;option dans l‘onglet <strong>notifications</strong> de votre
          <Link href="/profil" passHref>
            <MatLink> Profil</MatLink>
          </Link>
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
                <Chip key={receiver.usernam} className={classes.receiver} avatar={<Avatar>{getInitial(receiver.username)}</Avatar>} label={receiver.username} />
              ))}
        </Box>
      </Box>
    </>
  )
}

export default ContactForm
