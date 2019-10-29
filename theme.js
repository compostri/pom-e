import { createMuiTheme } from '@material-ui/core/styles'
import palette from './variables'

const theme = createMuiTheme({
  palette: {
    primary: { main: palette.greenPrimary },
    secondary: { main: palette.orangePrimary }
  },
  overrides: {
    MuiSelect : {
      select: {
        backgroundColor: palette.greyExtraLight,
        minWidth: '360px',
        minHeight:'40px',
      }
    },
    MuiInput : {
      underline : {
        '&:before' : {
          borderBottom: 'none',
          '&:hover' : {
            borderBottom: 'none',
          },
        },
      }
    },
    MuiSwitch: {
      colorSecondary: {
        '&$checked': {
          color: palette.greenPrimary,
          '&:hover' : {
            backgroundColor: palette.greenOpacity,
          },
        },
        '&$checked + $track': {
          backgroundColor: palette.greenPrimary,
        },
        
      },
    },
    MuiInputLabel: {
      animated : {
        color: palette.greyLight,
        fontWeight: '700',
        letterSpacing: 1,
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: '2px',
      },
      contained : {
        boxShadow: 'none',
        backgroundColor: palette.greyExtraLight,
        color: palette.greyMedium,
        '&:hover' : {
          boxShadow: 'none',
          backgroundColor: palette.greenOpacity,
        },
        '&:active' : {
          boxShadow: 'none',
          backgroundColor: palette.greenOpacity,
        },
      },
      containedPrimary: {
        backgroundColor: palette.orangePrimary
      }
    }
  }
})

export default theme
