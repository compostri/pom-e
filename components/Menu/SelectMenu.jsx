import React from 'react'
import { useRouter } from 'next/router'
import { MenuItem, Select, FormControl } from '@material-ui/core'
import useMenu from './useMenu'

const SelectMenu = () => {
  const links = useMenu()
  const router = useRouter()
  const active = links.find(l => l.isActive)

  const navigate = e => {
    const link = links.find(l => l.href === e.target.value)
    router.push(link.href, link.as)
  }

  return (
    <FormControl fullWidth>
      <Select fullWidth value={active.href} onChange={navigate}>
        {links.map((l, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem value={l.href} onClick={() => router.push(l.href, l.as)} key={`select-link-${i}`}>
            {l.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectMenu