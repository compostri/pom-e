import React, { Fragment, useContext } from 'react'
import PropTypes from 'prop-types'
import { Typography, TextField, Box, Avatar, Button, CircularProgress } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import throttle from 'lodash/throttle'
import api from '~/utils/api'
import { ComposterContext } from '~/context/ComposterContext'
import { getInitial } from '~/utils/utils'
import { useToasts, TOAST } from '../Snackbar'

const useStyles = makeStyles(() => ({
  autocomplete: {
    width: '100%'
  }
}))

const propTypes = {
  onSubmit: PropTypes.func.isRequired
}
const AddUserComposterForm = ({ onSubmit }) => {
  const classes = useStyles()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)
  const { addToast } = useToasts()
  const [isLoading, setIsLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState({})
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const fetch = React.useMemo(
    () =>
      throttle((input, cb) => {
        setLoading(true)
        api.getUsers({ email: input }).then(cb)
      }, 200),
    []
  )

  React.useEffect(() => {
    let active = true

    if (inputValue.length < 5) {
      setOptions([])
      return undefined
    }

    fetch(inputValue, results => {
      setLoading(false)
      if (active) {
        setOptions(results.data['hydra:member'] || [])
      }
    })

    return () => {
      active = false
    }
  }, [inputValue, fetch])

  const onChange = (e, value) => {
    setSelectedUser(value)
  }

  const onInputChange = (e, value) => {
    setInputValue(value)
  }

  const handleSubmit = user => () => {
    if (!user.username) {
      addToast('Veuillez sélectionner un utilisateur.', TOAST.ERROR)
      return
    }
    setIsLoading(true)
    onSubmit(user['@id']).finally(() => setIsLoading(false))
  }

  return (
    <>
      <div className={classes.search}>
        <Autocomplete
          className={classes.autocomplete}
          id="searchuc"
          loading={loading}
          loadingText="Recherche en cours"
          noOptionsText={inputValue.length < 5 ? 'Tapez aux moins 5 lettres de son email' : 'Aucun utilisateur correspondant'}
          getOptionLabel={option => option.email}
          options={options}
          onInputChange={onInputChange}
          onChange={onChange}
          filterOptions={users => {
            const newUsers = [...users]
            return newUsers.filter(user => !user.userComposters.find(uc => uc.composter === composter['@id']))
          }}
          renderInput={params => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Ajouter un utilisateur existant"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: <Search />
              }}
            />
          )}
          renderOption={option => {
            return (
              <Fragment key={option.email}>
                <Box mr={2}>
                  <Avatar>{getInitial(option.username)}</Avatar>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {option.firstname} {option.lastname}
                </Typography>
              </Fragment>
            )
          }}
        />
        <Box align="center">
          <Button variant="contained" color="secondary" onClick={handleSubmit(selectedUser)}>
            {isLoading ? <CircularProgress size={24} /> : 'Associer'}
          </Button>
        </Box>
      </div>
    </>
  )
}

AddUserComposterForm.propTypes = propTypes

export default AddUserComposterForm
