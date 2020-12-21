import React from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, Link as LinkM } from '@material-ui/core'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import { composterType } from '~/types'

const ComposterNewsletterForm = dynamic(() => import('~/components/forms/composter/ComposterNewsletterForm'), {
  ssr: false
})

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(2)
  },
  desc: {
    fontStyle: 'italic',
    marginBottom: theme.spacing(2)
  },
  sectionRight: {
    padding: theme.spacing(3, 3)
  }
}))

const ComposterNewsletter = ({ composter }) => {
  const classes = useStyles()

  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Newsletter {composter.name} - un composteur géré par Compostri</title>
      </Head>

      <Paper elevation={1} className={classes.sectionRight}>
        <Typography variant="h2" className={classes.title}>
          Newsletter du/de - {composter.name}
        </Typography>
        <Typography className={classes.desc}>
          Envoyer un message à l'ensemble des utilisateurs (gérer la liste dans l'onglet{' '}
          <Link href="/composteur/[slug]/utilisateurs" as={`/composteur/${composter.slug}/utilisateurs`} passHref>
            <LinkM>"liste des utilisateurs"</LinkM>
          </Link>
          )
        </Typography>
        <ComposterNewsletterForm />
      </Paper>
    </ComposterContainer>
  )
}

ComposterNewsletter.propTypes = {
  composter: composterType.isRequired
}

ComposterNewsletter.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterNewsletter
