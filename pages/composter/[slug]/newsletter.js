import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, InputBase, IconButton, FormGroup, TextField, Button } from '@material-ui/core'
import { Search, SettingsSystemDaydreamTwoTone } from '@material-ui/icons'

import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'

const useStyles = makeStyles(theme => ({
  newsletterContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  sectionLeft: {
    flexGrow: '1',
    marginRight: theme.spacing(3),
    padding: theme.spacing(3, 3)
  },
  sectionRight: {
    flexGrow: '1',
    padding: theme.spacing(3, 3)
  },
  title: {
    color: palette.greyDark,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing(2)
  },
  search: {
    display: 'flex'
  },
  searchInput: {
    flexGrow: 1,
    backgroundColor: palette.greenPrimary,
    color: 'white'
  },
  searchBtn: {
    color: 'white',
    backgroundColor: palette.greenPrimary,
    borderRadius: 0,
    marginLeft: 1
  },
  searchResult: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    color: palette.greyMedium,
    fontSize: 14,
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(2),
    maxWidth: 150,
    display: 'block',
    margin: '0 auto'
  },
  field: {
    marginTop: 0
  }
}))

const NewsletterSchema = Yup.object().shape({
  titreNewsletter: Yup.string(),
  messageNewsletter: Yup.string()
})

const ComposterNewsletter = ({ composter }) => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchData() {
      const response = await api.getUsers({ email: search })
      setUsers(response.data['hydra:member'])
    }
    fetchData()
  }, [search])

  return (
    <ComposterContainer composter={composter}>
      <div className={classes.newsletterContainer}>
        <Paper elevation={1} className={classes.sectionLeft}>
          <Typography h2 className={classes.title}>
            Liste des destinataires
          </Typography>
          <div className={classes.search}>
            <InputBase
              type="search"
              className={classes.searchInput}
              placeholder="Rechercher un utilisateur"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            <IconButton className={classes.searchBtn} type="submit" aria-label="search">
              <Search />
            </IconButton>
          </div>
          <div>
            {users.map(user => (
              <Typography key={user['@id']} value={user['@id']} className={classes.searchResult}>
                {user.email}
              </Typography>
            ))}
          </div>
        </Paper>
        <Paper elevation={1} className={classes.sectionRight}>
          <Typography h2 className={classes.title}>
            Envoyer la newsletter du {composter.name}
          </Typography>
          <Formik initialValues={{ titreNewsletter: '', messageNewsletter: '' }} validationSchema={NewsletterSchema} onSubmit={async values => {}}>
            {({ values, handleChange, field }) => (
              <Form>
                <Field
                  className={classes.field}
                  component={TextField}
                  margin="normal"
                  fullWidth
                  id="titreNewsletter"
                  label="Titre de la newsletter"
                  name="titreNewsletter"
                  value={values.titreNewsletter}
                  onChange={handleChange}
                  type="titreNewsletter"
                  autoComplete="titreNewsletter"
                  autoFocus
                  autoOk
                  {...field}
                ></Field>
                <Field
                  className={classes.field}
                  component={TextField}
                  margin="normal"
                  fullWidth
                  multiline
                  rows="15"
                  id="messageNewsletter"
                  label="Message de la newsletter"
                  name="messageNewsletter"
                  value={values.messageNewsletter}
                  onChange={handleChange}
                  type="messageNewsletter"
                  autoComplete="messageNewsletter"
                  autoFocus
                  autoOk
                  {...field}
                ></Field>
                <Button className={classes.submit} type="submit" variant="contained" color="secondary">
                  Envoyer
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </div>
    </ComposterContainer>
  )
}

ComposterNewsletter.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterNewsletter
