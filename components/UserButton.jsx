import React, { useState, useRef, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Popper, List, ListItem, ListItemText, ListItemIcon, Collapse, Fade, Box, Grow } from '@material-ui/core'
import { Lens, ExpandMore, ExpandLess } from '@material-ui/icons'
import { UserContext } from '~/context/UserContext'
import palette from '~/variables'

const useStyles = makeStyles(theme => ({
  UserButtonLog: {
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  },
  menu: {
    zIndex: '100',
    borderRadius: 2,
    overflow: 'hidden',
    width: 222,
    marginTop: 5
  },
  nested: {
    paddingLeft: theme.spacing(1),
    backgroundColor: palette.orangePrimary,
    color: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255,255,255,.7)',
    '&:last-child': {
      border: 0
    },
    '&:hover, &:focus': {
      backgroundColor: palette.orangeOpacity
    },
    '& span': {
      fontWeight: 700,
      color: '#fff'
    }
  },
  nestedSecondary: {
    borderBottomWidth: '.5px',
    borderBottomColor: 'rgba(255,255,255,.3)',
    borderBottomStyle: 'solid',
    backgroundColor: palette.orangeOpacity,
    fontWeight: 400,
    paddingLeft: theme.spacing(1),
    color: 'white',
    '&:hover': {
      backgroundColor: palette.orangePrimary
    },
    '& span': {
      color: '#fff'
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
  const [openSubMenu, setOpenSubMenu] = useState(false)
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
        className={classes.UserButtonLog}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
      >
        Mon compte
      </Button>

      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center top' }} timeout={350}>
            <Box className={classes.menu}>
              <List disablePadding component="nav">
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
                        <ListItem button className={classes.nestedSecondary}>
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
            </Box>
          </Grow>
        )}
      </Popper>
    </>
  ) : (
    <Link href={{ pathname: '/login', query: { ref: router.asPath } }} passHref>
      <Button color="secondary" variant="contained" className={classes.UserButtonLog}>
        Se connecter
      </Button>
    </Link>
  )
}

export default UserButton
