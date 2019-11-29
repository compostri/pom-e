import React, { useState, useContext, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, CardHeader, Avatar, IconButton, Button, FormControl, MenuItem, Select, Checkbox, ListItemText } from '@material-ui/core'
import { Close as CloseIcon, Delete as DeleteIcon } from '@material-ui/icons'
import Popover from '@material-ui/core/Popover'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { ComposterContext } from '~/context/ComposterContext'
import { permanenceType } from '~/types'
import api from '~/utils/api'
import palette from '~/variables'
import { Can, Action, Subject } from '~/context/AbilityContext'
import { UserContext } from '~/context/UserContext'

import useBaseStyle, { useBlueTheme, useRedTheme, useGreenTheme, useGreyTheme } from '../PermanenceCard.theme'

const today = dayjs()

const usePermanenceStatus = ({ canceled, date: permDate }, date) => {
  const isPermDatePassed = date.isAfter(permDate)
  const setStatus = status => ({ status })

  if (canceled) {
    return setStatus('Permanence annulée')
  }
  if (isPermDatePassed) {
    return setStatus('Permanence passée')
  }

  return setStatus('Permanence à venir')
}
const useTheme = ({ canceled, date, openers, eventTitle }) => {
  const greenTheme = useGreenTheme()
  const greyTheme = useGreyTheme()
  const redTheme = useRedTheme()
  const blueTheme = useBlueTheme()

  const isPermDatePassed = today.isAfter(date)
  const hasAnyOpeners = openers.length > 0
  const hasTitle = eventTitle

  if (isPermDatePassed || canceled) {
    return greyTheme
  }

  if (hasAnyOpeners) {
    if (hasTitle) {
      return blueTheme
    }
    return greenTheme
  }
  return redTheme
}

const usePermanenceToComeWithOpenersStyle = makeStyles(({ typography }) => ({
  contentTitle: {
    color: palette.greyLight,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    fontSize: typography.pxToRem(8),
    textTransform: 'uppercase',
    margin: 0
  },
  avatar: {
    backgroundColor: palette.greenPrimary,
    marginRight: typography.pxToRem(5)
  },
  avatarQuestionMark: {
    backgroundColor: palette.orangePrimary
  },
  openerList: {
    padding: 0,
    margin: 0
  },
  openerListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: typography.pxToRem(7),
    padding: typography.pxToRem(10),
    backgroundColor: palette.greyExtraLight,
    fontSize: typography.pxToRem(11),
    color: palette.greyMedium,
    listStyle: 'none'
  },
  noOpenerListItem: {
    justifyContent: 'flex-start',
    color: 'red'
  },
  openerListItemLeftContent: {
    display: 'flex',
    alignItems: 'center'
  },
  openerListItemDeleteIcon: {
    padding: 0
  },
  openerListBtn: {
    width: '100%',
    marginTop: typography.pxToRem(14)
  },
  openerListBtnSubmit: {
    backgroundColor: palette.greenPrimary,
    color: palette.white
  },
  openerListBtnCancel: {
    backgroundColor: palette.white
  },
  openerListBtnLabel: {
    fontSize: typography.pxToRem(12)
  },
  selectFormControl: {
    width: '100%'
  },
  select: {
    marginTop: typography.pxToRem(4),
    padding: 0
  },
  selectRoot: {
    padding: typography.pxToRem(12)
  },
  noOpenerMsg: {
    color: palette.greyDark,
    fontSize: typography.pxToRem(11)
  }
}))

const withPermanancePopoverWrapper = WrappedComponent => {
  function WithPermanancePopoverWrapper({ anchorEl, onClose, permanence, vertical, horizontal, onSubmit }) {
    const {
      composterContext: { composter }
    } = useContext(ComposterContext)

    const { status } = usePermanenceStatus(permanence, today)

    const theme = useTheme(permanence)
    const baseStyle = useBaseStyle()

    const { anchorOrigin, transformOrigin } = {
      anchorOrigin: {
        vertical: vertical === 'top' ? 'bottom' : 'top',
        horizontal: horizontal === 'left' ? 'right' : 'left'
      },
      transformOrigin: {
        vertical,
        horizontal
      }
    }

    const cardTitle = (
      <>
        <h3 className={classNames(baseStyle.popoverTitle, theme.popoverTitle)}>{permanence.eventTitle}</h3>
        <h2 className={classNames(baseStyle.popoverSubHeader, theme.popoverSubHeader)}>{status}</h2>
      </>
    )

    return (
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin}>
        <Card className={baseStyle.popoverCard}>
          <CardHeader
            title={cardTitle}
            subheader={dayjs(permanence.date).format('HH:mm')}
            action={
              <IconButton aria-label="close" onClick={onClose}>
                <CloseIcon className={classNames(baseStyle.popoverCloseIcon, theme.popoverCloseIcon)} />
              </IconButton>
            }
            className={classNames(baseStyle.popoverHeader, theme.popoverHeader)}
            classes={{
              subheader: classNames(baseStyle.popoverSubHeader, theme.popoverSubHeader)
            }}
          />
          <CardContent className={baseStyle.popoverCardContent}>
            <WrappedComponent permanence={permanence} composterId={composter.rid} onSubmit={onSubmit} />
          </CardContent>
        </Card>
      </Popover>
    )
  }

  WithPermanancePopoverWrapper.propTypes = {
    permanence: permanenceType.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    anchorEl: PropTypes.object.isRequired,
    vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf(['left', 'right']).isRequired
  }

  return WithPermanancePopoverWrapper
}

const getId = opener => opener['@id']

const PopoverPermanenceToComeContent = ({ permanence, composterId, onSubmit }) => {
  const defaultOpenersToAdd = []
  const { EDIT, CREATE, DELETE } = Action
  const { COMPOSTER_LISTES_OUVREURS, COMPOSTER_OUVREUR } = Subject

  const {
    userContext: { user }
  } = useContext(UserContext)

  const baseStyle = useBaseStyle()
  const permanenceToComeWithOpenersStyle = usePermanenceToComeWithOpenersStyle()

  const {
    openerListItem,
    avatar,
    avatarQuestionMark,
    contentTitle,
    openerList: openerListStyle,
    noOpenerListItem,
    noOpenerMsg,
    openerListBtnLabel,
    openerListBtn,
    openerListBtnCancel,
    openerListBtnSubmit,
    openerListItemDeleteIcon,
    openerListItemLeftContent,
    selectFormControl,
    select,
    selectRoot
  } = permanenceToComeWithOpenersStyle

  const [allOpeners, setAllOpeners] = useState(defaultOpenersToAdd)
  const [openersAdded, setOpenersAdded] = useState(permanence.openers)
  const opernerAddedIds = openersAdded.map(getId)

  useEffect(() => {
    function fetchUserComposter() {
      api.getUserComposter({ composter: composterId }).then(res => {
        if (res.status === 200) {
          const composterOpeners = res.data['hydra:member'].map(({ user }) => user)
          setAllOpeners(
            [...permanence.openers, ...composterOpeners].reduce((openerList, opener) => {
              if (!openerList.length) {
                return [opener]
              }
              return openerList.map(getId).includes(getId(opener)) ? openerList : [...openerList, opener]
            }, [])
          )
        }
      })
    }

    fetchUserComposter()
  }, [composterId, permanence.openers])

  const handleAddingCurrentOpener = useCallback(
    currentOpeners => () => {
      const userAsOpener = {
        ...user,
        '@id': `/users/${user.userId}`
      }
      setOpenersAdded([...currentOpeners, userAsOpener])
    },
    [user]
  )

  const handleOpenerRemoval = id => () => {
    setOpenersAdded(openersAdded.filter(opener => getId(opener) !== id))
  }

  const handleOpenerAdding = ({ target: { value: ids } }) => {
    setOpenersAdded(allOpeners.filter(opener => ids.includes(getId(opener))))
  }

  const handleCancel = () => {
    setOpenersAdded(permanence.openers)
  }

  const handleSubmit = evt => {
    evt.preventDefault()
    onSubmit(permanence.id, openersAdded.map(getId))
  }

  const renderOpenersToAdd = openerList => {
    return openerList.map(openerToAdd => {
      const openerToAddId = getId(openerToAdd)
      return (
        <MenuItem key={openerToAddId} value={openerToAddId}>
          <Checkbox checked={opernerAddedIds.includes(openerToAddId)} />
          <ListItemText primary={openerToAdd.username} />
        </MenuItem>
      )
    })
  }

  const maybeRenderNoOpenersWarning = openerList =>
    !openerList.length && <p className={noOpenerMsg}>S’il y a aucun ouvreur d’inscrit, la permanence ne pourra pas être assurée. Inscrivez-vous vite ! </p>

  const maybeRenderCurrentOpeners = openerList => {
    const renderOpener = (opener, i) => {
      const { username } = opener
      const openerId = getId(opener)
      return (
        <li className={openerListItem} key={`edit-opener-${username}-${i}`}>
          <div className={openerListItemLeftContent}>
            <Avatar aria-label={username} className={classNames(baseStyle.cardAvatar, avatar)}>
              {username[0]}
            </Avatar>
            {username}
          </div>
          <Can I={EDIT} this={COMPOSTER_LISTES_OUVREURS}>
            <IconButton aria-label="remove" onClick={handleOpenerRemoval(openerId)} className={openerListItemDeleteIcon}>
              <DeleteIcon />
            </IconButton>
          </Can>
          <Can I={DELETE} this={{ $type: COMPOSTER_OUVREUR, self: getId(opener) === `/users/${user.userId}` }}>
            <IconButton aria-label="remove" onClick={handleOpenerRemoval(openerId)} className={openerListItemDeleteIcon}>
              <DeleteIcon />
            </IconButton>
          </Can>
        </li>
      )
    }

    return (
      <>
        <h3 className={contentTitle}>Liste des ouvreurs</h3>
        <ul className={openerListStyle}>
          {openerList.length > 0 ? (
            openerList.map(renderOpener)
          ) : (
            <li className={classNames(openerListItem, noOpenerListItem)}>
              <Avatar className={classNames(classNames(baseStyle.cardAvatar, avatar, avatarQuestionMark))}>?</Avatar>
              Attention ! Pas d'ouvreur
            </li>
          )}
        </ul>
      </>
    )
  }

  const isSelectVisible = allOpeners.length && allOpeners > openersAdded

  const AsOpernerFooter = () => {
    const isUserSelfEdited = permanence.openers.length !== openersAdded.length

    const isUserAlreadyAddedHimSelf = openersAdded.map(getId).includes(`/users/${user.userId}`)

    if (isUserSelfEdited) {
      return (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            className={classNames(openerListBtn, openerListBtnCancel)}
            classes={{ label: openerListBtnLabel }}
          >
            Annuler
          </Button>
          <Button type="submit" className={classNames(openerListBtn, openerListBtnSubmit)} variant="contained" classes={{ label: openerListBtnLabel }}>
            Enregister
          </Button>
        </>
      )
    }
    if (isUserAlreadyAddedHimSelf) {
      return ''
    }
    return (
      <Button
        className={classNames(openerListBtn, openerListBtnSubmit)}
        variant="contained"
        classes={{ label: openerListBtnLabel }}
        onClick={handleAddingCurrentOpener(openersAdded)}
      >
        S'ajouter
      </Button>
    )
  }

  const placeholder = useCallback(() => 'Modifier les ouvreurs', [])

  return (
    <form onSubmit={handleSubmit}>
      {maybeRenderCurrentOpeners(openersAdded)}
      <Can I={EDIT} this={COMPOSTER_LISTES_OUVREURS}>
        {isSelectVisible && (
          <FormControl className={selectFormControl}>
            <Select multiple className={select} classes={{ root: selectRoot }} onChange={handleOpenerAdding} value={opernerAddedIds} renderValue={placeholder}>
              {renderOpenersToAdd(allOpeners)}
            </Select>
          </FormControl>
        )}
        {maybeRenderNoOpenersWarning(openersAdded)}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          className={classNames(openerListBtn, openerListBtnCancel)}
          classes={{ label: openerListBtnLabel }}
        >
          Annuler
        </Button>
        <Button type="submit" className={classNames(openerListBtn, openerListBtnSubmit)} variant="contained" classes={{ label: openerListBtnLabel }}>
          Enregister
        </Button>
      </Can>
      <Can I={CREATE} this={COMPOSTER_OUVREUR}>
        <AsOpernerFooter />
      </Can>
    </form>
  )
}

PopoverPermanenceToComeContent.propTypes = {
  permanence: permanenceType.isRequired,
  composterId: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const PopoverPermanenceToCome = withPermanancePopoverWrapper(PopoverPermanenceToComeContent)

export { PopoverPermanenceToCome }
