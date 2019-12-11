import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Box } from '@material-ui/core'
import theme from '../theme'
import { getComposterColor } from '~/utils/utils'

const useStyles = makeStyles(theme => ({
  imgDefaut: {
    display: 'flex',
    height: 110,
    width: 110,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoProjet: {}
}))

const DefaultImage = ({ composter }) => {
  const classes = useStyles()
  const backColor = getComposterColor(composter)

  return (
    <Box className={classes.imgDefaut} style={{ backgroundColor: backColor }}>
      <img src="..\static\compostri.svg" alt="logo Compostri" id="logoEnProjet" />
    </Box>
  )
}

export default DefaultImage
