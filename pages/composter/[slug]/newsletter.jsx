import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, InputBase, IconButton, Modal, TextField, Button, Switch, FormControlLabel, FormGroup } from '@material-ui/core'
import { Add, Clear, Search } from '@material-ui/icons'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import { composterType, consumerType } from '~/types'
import withFormikField from '~/utils/hoc/withFormikField'
import { useToasts, TOAST } from '~/components/Snackbar'

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
    color: 'white',
    marginRight: theme.spacing(2)
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

const UserSchema = Yup.object({
  username: Yup.string().required(),
  email: Yup.string()
    .email()
    .required()
})
const UserInitialValues = {
  username: '',
  email: ''
}

const FormikTextField = withFormikField(TextField)

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
    const data = await api.getConsumers({ composter: slug, ...{ email } }).catch(handleError)
    if (data) {
      setUser(data['hydra:member'])
    }
  }

  const handleConsumerAdding = async ({ username, email }) => {
    const handleError = () => displayErrorToast("Une erreur est survenue lors de l'ajout du destinataire")
    const data = await api.postConsumers({ username, email, composterId: composter['@id'] }).catch(handleError)
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
      <div className={classes.newsletterContainer}>
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
                  {() => (
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
                          name="username"
                          label="Pseudo"
                          placeholder="Entrez le pseudo ici"
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
                          control={<Switch />}
                          label="Ce destinataire recevra également la newsletter de Compostri"
                          className={classes.switchLabel}
                        />
                      </FormGroup>

                      <Button type="submit" variant="contained" color="secondary" className={[classes.btnAdd, classes.btnNew].join(' ')}>
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
        <Paper elevation={1} className={classes.sectionRight}>
          <Typography variant="h2" className={classes.title}>
            Envoyer la newsletter du {composter.name}
          </Typography>
          <Formik initialValues={{ titreNewsletter: '', messageNewsletter: '' }} validationSchema={NewsletterSchema} onSubmit={async values => {}}>
            {({ values, handleChange, field }) => (
              <Form>
                <Field
                  InputLabelProps={{
                    shrink: true
                  }}
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
                  {...field}
                />
                <Field
                  InputLabelProps={{
                    shrink: true
                  }}
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
