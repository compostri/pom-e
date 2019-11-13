import { createMuiTheme } from '@material-ui/core/styles'
import palette from './variables'

const defaultTheme = createMuiTheme({})

const theme = createMuiTheme({
  palette: {
    primary: { main: palette.greenPrimary },
    secondary: { main: palette.orangePrimary }
  },
  overrides: {
    MuiSelect: {
      select: {
        backgroundColor: palette.greyExtraLight
      }
    },
    MuiBackdrop: {
      root: {
        backgroundColor: palette.orangePrimary
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        color: palette.greyMedium,
        fontWeight: '700'
      }
    },
    MuiInput: {
      underline: {
        borderBottomColor: palette.greyExtraLight,
        '&:hover': {
          borderBottomColor: palette.greenOpacity
        },
        '&:after': {
          borderBottomColor: palette.greyExtraLight
        },
        '&:before': {
          borderBottomColor: palette.greyExtraLight
        }
      }
    },
    MuiInputBase: {
      root: {
        backgroundColor: palette.greyExtraLight,
        color: palette.greyMedium,
        padding: '10px 14px 10px 14px',
        borderRadius: 2
      }
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'none'
        }
      }
    },
    MuiPaper: {
      elevation1: {
        boxShadow: '0px 1px 3px 0px rgb(229, 229, 229), 0px 1px 1px 0px rgb(229, 229, 229), 0px 2px 1px -1px rgb(229, 229, 229)'
      }
    },
    MuiSwitch: {
      colorSecondary: {
        '&$checked': {
          color: palette.greenPrimary,
          '&:hover': {
            backgroundColor: palette.greenOpacity
          }
        },
        '&$checked + $track': {
          backgroundColor: palette.greenPrimary
        }
      }
    },

    MuiInputLabel: {
      animated: {
        color: palette.greyLight,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase'
      },
      shrink: {
        left: 0,
        fontSize: 14,
        color: palette.greyMedium
      },
      formControl: {
        zIndex: 2,
        left: 10,
        fontSize: 12
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: '2px'
      },
      contained: {
        boxShadow: 'none',
        backgroundColor: palette.greyExtraLight,
        color: palette.greyMedium,
        padding: defaultTheme.spacing(1, 3),
        fontSize: '1rem',
        fontWeight: '700',
        letterSpacing: 1,
        '&:hover': {
          boxShadow: 'none',
          backgroundColor: palette.greenOpacity
        },
        '&:active': {
          boxShadow: 'none',
          backgroundColor: palette.greenOpacity
        }
      },
      containedPrimary: {
        backgroundColor: palette.orangePrimary
      }
    }
  }
})

export default theme
