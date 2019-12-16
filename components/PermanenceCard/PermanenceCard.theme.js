import { makeStyles } from '@material-ui/styles'

import palette from '~/variables'

const useBaseStyle = makeStyles(({ typography }) => ({
  card: {
    backgroundColor: palette.greyExtraLight,
    width: '100%',
    height: 'auto',
    border: '0px solid transparent',
    transition: 'border-color .3s',
    borderBottomWidth: '3px'
  },

  cardHeader: {
    padding: typography.pxToRem(6),
    paddingBottom: typography.pxToRem(26)
  },
  cardTitle: {
    fontSize: typography.pxToRem(14),
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 0,
    margin: 0
  },
  cardSubHeader: {
    fontSize: typography.pxToRem(10),
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardContent: {
    padding: typography.pxToRem(7)
  },
  cardContentRoot: {
    paddingBottom: 0
  },
  noOpenerMsg: {
    fontSize: typography.pxToRem(8),
    color: palette.redPrimary,
    marginLeft: '2%'
  },
  cardAvatarList: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  cardAvatar: {
    color: palette.white,
    fontSize: typography.pxToRem(10),
    marginRight: '2%',
    width: typography.pxToRem(16),
    height: typography.pxToRem(16)
  },
  popoverCard: {
    width: typography.pxToRem(236),
    backgroundColor: '#fff'
  },
  popoverHeader: {
    height: typography.pxToRem(56),
    padding: typography.pxToRem(10)
  },
  popoverCloseIcon: {
    width: typography.pxToRem(16),
    height: typography.pxToRem(16)
  },
  popoverTitle: {
    fontSize: typography.pxToRem(12),
    fontWeight: 'bold',
    margin: 0
  },
  popoverSubHeader: {
    fontSize: typography.pxToRem(11),
    margin: 0
  },
  popoverCardContent: {
    paddingRight: typography.pxToRem(11),
    paddingLeft: typography.pxToRem(11),
    paddingTop: typography.pxToRem(17),
    paddingBottom: typography.pxToRem(17)
  }
}))

/* Grey theme */

const useGreyTheme = makeStyles(() => ({
  card: {
    borderBottomColor: palette.greyExtraLight,
    '&:hover': {
      borderBottomColor: palette.greyMedium
    }
  },
  cardHightlighted: {
    borderBottomColor: palette.greyMedium
  },
  cardHeader: {
    backgroundColor: palette.greyExtraLight
  },
  cardTitle: {
    color: palette.greyMedium
  },
  cardSubHeader: {
    color: palette.greyMedium
  },
  cardContent: {
    backgroundColor: palette.greyExtraLight
  },
  cardAvatar: {
    backgroundColor: palette.greyMedium
  },
  popoverHeader: {
    color: palette.greyMedium,
    backgroundColor: palette.greyExtraLight
  },
  popoverCloseIcon: {
    color: palette.greyMedium
  },
  popoverTitle: {
    color: palette.greyMedium
  },
  popoverSubHeader: {
    color: palette.greyMedium
  },
  popoverAvatar: {
    backgroundColor: palette.greyMedium
  }
}))

/* Orange theme */

const useOrangeTheme = makeStyles(() => ({
  card: {
    borderBottomColor: palette.orangeExtraLight,
    '&:hover': {
      borderBottomColor: palette.orangePrimary
    }
  },
  cardHightlighted: {
    borderBottomColor: palette.orangePrimary
  },
  cardHeader: {
    backgroundColor: palette.orangeExtraLight
  },
  cardTitle: {
    color: palette.orangePrimary
  },
  cardSubHeader: {
    color: palette.orangePrimary
  },
  cardContent: {
    backgroundColor: palette.orangeExtraLight
  },
  cardAvatar: {
    backgroundColor: palette.orangePrimary,
    color: palette.white,
    border: `1px solid ${palette.orangePrimary}`
  },
  popoverHeader: {
    color: palette.orangePrimary,
    backgroundColor: palette.orangeExtraLight
  },
  popoverCloseIcon: {
    color: palette.orangePrimary
  },
  popoverTitle: {
    color: palette.orangePrimary
  },
  popoverSubHeader: {
    color: palette.orangePrimary
  },
  popoverAvatar: {
    backgroundColor: palette.orangePrimary
  }
}))

/* Red theme */

const useRedTheme = makeStyles(() => ({
  card: {
    borderBottomColor: palette.redExtraLight,
    '&:hover': {
      borderBottomColor: palette.redPrimary
    }
  },
  cardHightlighted: {
    borderBottomColor: palette.redPrimary
  },
  cardHeader: {
    backgroundColor: palette.redExtraLight
  },
  cardTitle: {
    color: palette.redPrimary
  },
  cardSubHeader: {
    color: palette.redPrimary
  },
  cardContent: {
    backgroundColor: palette.redExtraLight
  },
  cardAvatar: {
    backgroundColor: palette.redPrimary
  },
  popoverHeader: {
    color: palette.redPrimary,
    backgroundColor: palette.redExtraLight
  },
  popoverCloseIcon: {
    color: palette.redPrimary
  },
  popoverTitle: {
    color: palette.redPrimary
  },
  popoverSubHeader: {
    color: palette.redPrimary
  }
}))

/* Blue theme */

const useBlueTheme = makeStyles(() => ({
  card: {
    borderBottomColor: palette.blueExtraLight,
    '&:hover': {
      borderBottomColor: palette.blue
    }
  },
  cardHightlighted: {
    borderBottomColor: palette.blue
  },
  cardHeader: {
    backgroundColor: palette.blueExtraLight
  },
  cardTitle: {
    color: palette.blue
  },
  cardSubHeader: {
    color: palette.blue
  },
  cardContent: {
    backgroundColor: palette.blueExtraLight
  },
  cardAvatar: {
    backgroundColor: palette.blue
  },
  popoverHeader: {
    color: palette.blue,
    backgroundColor: palette.blueExtraLight
  },
  popoverCloseIcon: {
    color: palette.blue
  },
  popoverTitle: {
    color: palette.blue
  },
  popoverSubHeader: {
    color: palette.blue
  }
}))

/* Green theme */

const useGreenTheme = makeStyles(() => ({
  card: {
    borderBottomColor: palette.greenExtraLight,
    '&:hover': {
      borderBottomColor: palette.greenPrimary
    }
  },
  cardHightlighted: {
    borderBottomColor: palette.greenPrimary
  },
  cardHeader: {
    backgroundColor: palette.greenExtraLight
  },
  cardTitle: {
    color: palette.greenPrimary
  },
  cardSubHeader: {
    color: palette.greenPrimary
  },
  cardContent: {
    backgroundColor: palette.greenExtraLight
  },
  cardAvatar: {
    backgroundColor: palette.greenPrimary
  },
  popoverHeader: {
    color: palette.greenPrimary,
    backgroundColor: palette.greenExtraLight
  },
  popoverCloseIcon: {
    color: palette.greenPrimary
  },
  popoverTitle: {
    color: palette.greenPrimary
  },
  popoverSubHeader: {
    color: palette.greenPrimary
  }
}))

export { useGreenTheme, useRedTheme, useGreyTheme, useBlueTheme, useOrangeTheme }

export default useBaseStyle
