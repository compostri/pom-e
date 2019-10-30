import React from 'react'
import Link from 'next/link'

import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Button, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import palette from '../variables'

const useStyles = makeStyles(theme => ({
  sidebarContainer: {
    position: 'fixed',
    top: 0,
    minWidth: '420px',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 100
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
    <Paper component="section" elevation={2} className={classes.sidebarContainer}>
      <header className={classes.sidebarHeader}>
        <Link href="/index" as="/">
          <a>
            <img src="/static/logo.svg" />
          </a>
        </Link>
        <Typography paragraph={true} align={'center'}>
          Carte des sites de compostage partagé
        </Typography>
      </header>
      <section className={classes.sidebarContent}>
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
            >
              {status === 'Active' ? 'En service' : 'En projet'}
            </Button>
          ))}
        </FormControl>

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

        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={state.checkedA} onChange={handleChange('checkedA')} value="checkedA" />}
            label="Composteur qui accepte de nouveaux adhérents"
          />
        </FormGroup>
      </section>
      <section className={classes.sidebarFooter} />
    </Paper>
  )
}

export default Sidebar
