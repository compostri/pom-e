import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, InputBase, IconButton, Modal, TextField, Button, Switch, FormControlLabel, FormGroup, Grid } from '@material-ui/core'
import { Add, Clear, Search } from '@material-ui/icons'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import Head from 'next/head'

import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import { composterType, consumerType } from '~/types'
import withFormikField from '~/utils/hoc/withFormikField'
import { useToasts, TOAST } from '~/components/Snackbar'
import ComposterNewsletterForm from '~/components/forms/composter/ComposterNewsletterForm'

const useStyles = makeStyles(theme => ({
  sectionLeft: {
    flexGrow: '1',
    padding: theme.spacing(3, 3)
  },
  sectionRight: {
    flexGrow: '1',
    padding: theme.spacing(3, 3)
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  action: {
    display: 'flex'
  },
  search: {
    display: 'flex',
    flexGrow: '1'
  },
  searchBar: {
    backgroundColor: '#c2d97c',
    borderTop: '1px solid #fff',
    borderBottom: '1px solid #fff',
    borderRadius: 2,
    '&:before, &:after': { content: 'none' },
    '&::placeholder': { color: 'white' }
  },
  searchBarInput: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: '700',
    letterSpacing: 0.5,
    color: 'white'
  },
  searchIcon: {
    color: 'white'
  },
  searchBtn: {
    color: 'white',
    backgroundColor: '#c2d97c',
    borderRadius: 2,
    marginLeft: 1
  },
  addBtn: {
    marginLeft: theme.spacing(1)
  },
  searchResult: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    color: palette.greyMedium,
    fontSize: 14,
    marginTop: theme.spacing(1)
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    padding: theme.spacing(6),
    outline: 'none',
    maxWidth: 840,
    margin: theme.spacing(0, 2),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3)
    }
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2)
  },
  modalFermer: {
    padding: '0'
  },
  info: {
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginBottom: theme.spacing(1)
  },

  switchLabel: {
    color: palette.greyMedium,
    fontSize: 16,
    margin: theme.spacing(1, 0, 2, 0)
  },
  btnAdd: {
    margin: '0 auto',
    display: 'block'
  }
}))

const UserSchema = Yup.object({
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  subscribeToCompostriNewsletter: Yup.bool().required()
})
const UserInitialValues = {
  firstname: '',
  lastname: '',
  email: '',
  subscribeToCompostriNewsletter: false
}

const FormikTextField = withFormikField(TextField)
const FormikSwitch = withFormikField(Switch)

const ComposterNewsletter = ({ composter }) => {
  const classes = useStyles()
  const { addToast } = useToasts()

  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Newsletter {composter.name} - un composteur géré par Compostri</title>
      </Head>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={1} className={classes.sectionRight}>
            <Typography variant="h2" className={classes.title}>
              Envoyer la newsletter du {composter.name}
            </Typography>
            <ComposterNewsletterForm />
          </Paper>
        </Grid>
      </Grid>
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
