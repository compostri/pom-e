import { makeStyles } from '@material-ui/styles'

import palette from '~/variables'

const useBaseStyle = makeStyles(({ typography }) => ({
  card: {
    backgroundColor: palette.greyExtraLight,
    width: '100%',
    height: 'auto'
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
    color: palette.orangePrimary,
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

/* Grey Dark theme */

const useGreyDarkTheme = makeStyles(() => ({
  cardHeader: {
    backgroundColor: palette.greyDark
  },
  cardTitle: {
    color: palette.white
  },
  cardSubHeader: {
    color: palette.white
  },
  cardContent: {
    backgroundColor: palette.greyDark
  },
  cardAvatar: {
    backgroundColor: palette.white,
    color: palette.greyDark,
    border: `1px solid ${palette.greyDark}`
  },
  popoverHeader: {
    color: palette.white,
    backgroundColor: palette.greyDark
  },
  popoverCloseIcon: {
    color: palette.white
  },
  popoverTitle: {
    color: palette.white
  },
  popoverSubHeader: {
    color: palette.white
  },
  popoverAvatar: {
    backgroundColor: palette.white
  }
}))

/* Red theme */

const useRedTheme = makeStyles(() => ({
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
    backgroundColor: palette.orangePrimary
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
  }
}))

/* Blue theme */

const useBlueTheme = makeStyles(() => ({
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

export { useGreenTheme, useRedTheme, useGreyTheme, useBlueTheme, useGreyDarkTheme }

export default useBaseStyle
