import React, { useState, useRef, useContext } from 'react'
import { UserContext } from '~/context/UserContext'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import palette from '~/variables'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Popper, List, ListItem, ListItemText, ListItemIcon, Collapse, Fade } from '@material-ui/core'
import { Lens, ExpandMore, ExpandLess } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  UserButtonLog: {
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  },
  btnOpen: {
    zIndex: '100'
  },
  nested: {
    paddingLeft: theme.spacing(1),
    backgroundColor: palette.orangePrimary,
    color: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'white',
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    },
    '& span': {
      color: '#fff'
    }
  },
  nestedSecondary: {
    backgroundColor: palette.orangeOpacity,
    '&:hover': {
      backgroundColor: palette.orangePrimary
    }
  },
  arrow: {
    color: 'white'
  },
  lens: {
    width: '5px',
    color: 'white'
  },
  listIcon: {
    minWidth: '25px',
    paddingLeft: theme.spacing(1)
  }
}))

const UserButton = () => {
  const classes = useStyles()
  const { userContext } = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(true)
  const anchorRef = useRef(null)
  const router = useRouter()

  const handleToggle = () => {
    setOpen(!open)
  }
  const handleClick = () => {
    setOpenSubMenu(!openSubMenu)
  }

  return userContext.isLoggedIn() ? (
    <>
      <Button
        onClick={handleToggle}
        color="secondary"
        ref={anchorRef}
        variant="contained"
        className={[classes.userButton, classes.UserButtonLog].join(' ')}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
      >
        Mon compte
      </Button>

      <Popper className={classes.btnOpen} open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <List component="nav">
              <Link href="/profil" passHref>
                <ListItem button className={classes.nested}>
                  <ListItemText>Mon Profil</ListItemText>
                </ListItem>
              </Link>

              <ListItem button className={classes.nested} onClick={handleClick}>
                <ListItemText>Mes composteurs</ListItemText>
                <ListItemIcon>{openSubMenu ? <ExpandLess className={classes.arrow} /> : <ExpandMore className={classes.arrow} />}</ListItemIcon>
              </ListItem>
              <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {userContext.user.composters.map(c => (
                    <Link key={c.slug} href="/composter/[slug]" as={`/composter/${c.slug}`} passHref>
                      <ListItem button className={classNames(classes.nested, classes.nestedSecondary)}>
                        <ListItemIcon className={classes.listIcon}>
                          <Lens className={classes.lens} />
                        </ListItemIcon>
                        <ListItemText>{c.name}</ListItemText>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Collapse>
              <ListItem
                button
                className={classes.nested}
                onClick={() => {
                  userContext.logout()
                }}
              >
                <ListItemText primary="Se déconnecter" />
              </ListItem>
            </List>
          </Fade>
        )}
      </Popper>
    </>
  ) : (
    <Link href={{ pathname: '/login', query: { ref: router.asPath } }} passHref>
      <Button color="secondary" variant="contained" className={[classes.userButton, classes.UserButtonLog].join(' ')}>
        Se connecter
      </Button>
    </Link>
  )
}

export default UserButton