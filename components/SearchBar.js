import React, { useState, useEffect } from 'react'
import { TextField, List, ListItem, Popper, makeStyles, IconButton } from '@material-ui/core'
import api from '../utils/api'
import Link from 'next/link'

const useStyles = makeStyles(theme => ({
  popperContainer: {
    backgroundColor: 'white',
    zIndex: 110
  },
  searchBarContainer: {
    backgroundColor: 'white'
  }
}))

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const [listComposter, setListComposter] = useState([])
  const inputRef = React.useRef(null)
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (search.length >= 3) {
      api.getComposters({ name: search }).then(response => {
        if (response.status == 200) {
          setListComposter(response.data['hydra:member'])
          setOpen(true)
        }
      })
    } else {
      setListComposter([])
      setOpen(false)
    }
  }, [search])

  const composterListe = listComposter.map(composter => (
    <Link key={`composter-${composter.id}`} href="/composter/[slug]" as={`/composter/${composter.id}`} passHref>
      <ListItem button component="a">
        {composter.name}
      </ListItem>
    </Link>
  ))

  return (
    <>
      <TextField
        autoFocus
        className={classes.searchBarContainer}
        ref={inputRef}
        value={search}
        type="search"
        variant="outlined"
        onChange={event => setSearch(event.target.value)}
        fullWidth
      ></TextField>

      <Popper
        style={{ width: inputRef.current && inputRef.current.offsetWidth }}
        className={classes.popperContainer}
        open={open}
        anchorEl={inputRef.current}
        placement="bottom-start"
        disablePortal
      >
        <List>{composterListe}</List>
      </Popper>
    </>
  )
}

export default SearchBar
