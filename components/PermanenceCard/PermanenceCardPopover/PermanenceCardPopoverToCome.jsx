/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Avatar, IconButton, Button, FormControl, MenuItem, Select, Checkbox, ListItemText, TextField, FormControlLabel, Switch } from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'
import { Formik, Form } from 'formik'
import dayjs from 'dayjs'

import { permanenceType } from '~/types'
import palette from '~/variables'
import { Can, Action, Subject, AbilityContext } from '~/context/AbilityContext'
import { UserContext } from '~/context/UserContext'

import useBaseStyle from '../PermanenceCard.theme'
import withPermanancePopoverWrapper from './withPermanenceCardPopoverWrapper'
import withFormikField from '~/utils/hoc/withFormikField'

const today = dayjs()

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
  switchRoot: {
    marginBottom: typography.pxToRem(14),
    marginTop: typography.pxToRem(14)
  },
  switchLabel: {
    fontSize: typography.pxToRem(11)
  },
  textarea: {
    fontSize: typography.pxToRem(11)
  },
  noOpenerMsg: {
    color: palette.greyDark,
    fontSize: typography.pxToRem(11)
  },
  eventMessageTitle: {
    marginTop: typography.pxToRem(14),
    marginBottom: 0
  },
  eventMessageText: {
    margin: 0
  }
}))

const getId = opener => opener['@id']

const FormikTextField = withFormikField(TextField)
const FormikSwitch = withFormikField(Switch)
const FormikSelect = withFormikField(Select)

const PopoverPermanenceToComeContent = ({ permanence, onSubmit }) => {
  const { MODIFY, DELETE } = Action
  const { COMPOSTER_LISTES_OUVREURS, COMPOSTER_OUVREUR, COMPOSTER_PERMANENCE_MESSAGE } = Subject
  const isPermanencePassed = today.isAfter(permanence.date)

  const initialValues = useMemo(() => {
    const { openers, eventTitle, eventMessage } = permanence
    return { openers, eventTitle, eventMessage, isPermanenceAnEvent: !!eventTitle }
  }, [permanence])

  const {
    userContext: { user }
  } = useContext(UserContext)
  const abilityContext = useContext(AbilityContext)

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
    switchLabel,
    switchRoot,
    selectRoot,
    eventMessageTitle,
    eventMessageText
  } = permanenceToComeWithOpenersStyle

  const handleSubmit = useCallback(({ openers, eventTitle, eventMessage, isPermanenceAnEvent }, actions) => {
    const mayBeEmptyValue = value => (isPermanenceAnEvent ? value : '')

    onSubmit({ openers: openers.map(getId), eventTitle: mayBeEmptyValue(eventTitle), eventMessage: mayBeEmptyValue(eventMessage) })
    actions.setSubmitting(false)
  }, [])

  const mayRenderNoOpenersWarning = useCallback(
    openerList =>
      !openerList.length && <p className={noOpenerMsg}>S’il y a aucun ouvreur d’inscrit, la permanence ne pourra pas être assurée. Inscrivez-vous vite ! </p>,
    []
  )

  const mayRenderCurrentOpeners = useCallback(
    (openerList, onRemoval) => {
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
            <Can I={MODIFY} this={{ $type: COMPOSTER_LISTES_OUVREURS, isPermanencePassed }}>
              <IconButton aria-label="remove" onClick={onRemoval(openerId)} className={openerListItemDeleteIcon}>
                <DeleteIcon />
              </IconButton>
            </Can>
            <Can I={DELETE} this={{ $type: COMPOSTER_OUVREUR, self: user && getId(opener) === `/users/${user.userId}`, isPermanencePassed }}>
              <IconButton aria-label="remove" onClick={onRemoval(openerId)} className={openerListItemDeleteIcon}>
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
    },
    [user, permanence.date]
  )

  const mayRenderOpenerCapabilityFooter = useCallback(
    (openers, openersAvailable, handleAddingOpener, handleCancel) => {
      if (abilityContext.cannot(Action.CREATE, Subject.COMPOSTER_OUVREUR)) {
        return null
      }

      const isUserSelfEdited = openersAvailable.length !== openers.length

      const isUserAlreadyAddedHimSelf = openers.map(getId).includes(`/users/${user.userId}`)

      const handleAddingCurrentOpener = () => {
        handleAddingOpener({
          ...user,
          '@id': `/users/${user.userId}`
        })
      }

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
          onClick={handleAddingCurrentOpener}
        >
          S'ajouter
        </Button>
      )
    },
    [user, abilityContext]
  )

  const mayRenderOpenersSelect = useCallback((openersAvailable, openers) => {
    const hasTobeRendered = openersAvailable.length && openersAvailable > openers
    if (!hasTobeRendered) {
      return null
    }

    const renderOpenersToAdd = (allOpenersAvailable, openerAdded) => {
      const openerAddedIds = openerAdded.map(getId)
      return allOpenersAvailable.map(openerToAdd => {
        const openerToAddId = getId(openerToAdd)
        return (
          <MenuItem key={openerToAddId} value={openerToAdd}>
            <Checkbox checked={openerAddedIds.includes(openerToAddId)} />
            <ListItemText primary={openerToAdd.username} />
          </MenuItem>
        )
      })
    }

    const renderValue = selected => {
      if (selected.length === 0) {
        return <em>Ajouter des ouvreurs</em>
      }

      return 'Ouvreurs'
    }

    return (
      <FormControl className={selectFormControl}>
        <FormikSelect multiple className={select} classes={{ root: selectRoot }} name="openers" displayEmpty renderValue={renderValue}>
          {renderOpenersToAdd(openersAvailable, openers)}
        </FormikSelect>
      </FormControl>
    )
  }, [])

  const mayRenderEventFields = useCallback(
    hasTobeRendered =>
      hasTobeRendered && (
        <>
          <FormikTextField name="eventTitle" label="Titre de l'évènement" />
          <FormikTextField multiline rows="4" name="eventMessage" label="Message de l'évènement" placeholder="Écrivez ici le message" />
        </>
      ),
    []
  )

  const mayRenderEventMessage = useCallback((title, text) => {
    return (
      <>
        {title && <TextField className={eventMessageTitle} value={title} label="L’évenement" disabled />}
        {text && <TextField multiple className={eventMessageText} value={text} disabled />}
      </>
    )
  }, [])

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => {
        const handleOpenerRemoval = id => () => {
          setFieldValue(
            'openers',
            values.openers.filter(opener => getId(opener) !== id)
          )
        }
        const handleOpenerAdding = newOpener => {
          setFieldValue('openers', [...values.openers, newOpener])
        }
        const handleCancel = () => {
          setFieldValue('openers', initialValues.openers)
        }

        return (
          <Form>
            {mayRenderCurrentOpeners(values.openers, handleOpenerRemoval)}
            <Can I={MODIFY} this={COMPOSTER_LISTES_OUVREURS}>
              {mayRenderOpenersSelect(permanence.$openersAvailable, values.openers)}
              {mayRenderNoOpenersWarning(values.openers)}
              <FormControlLabel
                className={switchRoot}
                classes={{ label: switchLabel }}
                control={<FormikSwitch name="isPermanenceAnEvent" checked={values.isPermanenceAnEvent} />}
                label="Cette permanence est un événement"
              />
              {mayRenderEventFields(values.isPermanenceAnEvent)}
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
            <Can not I={MODIFY} this={COMPOSTER_PERMANENCE_MESSAGE}>
              {mayRenderEventMessage(permanence.eventTitle, permanence.eventMessage)}
            </Can>
            {mayRenderOpenerCapabilityFooter(values.openers, initialValues.openers, handleOpenerAdding, handleCancel)}
          </Form>
        )
      }}
    </Formik>
  )
}

PopoverPermanenceToComeContent.propTypes = {
  permanence: permanenceType.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const PopoverPermanenceToCome = withPermanancePopoverWrapper(PopoverPermanenceToComeContent)

export default PopoverPermanenceToCome
