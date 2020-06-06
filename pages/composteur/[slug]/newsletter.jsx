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

const ComposterNewsletter = ({ composter, consumers, slug }) => {
  const classes = useStyles()
  const [users, setUser] = useState(consumers)
  const [openModal, setOpenModal] = useState(false)
  const { addToast } = useToasts()

  const setModalVisibilityTo = status => () => {
    setOpenModal(status)
  }

  const displayToast = type => message => {
    addToast(message, type)
  }

  const displayErrorToast = message => {
    displayToast(TOAST.ERROR)(message)
  }

  const displaySuccessToast = message => {
    displayToast(TOAST.SUCCESS)(message)
  }

  const mayRenderUsers = userList => {
    if (!userList.length) {
      return <Typography className={classes.searchResult}>Aucun destinataire</Typography>
    }
    return userList.map(user => (
      <Typography key={user['@id']} value={user['@id']} className={classes.searchResult}>
        {user.email}
      </Typography>
    ))
  }

  const retrievesConsumers = async ({ email } = {}) => {
    const handleError = () => displayErrorToast('Une erreur est survenue lors de la récuperation des destinataires')
    const data = await api.getConsumers({ composters: slug, ...{ email } }).catch(handleError)
    if (data) {
      setUser(data['hydra:member'])
    }
  }

  const handleConsumerAdding = async ({ lastname, firstname, email, subscribeToCompostriNewsletter }) => {
    const handleError = () => displayErrorToast("Une erreur est survenue lors de l'ajout du destinataire")
    const data = await api
      .postConsumers({ username: `${lastname} ${firstname}`, email, composterId: composter['@id'], subscribeToCompostriNewsletter })
      .catch(handleError)
    if (data) {
      displaySuccessToast('Le destinataire a bien été ajouté')
      retrievesConsumers()
      setOpenModal(false)
    }
  }

  const handleConsumerSearching = ({ target: { value: email } }) => {
    retrievesConsumers({ email })
  }

  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Newsletter {composter.name} - un composteur géré par Compostri</title>
      </Head>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} className={classes.sectionLeft}>
            <Typography variant="h2" className={classes.title}>
              Liste des destinataires
            </Typography>

            <div className={classes.search}>
              <InputBase
                type="search"
                fullWidth
                className={classes.searchBar}
                classes={{ input: classes.searchBarInput }}
                placeholder="Rechercher un utilisateur"
                endAdornment={<Search className={classes.searchIcon} />}
                onChange={handleConsumerSearching}
              />

              <IconButton className={[classes.searchBtn, classes.addBtn].join(' ')} type="submit" aria-label="add" onClick={setModalVisibilityTo(true)}>
                <Add />
              </IconButton>
              <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={setModalVisibilityTo(false)}>
                <Paper elevation={1} className={classes.modalPaper}>
                  <Formik initialValues={UserInitialValues} validationSchema={UserSchema} onSubmit={handleConsumerAdding}>
                    {({ values }) => (
                      <Form>
                        <div className={classes.modalHeader}>
                          <Typography variant="h2">Ajouter un nouveau destinataire pour la newsletter de {composter.name}</Typography>
                          <IconButton className={classes.modalFermer} onClick={setModalVisibilityTo(false)}>
                            <Clear />
                          </IconButton>
                        </div>

                        <div className={classes.info}>
                          <FormikTextField
                            InputLabelProps={{
                              shrink: true
                            }}
                            className={classes.textField}
                            fullWidth
                            name="firstname"
                            label="Prénom"
                            placeholder="Entrez le prénom ici"
                          />
                          <FormikTextField
                            InputLabelProps={{
                              shrink: true
                            }}
                            className={classes.textField}
                            fullWidth
                            name="lastname"
                            label="Nom"
                            placeholder="Entrez le nom ici"
                          />
                          <FormikTextField
                            InputLabelProps={{
                              shrink: true
                            }}
                            className={classes.textField}
                            fullWidth
                            name="email"
                            type="email"
                            label="E-mail"
                            placeholder="Entrez l'e-mail ici"
                          />
                        </div>

                        <FormGroup>
                          <FormControlLabel
                            control={<FormikSwitch name="subscribeToCompostriNewsletter" checked={values.subscribeToCompostriNewsletter} />}
                            label="Ce destinataire recevra également la newsletter de Compostri"
                            className={classes.switchLabel}
                          />
                        </FormGroup>

                        <Button type="submit" variant="contained" color="secondary" className={classes.btnAdd}>
                          Valider
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Paper>
              </Modal>
            </div>

            {mayRenderUsers(users)}
          </Paper>
        </Grid>
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
  composter: composterType.isRequired,
  slug: PropTypes.string.isRequired,
  consumers: PropTypes.arrayOf(consumerType).isRequired
}

ComposterNewsletter.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)
  const consumers = (await api.getConsumers({ composters: query.slug }))['hydra:member']

  return {
    composter: composter.data,
    consumers,
    slug: query.slug
  }
}

export default ComposterNewsletter
