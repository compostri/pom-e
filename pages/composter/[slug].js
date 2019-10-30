import Link from 'next/link'
import React from 'react'
import api from '../../utils/api'
import { Paper, Typography, AppBar, Button, Toolbar, Popper, List, ListItem, ListItemText, SvgIcon, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess, Lens, ChevronLeft } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '../../variables'

const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge']

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'white',
    shadowColor: palette.greyMedium,
    shadowOffset: { width: 1, height: 0 },
    shadowRadius: 2
  },
  logo: {
    width: 80,
    height: 175,
    backgroundColor: palette.greenPrimary
  },
  logoSvg: {
    display: 'Block',
    margin: '0 auto',
    paddingTop: '50%'
  },
  toolbarGlobal: {
    alignItems: 'flex-end'
  },
  toolbarTitle: {
    display: 'flex'
  },
  toolbarLeft: {
    flexGrow: '1',
    marginLeft: '30px'
  },
  UserButtonLog: {
    alignSelf: 'center',
    marginBottom: '40px',
    marginRight: '40px'
  },
  title: {
    color: palette.greyDark,
    fontFamily: 'PT Sans',
    fontSize: '28px',
    fontWeight: '700'
  },
  button: {
    color: palette.greyDark,
    fontFamily: 'PT Sans',
    fontSize: '16px',
    fontWeight: '400',
    borderBottomStyle: 'solid',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    paddingTop: '40px',
    marginRight: '20px',
    paddingBottom: '25px',
    '&:hover': {
      borderBottomColor: palette.greenPrimary,
      backgroundColor: 'white'
    }
  },
  nested: {
    paddingLeft: theme.spacing(2),
    backgroundColor: palette.orangeOpacity,
    color: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '0.2px',
    borderBottomColor: 'white',
    '&:hover': {
      backgroundColor: palette.orangePrimary
    }
  },
  lens: {
    width: '5px',
    marginRight: '10px'
  },
  UserMenu: {
    backgroundColor: palette.orangePrimary,
    color: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '0.2px',
    borderBottomColor: 'white',
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  }
}))

const Header = ({ title }) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [openSubMenu, setOpenSubMenu] = React.useState(true)
  const anchorRef = React.useRef(null)
  const [selectedIndex, setSelectedIndex] = React.useState(1)

  const handleToggle = () => {
    setOpen(open => !open)
  }
  const handleClick = () => {
    setOpenSubMenu(!openSubMenu)
  }
  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar className={classes.toolbarGlobal} disableGutters>
        <Link href="/" passHref>
          <a className={classes.logo}>
            <img className={classes.logoSvg} src="/static/logo2.svg" />
          </a>
        </Link>
        <div className={classes.toolbarLeft}>
          <div className={classes.toolbarTitle}>
            <Link href="/" passHref>
              <a>
                <ChevronLeft />
              </a>
            </Link>
            <Typography variant="h1" className={classes.title}>
              {title}
            </Typography>
          </div>
          <div className={classes.toolbarLink}>
            <Button className={classes.button}>Informations</Button>
            <Button className={classes.button}>Permanences</Button>
            <Button className={classes.button}>Stastiques</Button>
            <Button className={classes.button}>Listes d'ouvreurs</Button>
            <Button className={classes.button}>Newsletter</Button>
          </div>
        </div>

        <Button onClick={handleToggle} color="secondary" ref={anchorRef} variant="contained" className={(classes.userButton, classes.UserButtonLog)}>
          Mon compte
          {open ? <ExpandLess /> : <ExpandMore />}
        </Button>

        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal>
          <List component="nav">
            <ListItem button className={classes.UserMenu}>
              <ListItemText primary="Mon Profil" />
            </ListItem>

            <ListItem button className={classes.UserMenu} onClick={handleClick}>
              <ListItemText primary="Mes composteurs" />
              {openSubMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <Lens className={classes.lens} />
                  <ListItemText primary="Composteur 1" />
                </ListItem>
                <ListItem button className={classes.nested}>
                  <Lens className={classes.lens} />
                  <ListItemText primary="Composteur 2" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button className={classes.UserMenu}>
              <ListItemText primary="Se déconnecter" />
            </ListItem>
          </List>
        </Popper>
      </Toolbar>
    </AppBar>
  )
}
/**
 * 
 * 
DateInauguration: null
DateInstallation: null
DateMiseEnRoute: "2009-06-26T00:00:00+00:00"
address: "allée de la cité"
animation: 2
autonomie: 3
cadena: ""
commune: {@id: "/communes/2", @type: "Commune", id: 2, name: "Nantes"}
description: null
environnement: 3
id: 2
lat: 47.207748
lng: -1.540578
mc: {@id: "/users/7", @type: "User", id: 7, username: "samir@compostri.fr", email: "samir@compostri.fr"}
name: "Beaulieu"
pavilionsVolume: {@id: "/pavilions_volumes/1", @type: "PavilionsVolume", id: 1, volume: "20"}
pole: null
quartier: {@id: "/quartiers/17", @type: "Quartier", name: "Nantes Île-de-Nantes"}
shortDescription: ""
technique: 3

 * @param {*} param0 
 */
const Content = ({ composter }) => {
  return (
    <>
      <Paper>
        <Typography variant="h2">Informations sur le site de compostage</Typography>
        <Typography paragraph>{composter.address} </Typography>
        <Typography paragraph>{composter.quartier['@type']}</Typography>
      </Paper>
      <Paper>
        <Typography variant="h2">Contactez-nous pour toutes vos questions</Typography>
      </Paper>
    </>
  )
}

const ComposterDetail = ({ composter }) => {
  return (
    <>
      <Header title={composter.name} />
      <Content composter={composter} />
    </>
  )
}

ComposterDetail.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterDetail
