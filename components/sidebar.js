import React, { useState } from 'react'
import Link from 'next/link'
import SearchBar from './SearchBar'
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
  Icon,
  Fab
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MenuOpen, Eco, Search } from '@material-ui/icons'
import classNames from 'classnames'
import palette from '~/variables'

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
    overflow: 'scroll'
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
    padding: theme.spacing(3.75)
  },
  formControl: {
    display: 'block'
  },
  formControlLabel: {
    display: 'block'
  },
  formSectionTitle: {
    textTransform: 'uppercase',
    fontSize: 12,
    color: palette.greyLight
  },

  buttonMenu: {
    position: 'absolute',
    top: '50%',
    right: '-25px',
    zindex: 110
  },
  iconLogo: {
    right: '10px'
  },
  iconButton: {
    left: 15,
    top: 20
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
  setSelectedStatus
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
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

  const [state, setState] = React.useState({
    checkedA: true
  })

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked })
  }

  return (
    <div className={classNames(classes.sidebarContainer, { [classes.sidebarContainerClosed]: !open })}>
      <Paper component="section" elevation={2} className={classes.innerSidebar}>
        <header className={classes.sidebarHeader}>
          {open && (
            <Link href="/index" as="/">
              <a>
                <img src="/static/logo.svg" />
              </a>
            </Link>
          )}
          {!open && (
            <IconButton size="medium" className={classes.iconLogo}>
              <Eco />
            </IconButton>
          )}
          {open && (
            <Typography paragraph={true} align={'center'}>
              Carte des sites de compostage partagé
            </Typography>
          )}
        </header>

        {open ? (
          <SearchBar />
        ) : (
          <IconButton size="medium" className={classes.iconButton} onClick={() => handleClick() && focusMethod()}>
            <Search />
          </IconButton>
        )}
        <section className={classes.sidebarContent}>
          {open && (
            <FormGroup className={classes.formControl}>
              <Typography paragraph className={classes.formSectionTitle}>
                Catégorie
              </Typography>
              {allCategories &&
                allCategories.map(c => (
                  <FormControlLabel
                    control={
                      <>
                        <Checkbox checked={selectedCategories.includes(c.id)} onChange={() => toggleCategories(c.id)} value={c.id} />
                      </>
                    }
                    label={c.name}
                    className={classes.formControlLabel}
                    key={`checkbox-cat-${c.id}`}
                  />
                ))}
            </FormGroup>
          )}
          {open && (
            <FormControl className={classes.formControl}>
              <Typography paragraph className={classes.formSectionTitle}>
                Statut
              </Typography>
              {['Active', 'InProject'].map(status => (
                <Button
                  variant={selectedStatus.includes(status) ? 'outlined' : 'contained'}
                  color={selectedStatus.includes(status) ? 'primary' : undefined}
                  onClick={() => toggleStatus(status)}
                  className={classes.button}
                  key={`button-status-${status}`}
                >
                  {status === 'Active' ? 'En service' : 'En projet'}
                </Button>
              ))}
            </FormControl>
          )}
          {open && (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="communes" className={classes.formSectionTitle}>
                Communes
              </InputLabel>
              <Select
                value={selectedCommune}
                onChange={event => {
                  setSelectedCommune(event.target.value)
                }}
                inputProps={{
                  name: 'communes',
                  id: 'communes'
                }}
              >
                {allCommunes &&
                  allCommunes.map(c => (
                    <MenuItem key={`commune-option-${c.id}`} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          {open && (
            <FormGroup row>
              <FormControlLabel
                control={<Switch checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />}
                label="Composteur qui accepte de nouveaux adhérents"
              />
            </FormGroup>
          )}
        </section>
        <section className={classes.sidebarFooter} />
      </Paper>
      <Fab color="secondary" size="medium" className={classes.buttonMenu} onClick={() => handleClick()}>
        <MenuOpen />
      </Fab>
    </div>
  )
}

export default Sidebar
