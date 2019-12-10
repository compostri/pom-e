import React, { useState } from 'react'
import Link from 'next/link'
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Switch,
  IconButton,
  Fab,
  Collapse,
  Box
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MenuOpen, Eco, Search, Close, ColorLens } from '@material-ui/icons'
import classNames from 'classnames'
import SearchBar from './SearchBar'
import palette from '~/variables'
import { getCategoryColor } from '~/utils/utils'

const useStyles = makeStyles(theme => ({
  sidebarContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '420px',
    backgroundColor: 'white',
    zIndex: 100,
    transition: 'all .3s'
  },
  sidebarContainerClosed: {
    width: '80px'
  },
  innerSidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    overflow: 'auto'
  },
  sidebarHeader: {
    textAlign: 'center',
    padding: theme.spacing(3.75),
    color: 'white',
    backgroundColor: palette.greenPrimary
  },
  sidebarContent: {
    padding: theme.spacing(3.75)
  },
  sidebarFooter: {
    padding: theme.spacing(3.75),
    '& p': {
      color: palette.greyDark,
      fontWeight: '700'
    },
    '& a': {
      color: palette.greenPrimary,
      textDecoration: 'none'
    }
  },
  formControl: {
    display: 'block',
    margin: theme.spacing(4, 0)
  },
  reinit: {
    fontSize: 12,
    fontWeight: 400,
    padding: 1,
    borderRadius: 0,
    borderBottom: `2px solid ${theme.palette.primary.main}`
  },
  formControlLabel: {
    display: 'block',
    color: palette.greyMedium,
    fontSize: 14,
    fontWeight: 700
  },
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  },
  formSectionTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
    color: palette.greyLight,
    fontWeight: 700,
    letterSpacing: 1
  },

  buttonMenu: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translate(50%, -50%)',
    zindex: 110
  },
  iconLogo: {
    right: '10px'
  },
  iconButton: {
    left: 15,
    top: 20
  },
  slogan: {
    fontStyle: 'italic',
    fontSize: 18,
    letterSpacing: 0.5,
    color: palette.white
  },
  categorie: { marginTop: theme.spacing(2) },
  catFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 2,
    backgroundColor: '#faf9f8',
    padding: theme.spacing(1, 2),
    margin: theme.spacing(0, 0, 0.5, 0),
    '&:after': {
      content: '""',
      width: 20,
      height: 20,
      border: 'solid',
      borderColor: 'white',
      borderRadius: 50,
      marginLeft: 'auto',
      boxShadow: '1px 2px 1px #e5E5E5'
    }
  },
  catFilterLabel: {
    color: palette.greyMedium,
    fontSize: 14,
    fontWeight: 700
  },
  catFilterQuartier: {
    '&:after': {
      backgroundColor: '#7bced1'
    }
  },
  catFilterPrive: {
    '&:after': {
      backgroundColor: '#e86034'
    }
  },
  catFilterScolaire: {
    '&:after': {
      backgroundColor: '#6c3727'
    }
  },
  catFilterJardin: {
    '&:after': {
      backgroundColor: '#a3c538'
    }
  },
  button: {
    marginRight: 5
  }
}))

const Sidebar = ({
  allCommunes,
  allCategories,
  selectedCommune,
  setSelectedCommune,
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  acceptNewMembers,
  setAcceptNewMembers,
  openSidebar,
  setOpenSidebar
}) => {
  const classes = useStyles()
  const statuses = [
    { value: 'Active', label: 'En service' },
    { value: 'InProject', label: 'En projet' }
  ]

  const handleClick = () => {
    setOpenSidebar(!openSidebar)
  }

  const toggleCategories = cat => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat))
    } else {
      setSelectedCategories([cat, ...selectedCategories])
    }
  }
  const toggleStatus = status => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter(s => s !== status))
    } else {
      setSelectedStatus([status, ...selectedStatus])
    }
  }

  const reinit = () => {
    setSelectedCategories(allCategories.map(c => c.id))
    setSelectedCommune(allCommunes.map(c => c.id))
    setSelectedStatus([statuses[0].value])
    setAcceptNewMembers(true)
  }

  function getLabelColor(c) {
    const color = getCategoryColor(c)

    switch (color) {
      case '#7bced1':
        return classes.catFilterQuartier
      case '#e86034':
        return classes.catFilterPrive
      case '#6c3727':
        return classes.catFilterScolaire
      case '#a3c538':
        return classes.catFilterJardin
      default:
        return classes.catFilterQuartier
    }
  }

  const renderHeader = () => {
    return (
      <header className={classes.sidebarHeader}>
        {openSidebar && (
          <Link href="/index" as="/" passHref>
            <a>
              <img src="/static/logo.svg" alt="Logo de Compostri" />
            </a>
          </Link>
        )}
        {!openSidebar && (
          <IconButton size="medium" className={classes.iconLogo}>
            <Eco />
          </IconButton>
        )}
        {openSidebar && (
          <Typography align="center" className={classes.slogan}>
            Carte des sites de compostage partagé
          </Typography>
        )}
      </header>
    )
  }

  const renderSearchBar = () => {
    return openSidebar ? (
      <SearchBar />
    ) : (
      <IconButton size="medium" className={classes.iconButton} onClick={() => handleClick() && focusMethod()}>
        <Search />
      </IconButton>
    )
  }

  const renderFilters = () => {
    return (
      <section className={classes.sidebarContent}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h2">Filtrer mes recherches</Typography>
          <Button disableRipple onClick={reinit} className={classes.reinit}>
            Effacer les filtres
          </Button>
        </Box>

        <FormGroup className={classes.formControl}>
          <Typography className={classes.formSectionTitle}>Catégorie</Typography>
          <div className={classes.categorie}>
            {allCategories &&
              allCategories.map(c => (
                <>
                  <FormControlLabel
                    control={<Checkbox color="primary" checked={selectedCategories.includes(c.id)} onChange={() => toggleCategories(c.id)} value={c.id} />}
                    label={c.name}
                    className={classNames(classes.formControlLabel, getLabelColor(c))}
                    classes={{ root: classes.catFilter, label: classes.catFilterLabel }}
                    key={`checkbox-cat-${c.id}`}
                  />
                </>
              ))}
          </div>
        </FormGroup>
        <FormControl className={classes.formControl}>
          <Typography paragraph className={classes.formSectionTitle}>
            Statut
          </Typography>
          {statuses.map(status => (
            <Button
              size="small"
              variant={selectedStatus.includes(status.value) ? 'outlined' : 'contained'}
              color={selectedStatus.includes(status.value) ? 'primary' : undefined}
              onClick={() => toggleStatus(status.value)}
              className={classes.button}
              key={`button-status-${status.value}`}
            >
              {status.label}
            </Button>
          ))}
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <Typography className={classes.formSectionTitle}>Communes</Typography>
          <InputLabel htmlFor="communes" className={classNames(classes.formSectionTitle, classes.hidden)}>
            Communes
          </InputLabel>
          <Select
            fullWidth
            value={selectedCommune.length > 1 ? 'all' : selectedCommune}
            onChange={event => {
              setSelectedCommune(event.target.value === 'all' ? allCommunes.map(c => c.id) : [event.target.value])
            }}
            inputProps={{
              name: 'communes',
              id: 'communes'
            }}
          >
            <MenuItem value="all">Toutes</MenuItem>
            {allCommunes &&
              allCommunes.map(c => (
                <MenuItem key={`commune-option-${c.id}`} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={acceptNewMembers} onChange={() => setAcceptNewMembers(!acceptNewMembers)} value="acceptNewMembers" />}
            label="Composteur qui accepte de nouveaux adhérents"
          />
        </FormGroup>
      </section>
    )
  }

  const renderFooter = () => {
    return (
      <section className={classes.sidebarFooter}>
        <Typography align="center">
          Accéder à <a href="https://www.compostri.fr">Compostri.fr</a>
        </Typography>
      </section>
    )
  }

  return (
    <div className={classNames(classes.sidebarContainer, { [classes.sidebarContainerClosed]: !openSidebar })}>
      <Paper component="section" elevation={2} className={classes.innerSidebar}>
        {renderHeader()}
        {renderSearchBar()}
        <Collapse in={openSidebar} timeout={100}>
          <>
            {renderFilters()}
            {renderFooter()}
          </>
        </Collapse>
      </Paper>
      <Fab color="secondary" size="medium" className={classes.buttonMenu} onClick={() => handleClick()}>
        {openSidebar ? <Close /> : <MenuOpen />}
      </Fab>
    </div>
  )
}

export default Sidebar
