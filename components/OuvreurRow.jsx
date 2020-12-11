import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Typography, IconButton, Avatar, TableRow, TableCell, Grid, Switch, Box } from '@material-ui/core'
import { Delete, Edit } from '@material-ui/icons'
import palette from '~/variables'
import { getInitial } from '~/utils/utils'
import { userComposerType } from '~/types'

const useStyles = makeStyles(theme => ({
  ouvreurAvatar: {
    width: 30,
    height: 30,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: palette.greenOpacity,
    color: palette.greenPrimary,
    marginRight: theme.spacing(1)
  },
  ouvreurAvatarGrey: {
    backgroundColor: palette.greyExtraLight,
    color: palette.greyMedium
  },
  ouvreurInfo: {
    color: palette.greyMedium,
    fontSize: 14
  },
  ouvreurName: {
    fontWeight: '700'
  },
  containedButton: {
    backgroundColor: palette.redPrimary,
    color: palette.white,
    margin: theme.spacing(0, 1),
    '&:hover, &:focus': {
      backgroundColor: palette.white,
      color: palette.redOpacity
    }
  }
}))

const OuvreurRow = ({ userComposter, callDeleteUser, callUpdateUserComposer, callUpdateUserComposerNoModal }) => {
  const classes = useStyles()
  const { user } = userComposter
  return (
    <TableRow elevation={1} className={classes.card}>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Avatar className={classNames(classes.ouvreurAvatar, { [classes.ouvreurAvatarGrey]: !user.enabled })} aria-label={user.username}>
            {getInitial(user.username)}
          </Avatar>
          <Typography className={[classes.ouvreurInfo, classes.ouvreurName].join(' ')}>{user.username}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography className={classes.ouvreurInfo}>
          {user.firstname} {user.lastname}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className={classes.ouvreurInfo}>{user.email}</Typography>
      </TableCell>
      <TableCell>
        {userComposter.capability === 'Referent' ? (
          <Typography className={classes.ouvreurInfo}>Référent</Typography>
        ) : (
          <Typography className={classes.ouvreurInfo} component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>Utilisateur</Grid>
              <Grid item>
                <Switch
                  checked={userComposter.capability === 'Opener'}
                  onChange={() =>
                    callUpdateUserComposerNoModal({ ...userComposter, ...{ capability: userComposter.capability === 'Opener' ? 'User' : 'Opener' } })
                  }
                  name="checkedC"
                />
              </Grid>
              <Grid item>Ouvreur</Grid>
            </Grid>
          </Typography>
        )}
      </TableCell>

      <TableCell>
        {userComposter.capability !== 'Referent' && (
          <>
            <IconButton size="small" className={classes.containedButton} onClick={() => callDeleteUser(user)}>
              <Delete />
            </IconButton>
            <IconButton size="small" className={classes.containedButton} onClick={() => callUpdateUserComposer(userComposter)}>
              <Edit />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  )
}

OuvreurRow.propTypes = {
  userComposter: userComposerType.isRequired,
  callDeleteUser: PropTypes.func.isRequired,
  callUpdateUserComposer: PropTypes.func.isRequired,
  callUpdateUserComposerNoModal: PropTypes.func.isRequired
}
export default OuvreurRow
