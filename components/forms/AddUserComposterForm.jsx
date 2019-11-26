import React, { useContext } from 'react'
import { Typography, TextField, Grid, Avatar } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import throttle from 'lodash/throttle'
import api from '~/utils/api'
import { ComposterContext } from '~/context/ComposterContext'
import { getInitial } from '~/utils/utils'

const useStyles = makeStyles(() => ({
  autocomplete: {
    width: '100%'
  }
}))

const AddUserComposterForm = () => {
  const classes = useStyles()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState([])

  const handleChange = event => {
    setInputValue(event.target.value)
  }

  const fetch = React.useMemo(
    () =>
      throttle(input => {
        api.getUserComposter({ composter: composter.rid, user: input })
      }, 200),
    [composter.rid]
  )

  React.useEffect(() => {
    let active = true

    if (inputValue === '') {
      setOptions([])
      return undefined
    }

    fetch({ input: inputValue }, results => {
      if (active) {
        setOptions(results || [])
      }
    })

    return () => {
      active = false
    }
  }, [inputValue, fetch])

  return (
    <>
      <div className={classes.search}>
        <Autocomplete
          className={classes.autocomplete}
          id="searchuc"
          freeSolo
          getOptionLabel={option => option.username}
          options={options}
          renderInput={params => (
            <TextField
              {...params}
              label="Ajouter un utilisateur existant"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true
              }}
              onChange={handleChange}
              InputProps={{
                ...params.InputProps,
                endAdornment: <Search />
              }}
            />
          )}
          renderOption={option => {
            console.log(option)

            return (
              <Grid container alignItems="center">
                <Grid item>
                  <Avatar>{getInitial(option.username)}</Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="textSecondary">
                    {option.username}
                  </Typography>
                </Grid>
              </Grid>
            )
          }}
        />
      </div>
    </>
  )
}

export default AddUserComposterForm
