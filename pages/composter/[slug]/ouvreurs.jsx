import React, { useState, useEffect, useCallback } from 'react'
import { Typography, IconButton, Button, Modal, Tabs, Tab, Paper, CircularProgress, Grid, Box } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Head from 'next/head'

import api from '~/utils/api'
import { useToasts, TOAST } from '~/components/Snackbar'
import ComposterContainer from '~/components/ComposterContainer'
import OuvreurCard from '~/components/OuvreurCard'
import palette from '~/variables'
import RegisterForm from '~/components/forms/RegisterForm'
import AddUserComposterForm from '~/components/forms/AddUserComposterForm'
import { composterType } from '~/types'

const useStyles = makeStyles(theme => ({
  btnAdd: {
    margin: '0 auto',
    display: 'block'
  },
  btnNew: {
    marginTop: theme.spacing(4)
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
    paddingBottom: theme.spacing(4)
  },
  tabs: {
    flexGrow: '1'
  },
  tab: {
    fontSize: 16,
    padding: 0,
    marginRight: theme.spacing(3)
  },
  modalFermer: {
    padding: '0'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  second: {
    marginLeft: '2%'
  },
  smallTxt: {
    color: palette.greyMedium,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: theme.spacing(2)
  },
  box: {
    padding: 0
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
  }
}))

const ComposterOuvreurs = ({ composter }) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [activeTab, setActiveTab] = useState('creation-compte')
  const [users, setUsers] = useState()
  const { addToast } = useToasts()

  const getUsers = useCallback(async () => {
    const data = await api.getUserComposter({ composter: composter.rid }).catch(console.error)
    if (data) {
      setUsers(data['hydra:member'])
    }
  }, [composter.rid])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  const handleResponse = async (request, { successMessage, errorMessage }) => {
    const response = await request.catch(() => addToast(errorMessage, TOAST.ERROR))
    return new Promise((resolve, reject) => {
      if (response) {
        addToast(successMessage, TOAST.SUCCESS)
        resolve()
        handleClose()
        getUsers()
      } else {
        reject()
      }
    })
  }

  const handleRegisterFormSubmit = async values => {
    return handleResponse(
      api.createUserComposter({
        user: { ...values, userConfirmedAccountURL: `${window.location.origin}/confirmation` },
        composter: composter['@id']
      }),
      { successMessage: "L'ouvreur a bien été ajouté.", errorMessage: 'Une erreur est intervenue. Veuillez rééssayer plus tard.' }
    )
  }

  const handleUserAddingSubmit = async userId => {
    return handleResponse(
      api.createUserComposter({
        user: userId,
        composter: composter['@id']
      }),
      { successMessage: "L'utilisateur a bien été ajouté.", errorMessage: 'Une erreur est intervenue. Veuillez rééssayer plus tard.' }
    )
  }

  const handleUserRemoval = ucId => () => {
    return handleResponse(api.deleteUserComposter(ucId), {
      successMessage: "L'ouvreur a bien été ajouté.",
      errorMessage: 'Une erreur est intervenue. Veuillez rééssayer plus tard.'
    })
  }

  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Les ouvreurs de {composter.name} - un composteur géré par Compostri</title>
      </Head>
      <div>
        <Typography variant="h1">Liste d&apos;ouvreurs pour {composter.name}</Typography>
        {!users ? (
          <Box align="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Box my={2}>
            <Grid container spacing={2}>
              {users.length > 0 ? (
                users.map(({ id, user, ...info }) => (
                  <Grid item md={3} xs={6} key={`ouvr-${id}`}>
                    <OuvreurCard user={user} ucId={info['@id']} onUserRemoval={handleUserRemoval(info['@id'])} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography>Aucun ouvreur pour le moment</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </div>
      <Button variant="contained" color="secondary" className={classes.btnAdd} onClick={handleOpen}>
        Ajouter un nouvel ouvreur
      </Button>
      <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={handleClose}>
        <Paper elevation={1} className={classes.modalPaper}>
          <div className={classes.modalHeader}>
            <Tabs
              className={classes.tabs}
              value={activeTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={event => setActiveTab(event.currentTarget.id)}
              aria-label="Ajout d'un compte ouvreur"
            >
              <Tab className={classes.tab} label="Création d'un compte" id="creation-compte" value="creation-compte" aria-controls="creation-compte-content" />
              <Tab
                className={classes.tab}
                label="Recherche d'un compte existant"
                id="recherche-compte"
                value="recherche-compte"
                aria-controls="recherche-compte-content"
              />
            </Tabs>

            <IconButton className={classes.modalFermer} onClick={handleClose}>
              <Clear />
            </IconButton>
          </div>
          <Box
            p={3}
            className={classes.box}
            role="tabpanel"
            hidden={activeTab !== 'creation-compte'}
            id="creation-compte-content"
            aria-labelledby="creation-compte"
          >
            <RegisterForm onSubmit={handleRegisterFormSubmit} />
          </Box>
          <Box
            p={3}
            className={classes.box}
            role="tabpanel"
            hidden={activeTab !== 'recherche-compte'}
            id="recherche-compte-content"
            aria-labelledby="recherche-compte"
          >
            <AddUserComposterForm onSubmit={handleUserAddingSubmit} />
          </Box>
        </Paper>
      </Modal>
    </ComposterContainer>
  )
}

ComposterOuvreurs.propTypes = {
  composter: composterType.isRequired
}

ComposterOuvreurs.getInitialProps = async ctx => {
  const res = await api.getComposter(ctx.query.slug)
  const composter = res.data

  return {
    composter
  }
}

export default ComposterOuvreurs
