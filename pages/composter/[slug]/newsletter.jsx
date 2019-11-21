import React, { useState, useEffect, useContext } from 'react'
import { Line } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, InputBase, IconButton, Modal, TextField, Button, Switch, FormControlLabel, FormGroup } from '@material-ui/core'
import { Search, Add, Clear } from '@material-ui/icons'

import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import { ComposterContext } from '~/context/ComposterContext'

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
    marginBottom: theme.spacing(2)
  },
  action: {
    display: 'flex'
  },
  search: {
    display: 'flex',
    flexGrow: '1'
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
  submit: {
    marginTop: theme.spacing(2),
    maxWidth: 150,
    display: 'block',
    margin: '0 auto'
  },
  field: {
    marginTop: 0
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    padding: theme.spacing(6, 6, 6, 6),
    outline: 'none',
    maxWidth: 840
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

const NewsletterSchema = Yup.object().shape({
  titreNewsletter: Yup.string(),
  messageNewsletter: Yup.string()
})

const ComposterNewsletter = () => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext

  useEffect(() => {
    composterContext.setComposter(composter)
  }, [])

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }
  const handleSubmit = () => {
    // TODO Ajouter l'ouvreur a la permanence
    handleClose()
  }
  useEffect(() => {
    async function fetchData() {
      const response = await api.getUsers({ email: search })
      setUsers(response.data['hydra:member'])
    }
    fetchData()
  }, [search])

  if (!composter) return null

  return (
    <ComposterContainer>
      <div className={classes.newsletterContainer}>
        <Paper elevation={1} className={classes.sectionLeft}>
          <Typography variant="h2" className={classes.title}>
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
            <IconButton className={[classes.searchBtn, classes.addBtn].join(' ')} type="submit" aria-label="add" onClick={handleOpen}>
              <Add />
            </IconButton>
            <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={handleClose}>
              <Paper elevation={1} className={classes.modalPaper}>
                <div className={classes.modalHeader}>
                  <Typography variant="h2">Ajouter un nouveau destinataire pour la newsletter de {composter.name}</Typography>
                  <IconButton className={classes.modalFermer} onClick={handleClose}>
                    <Clear />
                  </IconButton>
                </div>

                <div className={classes.info}>
                  <TextField className={classes.textField} fullWidth id="pseudo" label="Pseudo" placeholder="Entrez le pseudo ici" />
                  <TextField className={classes.textField} fullWidth id="mail" label="E-mail" placeholder="Entrez l'e-mail ici" />
                </div>

                <FormGroup>
                  <FormControlLabel control={<Switch />} label="Ce destinataire recevra également la newsletter de Compostri" className={classes.switchLabel} />
                </FormGroup>

                <Button variant="contained" onClick={handleSubmit} color="secondary" className={[classes.btnAdd, classes.btnNew].join(' ')}>
                  Valider
                </Button>
              </Paper>
            </Modal>
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
          <Typography variant="h2" className={classes.title}>
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
                />
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
                />
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
