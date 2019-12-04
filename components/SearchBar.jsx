import React, { useState, useEffect } from 'react'
import { TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Search } from '@material-ui/icons'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useRouter } from 'next/router'
import throttle from 'lodash/throttle'
import api from '~/utils/api'
import palette from '~/variables'

const useStyles = makeStyles(theme => ({
  popperContainer: {
    backgroundColor: 'white',
    borderBottom: `1px solid ${palette.greyDark}`,
    zIndex: 110
  },
  searchBarContainer: {},
  searchBar: {
    padding: theme.spacing(0, 4, 0, 2),
    backgroundColor: '#c2d97c',
    borderTop: '1px solid #fff',
    borderBottom: '1px solid #fff',
    '&:before, &:after': { content: 'none' },
    '&::placeholder': { color: 'white' }
  },
  searchBarInput: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: '700',
    letterSpacing: 0.5,
    color: 'white'
  },
  searchIcon: {
    color: 'white'
  }
}))

const SearchBar = () => {
  const classes = useStyles()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [listComposter, setListComposter] = useState([])

  const fetch = React.useMemo(
    () =>
      throttle((input, cb) => {
        setLoading(true)
        api.getComposters({ name: input }).then(cb)
      }, 200),
    []
  )

  React.useEffect(() => {
    let active = true

    if (search === '') {
      setListComposter([])
      return undefined
    }

    fetch(search, results => {
      setLoading(false)
      if (active) {
        setListComposter(results.data['hydra:member'] || [])
      }
    })

    return () => {
      active = false
    }
  }, [search, fetch])

  const onChange = (e, value) => {
    router.push(`/composter/${value.slug}`)
  }

  const onInputChange = (e, value) => {
    setSearch(value)
  }

  return (
    <Autocomplete
      id="searchcomposter"
      loading={loading}
      loadingText="Recherche en cours"
      noOptionsText="Aucun composteur correspondant"
      getOptionLabel={option => option.name}
      options={listComposter}
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          variant="standard"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            ...params.InputProps,
            className: classes.searchBar,
            classes: { input: classes.searchBarInput },
            endAdornment: <Search className={classes.searchIcon} />
          }}
        />
      )}
      renderOption={option => {
        return <Typography key={option.name}>{option.name}</Typography>
      }}
    />
  )
}

export default SearchBar
