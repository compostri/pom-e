import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, IconButton, Modal, Button, CircularProgress, Avatar } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import palette from '~/variables'
import { getInitial } from '~/utils/utils'
import { userType } from '~/types'

const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(2)
  },
  ouvreurAvatar: {
    margin: '0 auto',
    width: 30,
    height: 30,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700'
  },
  ouvreurAvatarGreen: {
    backgroundColor: palette.greenOpacity,
    color: palette.greenPrimary
  },
  ouvreurAvatarGrey: {
    backgroundColor: palette.greyExtraLight,
    color: palette.greyMedium
  },
  ouvreurInfo: {
    color: palette.greyMedium,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center'
  },
  ouvreurName: {
    fontWeight: '700'
  },
  supprOuvreur: {
    backgroundColor: palette.greenOpacity,
    color: palette.greenPrimary,
    fontWeight: '700',
    margin: '0 auto',
    display: 'block',
    border: '1px solid',
    borderColor: 'transparent',
    marginTop: theme.spacing(1),
    '&:hover': {
      borderColor: palette.greenPrimary,
      backgroundColor: palette.greenOpacity
    }
  },
  supprOuvreurDisabled: {
    backgroundColor: palette.greyExtraLight,
    color: palette.grey,
    '&:hover': {
      borderColor: palette.grey,
      backgroundColor: palette.greyExtraLight
    }
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    padding: theme.spacing(6),
    margin: theme.spacing(0, 2),
    outline: 'none',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3)
    }
  },
  modalHeader: {
    display: 'flex',
    paddingBottom: theme.spacing(4)
  },
  modalTitle: {
    color: palette.greyDark,
    fontSize: 20,
    fontWeight: '700',
    flexGrow: '1'
  },
  modalFermer: {
    padding: '0'
  },
  formOuvreurs: {
    margin: '0 auto',
    display: 'block'
  },
  btnAdd: {
    height: 47,
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    backgroundColor: palette.redPrimary,
    margin: '0 auto',
    display: 'block',
    marginTop: theme.spacing(4),
    '&:hover': {
      backgroundColor: palette.redOpacity
    }
  },
  modalUser: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    display: 'flex'
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
  }
}))

const OuvreurCard = ({ user, onUserRemoval }) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  const handleUserRemoval = () => {
    setIsDeleting(true)
    onUserRemoval().finally(() => {
      setIsDeleting(false)
      handleClose()
    })
  }

  const statutClassesAvatar = classes.ouvreurAvatarGreen

  return (
    <Paper elevation={1} className={classes.card}>
      <Avatar className={classes.ouvreurAvatar} aria-label={user.username}>
        {user.username[0].toUpperCase()}
      </Avatar>
      <Typography className={[classes.ouvreurInfo, classes.ouvreurName].join(' ')}>{user.username}</Typography>
      <Typography className={classes.ouvreurInfo}>{user.email}</Typography>

      <Button className={classNames(classes.supprOuvreur, { [classes.supprOuvreurDisabled]: !user.enabled })} onClick={handleOpen}>
        Supprimer de ce composteur
      </Button>
      <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={handleClose}>
        <Paper elevation={1} className={classes.modalPaper}>
          <div className={classes.modalHeader}>
            <Typography variant="h1" className={classes.modalTitle}>
              Supprimer de ce composteur
            </Typography>
            <IconButton className={classes.modalFermer} onClick={handleClose}>
              <Clear />
            </IconButton>
          </div>

          <div className={classes.modalUser}>
            <div className={[classes.modalAvatar, statutClassesAvatar].join(' ')}>{getInitial(user.username)}</div>
            <Typography className={classes.modalUserName}>{user.username}</Typography>
          </div>

          <Button onClick={handleUserRemoval} fullWidth className={classes.btnAdd}>
            {isDeleting ? <CircularProgress /> : 'Confirmer'}
          </Button>
        </Paper>
      </Modal>
    </Paper>
  )
}

OuvreurCard.propTypes = {
  user: userType.isRequired,
  onUserRemoval: PropTypes.func.isRequired
}
export default OuvreurCard
