import { createMuiTheme } from '@material-ui/core/styles'
import palette from './variables'

const defaultTheme = createMuiTheme({})

const theme = createMuiTheme({
  typography: {
    fontFamily: 'PT Sans, sans-serif',
    color: palette.greyDark
  },
  palette: {
    primary: { main: palette.greenPrimary },
    secondary: { main: palette.redPrimary }
  },
  overrides: {
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
      containedSecondary: {
        '&:hover': {
          backgroundColor: palette.redOpacity
        }
      },
      containedPrimary: {
        color: 'white',
        backgroundColor: palette.redPrimary
      },
      outlined: {
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
      }
    },
    MuiBackdrop: {
      root: {
        backgroundColor: palette.redPrimary
      }
    },
    MuiContainer: {
      root: {
        padding: defaultTheme.spacing(0, 2)
      }
    },
    MuiFab: {
      root: {
        boxShadow: 'none'
      },
      sizeSmall: {
        width: 35,
        height: 25
      },
      secondary: {
        '&:hover': {
          backgroundColor: palette.redOpacity
        }
      }
    },
    MuiFormControl: {
      root: {
        marginBottom: defaultTheme.spacing(2)
      }
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'none'
        }
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
        padding: defaultTheme.spacing(1.75)
      },
      input: {
        borderRadius: 2,
        padding: 0
      },
      multiline: {
        padding: 'inherit'
      },
      inputMultiline: {
        padding: 14
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
    MuiListItem: {
      root: {
        color: palette.greyDark
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 30
      }
    },
    MuiListItemText: {
      root: {
        fontSize: defaultTheme.typography.pxToRem(14),
        margin: 0
      },
      primary: {
        fontSize: defaultTheme.typography.pxToRem(14)
      }
    },
    MuiPaper: {
      elevation1: {
        boxShadow: '0px 1px 3px 0px rgb(229, 229, 229), 0px 1px 1px 0px rgb(229, 229, 229), 0px 2px 1px -1px rgb(229, 229, 229)'
      }
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        color: palette.greyMedium,
        fontWeight: '700'
      }
    },
    MuiPickersDay: {
      day: {
        color: palette.greyMedium
      },
      daySelected: {
        color: 'white'
      }
    },
    MuiPickersClock: {
      clock: {
        backgroundColor: palette.greyExtraLight
      }
    },
    MuiPickersClockNumber: {
      clockNumber: {
        color: palette.greyMedium
      },
      clockNumberSelected: {
        color: 'white'
      }
    },
    MuiPickersToolbarText: {
      toolbarTxt: {
        color: 'white'
      },
      toolbarBtnSelected: {
        color: 'white'
      }
    },
    MuiSelect: {
      select: {
        borderRadius: 2,
        color: palette.greyDark,
        backgroundColor: palette.greyExtraLight,
        '&:focus': {
          backgroundColor: 'transparent'
        }
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
    MuiTab: {
      root: {
        textTransform: 'none',
        color: palette.greyMedium,
        fontWeight: '700'
      }
    },
    MuiTypography: {
      root: {
        color: palette.greyDark
      },
      h1: {
        color: palette.greyDark,
        fontSize: 20,
        fontWeight: '700',
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: 18
        }
      },
      h2: {
        color: palette.greyDark,
        fontSize: 16,
        fontWeight: '700'
      }
    }
  }
})

export default theme
