import React from 'react'
import Link from 'next/link'

import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'
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
  }
}))

const Sidebar = ({ allCommunes, allCategories, selectedCommune, setSelectedCommune, selectedCategories, setSelectedCategories }) => {
  const classes = useStyles()

  const toggleCategories = cat => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat))
    } else {
      setSelectedCategories([cat, ...selectedCategories])
    }
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
        <FormGroup>
          {allCategories &&
            allCategories.map(c => (
              <FormControlLabel
                control={<Checkbox checked={selectedCategories.includes(c.id)} onChange={() => toggleCategories(c.id)} value={c.id} />}
                label={c.name}
              />
            ))}
        </FormGroup>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="communes">Communes</InputLabel>
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
      </section>
      <section className={classes.sidebarFooter} />
    </Paper>
  )
}

export default Sidebar
