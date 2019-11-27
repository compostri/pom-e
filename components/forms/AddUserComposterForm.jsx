import React, { Fragment, useContext } from 'react'
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

const AddUserComposterForm = () => {
  const classes = useStyles()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)
  const { addToast } = useToasts()
  const [isLoading, setIsLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState({})
  const [options, setOptions] = React.useState([])

  const fetch = React.useMemo(
    () =>
      throttle((input, cb) => {
        api.getUsers({ email: input }).then(cb)
      }, 200),
    []
  )

  React.useEffect(() => {
    let active = true

    if (inputValue === '') {
      setOptions([])
      return undefined
    }

    fetch(inputValue, results => {
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

  async function onSubmit() {
    if (!selectedUser.username) {
      addToast('Veuillez sélectionner un utilisateur.', TOAST.ERROR)
      return
    }
    setIsLoading(true)
    const res = await api.createUserComposter({ composter: composter['@id'], user: selectedUser['@id'] })
    if (res.status === 201) {
      addToast("L'utilisateur a bien été ajouté.", TOAST.SUCCESS)
    } else {
      addToast('Une erreur est intervenue. Veuillez rééssayer plus tard.', TOAST.ERROR)
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className={classes.search}>
        <Autocomplete
          className={classes.autocomplete}
          id="searchuc"
          noOptionsText="Aucun utilisateur correspondant"
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
                  {option.email}
                </Typography>
              </Fragment>
            )
          }}
        />
        <Box align="center">
          <Button variant="contained" color="secondary" onClick={onSubmit}>
            {isLoading ? <CircularProgress size={24} /> : 'Associer'}
          </Button>
        </Box>
      </div>
    </>
  )
}

export default AddUserComposterForm
