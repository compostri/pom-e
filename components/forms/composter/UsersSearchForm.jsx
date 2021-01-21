import React, { useEffect, useState } from 'react'
import { Button, InputLabel, Input } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import palette from '~/variables'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  inputSearch: {
    backgroundColor: theme.palette.primary.main,
    color: palette.white,
    padding: theme.spacing(1, 2)
  },
  searchForm: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  submitSearch: {
    marginLeft: '2px',
    padding: '7px 8px',
    backgroundColor: theme.palette.primary.main
  }
}))

const UsersSerachForm = ({ handleSearchUsers }) => {
  const classes = useStyles()

  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchUsers(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const searchUsers = e => {
    e.preventDefault()
    handleSearchUsers(search)
  }

  const handleChange = e => {
    setSearch(e.currentTarget.value)
  }

  return (
    <form onSubmit={searchUsers} className={classes.searchForm}>
      <InputLabel for="user-search" size="small" variant="srOnly" className="MuiTypography-srOnly">
        Rechercher un utilisateur par email
      </InputLabel>
      <Input
        id="user-search"
        type="search"
        variant="filled"
        value={search}
        onChange={handleChange}
        placeholder="Rechercher un utilisateur par email"
        className={classes.inputSearch}
      />
      <Button type="submit" variant="contained" color="primary" className={classes.submitSearch}>
        <Search fontSize="small" />
      </Button>
    </form>
  )
}

export default UsersSerachForm
