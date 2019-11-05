import React from 'react'
import { makeStyles } from '@material-ui/styles'
import palette from '../variables'
import { Paper, Typography } from '@material-ui/core'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')

const useStyles = makeStyles(theme => ({
  card: {
    width: 310,
    height: 110,
    marginBottom: theme.spacing(3),
    borderBottom: '3px solid',
    padding: theme.spacing(2, 2, 2, 2)
  },
  cardGrey: {
    borderBottomColor: palette.greyLight
  },
  cardBlue: {
    borderBottomColor: palette.blue
  },
  cardOrange: {
    borderBottomColor: palette.orangePrimary
  },
  cardGreen: {
    borderBottomColor: palette.greenPrimary
  },
  date: {
    color: palette.greyDark,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  ouvreur: {
    display: 'flex',
    flexWrap: 'Wrap',
    marginTop: theme.spacing(1)
  },
  ouvreurAvatar: {
    marginRight: theme.spacing(1),
    borderRadius: 100,
    width: 30,
    height: 30,
    textAlign: 'center',
    paddingTop: 4,
    fontSize: 14,
    fontWeight: '700',
    '&:hover': {
      border: '1px solid'
    }
  },
  ouvreurAvatarGreen: {
    backgroundColor: palette.greenOpacity,
    color: palette.greenPrimary,
    '&:hover': {
      borderColor: palette.greenPrimary
    }
  },
  ouvreurAvatarGrey: {
    backgroundColor: palette.greyExtraLight,
    color: palette.greyMedium,
    '&:hover': {
      borderColor: palette.greyMedium
    }
  },
  ouvreurAvatarOrange: {
    backgroundColor: 'rgba(232, 96, 52, 0.2)',
    color: palette.orangePrimary,
    marginTop: 0,
    '&:hover': {
      borderColor: palette.orangePrimary
    }
  },
  ouvreurAvatarBlue: {
    backgroundColor: 'rgba(123, 206, 209, 0.2)',
    color: palette.blue,
    '&:hover': {
      borderColor: palette.blue
    }
  },
  ouvreurName: {
    color: palette.greyMedium,
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
    marginRight: theme.spacing(3)
  },
  ouvreurNameOrange: {
    color: palette.orangePrimary
  }
}))

const PermanenceCard = ({ permanence }) => {
  const classes = useStyles()
  let statutClasses = classes.cardGreen
  let statutClassesAvatar = classes.ouvreurAvatarGreen

  if (dayjs(permanence.date).isBefore(dayjs())) {
    statutClasses = classes.cardGrey
    statutClassesAvatar = classes.ouvreurAvatarGrey
  } else if (permanence.message.length > 0) {
    statutClasses = classes.cardBlue
    statutClassesAvatar = classes.ouvreurAvatarBlue
  } else if (permanence.ouvreur.length == 0) {
    statutClasses = classes.cardOrange
    statutClassesAvatar = classes.ouvreurAvatarOrange
  }

  return (
    <Paper elevation={1} className={[classes.card, statutClasses].join(' ')}>
      <Typography className={classes.date}>{dayjs(permanence.date).format('dddd YY[,] hh[h]mm')}</Typography>
      <div className={classes.ouvreur}>
        {permanence.ouvreur.length > 0 ? (
          permanence.ouvreur.map(ouvreur => (
            <>
              <div className={[classes.ouvreurAvatar, statutClassesAvatar].join(' ')}>{ouvreur[0]}</div>
              <Typography className={classes.ouvreurName} key={ouvreur}>
                {ouvreur}
              </Typography>
            </>
          ))
        ) : (
          <>
            <p className={[classes.ouvreurAvatar, statutClassesAvatar].join(' ')}>?</p>
            <Typography variant="p" className={[classes.ouvreurName, classes.ouvreurNameOrange].join(' ')}>
              Pas d'ouvreur
            </Typography>
          </>
        )}
      </div>
    </Paper>
  )
}
export default PermanenceCard
