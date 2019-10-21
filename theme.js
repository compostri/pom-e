import { createMuiTheme } from '@material-ui/core/styles'
import palette from './variables'

const theme = createMuiTheme({
  palette: {
    primary: { main: palette.greenPrimary },
    secondary: { main: palette.orangePrimary }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: '2px'
      },
      containedPrimary: {
        backgroundColor: palette.orangePrimary
      }
    }
  }
})

export default theme
