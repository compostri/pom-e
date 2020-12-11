import React, { useState, useEffect, useCallback } from 'react'
import { Typography, IconButton, Button, Modal, Tabs, Tab, Paper, CircularProgress, Box, Table, TableBody, Avatar } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { Clear } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Head from 'next/head'

import api from '~/utils/api'
import { useToasts, TOAST } from '~/components/Snackbar'
import ComposterContainer from '~/components/ComposterContainer'
import OuvreurRow from '~/components/OuvreurRow'
import palette from '~/variables'
import RegisterForm from '~/components/forms/RegisterForm'
import AddUserComposterForm from '~/components/forms/AddUserComposterForm'
import { composterType } from '~/types'
import { getInitial } from '~/utils/utils'

const useStyles = makeStyles(theme => ({
  btnAdd: {
    margin: '0 auto',
    display: 'block'
  },
  btnNew: {
    marginTop: theme.spacing(4)
  },
  userTable: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  pagination: {
    margin: theme.spacing(4, 0)
  },
  paginationUl: {
    justifyContent: 'center'
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
  modalUser: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    display: 'flex',
    alignItems: 'center'
  },
  modalUserName: {
    color: palette.greyMedium,
    fontSize: 14,
    padding: (5, 0, 0, 5)
  },
  modalAvatar: {
    borderRadius: 100,
    width: 30,
    height: 30,
    textAlign: 'center',
    paddingTop: 4,
    fontSize: 14,
    fontWeight: '700'
  },
  modalTitle: {
    color: palette.greyDark,
    fontSize: 20,
    fontWeight: '700',
    flexGrow: '1'
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
  const [userToDelete, setUserToDelete] = useState(null)
  const [userComposerToUpdate, setUserComposerToUpdate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('creation-compte')
  const [users, setUsers] = useState([])
  const [usersTotalCount, setUsersTotalCount] = useState(0)
  const [usersTotalPages, setUsersTotalPages] = useState(1)
  const [usersCurrentPages, setUsersCurrentPages] = useState(1)
  const [fetchingUsers, setFetchingUsers] = useState(false)
  const { addToast } = useToasts()

  const getUsers = useCallback(async () => {
    setFetchingUsers(true)
    const perPage = 10
    const data = await api.getUserComposter({ composter: composter.rid, perPage: perPage, page: usersCurrentPages }).catch(console.error)
    setFetchingUsers(false)
    const userCount = data['hydra:totalItems']
    setUsersTotalCount(userCount)
    setUsersTotalPages(Math.round(userCount / perPage))
    if (data) {
      setUsers(data['hydra:member'])
    }
  }, [composter.rid, usersCurrentPages])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
    setUserComposerToUpdate(null)
  }

  const handleResponse = (request, { successMessage, errorMessage }) => {
    return request
      .then(() => {
        addToast(successMessage, TOAST.SUCCESS)
        handleClose()
        getUsers()
      })
      .catch(error => {
        const responseErrorMessage = error.response && error.response.data['hydra:description']
        errorMessage = responseErrorMessage || errorMessage
        addToast(errorMessage, TOAST.ERROR)
      })
  }

  const handleRegisterFormSubmit = async ({ user, ...values }) => {
    return handleResponse(
      values['@id']
        ? api.updateUserComposter(values['@id'], {
            ...values,
            user: { ...user, userConfirmedAccountURL: `${window.location.origin}/confirmation` },
            composter: composter['@id']
          })
        : api.createUserComposter({
            ...values,
            user: { ...user, userConfirmedAccountURL: `${window.location.origin}/confirmation` },
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

  const handleUserRemoval = () => {
    setIsDeleting(true)
    handleResponse(api.deleteUserComposter(userToDelete['@id']), {
      successMessage: "L'utilisateur•rice a bien été supprimé.",
      errorMessage: 'Une erreur est intervenue. Veuillez rééssayer plus tard.'
    }).finally(() => {
      setIsDeleting(false)
      setUserToDelete(null)
    })
  }

  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Les ouvreurs de {composter.name} - un composteur géré par Compostri</title>
      </Head>
      <div>
        <Typography variant="h1">
          Liste des utilisateurs pour {composter.name} ({fetchingUsers ? '...' : usersTotalCount})
        </Typography>

        {fetchingUsers ? (
          <Box align="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Box style={{ overflow: 'auto' }}>
            <Table className={classes.userTable}>
              <TableBody>
                {users.map(userComposer => (
                  <OuvreurRow
                    key={`ouvr-${userComposer.id}`}
                    userComposter={userComposer}
                    callDeleteUser={u => setUserToDelete(u)}
                    callUpdateUserComposer={uc => {
                      handleOpen()
                      setUserComposerToUpdate(uc)
                    }}
                    callUpdateUserComposerNoModal={uc => handleRegisterFormSubmit(uc)}
                  />
                ))}
              </TableBody>
            </Table>
            {usersTotalPages > 1 && (
              <Pagination
                classes={{ root: classes.pagination, ul: classes.paginationUl }}
                size="small"
                count={usersTotalPages}
                page={usersCurrentPages}
                onChange={(event, value) => setUsersCurrentPages(value)}
              />
            )}
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
            <RegisterForm onSubmit={handleRegisterFormSubmit} userComposerToUpdate={userComposerToUpdate} />
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
      <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={userToDelete !== null} onClose={handleClose}>
        <Paper elevation={1} className={classes.modalPaper}>
          <div className={classes.modalHeader}>
            <Typography variant="h1" className={classes.modalTitle}>
              Supprimer de ce composteur
            </Typography>
            <IconButton className={classes.modalFermer} onClick={() => setUserToDelete(null)}>
              <Clear />
            </IconButton>
          </div>

          {userToDelete && (
            <div className={classes.modalUser}>
              <Avatar className={classes.ouvreurAvatar} aria-label={userToDelete.username}>
                {getInitial(userToDelete.username)}
              </Avatar>
              <Typography className={classes.modalUserName}>{userToDelete.username}</Typography>
            </div>
          )}

          <Button onClick={handleUserRemoval} fullWidth className={classes.btnAdd}>
            {isDeleting ? <CircularProgress /> : 'Confirmer'}
          </Button>
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
