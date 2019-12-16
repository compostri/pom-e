import React from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import useMenu from './useMenu'

const useStyles = makeStyles(theme => ({
  button: {
    color: palette.greyDark,
    fontSize: '16px',
    fontWeight: '400',
    borderBottomStyle: 'solid',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginRight: theme.spacing(4),
    borderRadius: 0,
    '&:hover, &:focus': {
      borderBottomColor: palette.greenPrimary,
      backgroundColor: 'white'
    }
  },
  activeButton: {
    borderBottomColor: palette.greenPrimary,
    fontWeight: 700,
    backgroundColor: 'white'
  }
}))

const MenuLinks = () => {
  const links = useMenu()
  const classes = useStyles()
  return links.map((l, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <Link href={l.href} as={l.as} passHref key={`link-${i}`}>
      <Button className={classNames(classes.button, { [classes.activeButton]: l.isActive })}>{l.label}</Button>
    </Link>
  ))
}

export default MenuLinks
