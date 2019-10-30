import React, { useState, useEffect } from 'react'
import { TextField, List, ListItem, Popover } from '@material-ui/core'
import api from '../utils/api'
import Link from 'next/link'

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const [listComposter, setListComposter] = useState([])
  const inputRef = React.useRef(null)
  const [open, setOpen] = useState(false)

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
    }
  }, [search])

  const composterListe = listComposter.map(composter => (
    <Link key={`composter-${composter.id}`} href="/composter/[slug]" as={`/composter/${composter.id}`} passHref>
      <ListItem button component="a">
        {composter.name}
      </ListItem>
    </Link>
  ))

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <TextField ref={inputRef} value={search} type="search" variant="outlined" onChange={event => setSearch(event.target.value)} fullWidth />
      <Popover
        PaperProps={{
          style: {
            width: inputRef.current && inputRef.current.offsetWidth
          }
        }}
        elevation={4}
        open={open}
        anchorEl={inputRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <List>{composterListe}</List>
      </Popover>
    </>
  )
}

export default SearchBar
