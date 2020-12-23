/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react'
import { InputLabel, FormControl, Select, TextField, MenuItem, Button, Grid, Box, Hidden, IconButton } from '@material-ui/core'
import { Add, Delete } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DaysJSUtils from '@date-io/dayjs'
import { Formik, Form, Field, FieldArray } from 'formik'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import { RRule, RRuleSet, rrulestr } from 'rrule'
import PropTypes from 'prop-types'

import palette from '~/variables'
import 'dayjs/locale/fr'
import api from '~/utils/api'
import { ComposterContext } from '~/context/ComposterContext'
import { useToasts, TOAST } from '~/components/Snackbar'

const useStyles = makeStyles(theme => ({
  tab: {
    fontSize: 16,
    padding: 0,
    marginRight: theme.spacing(3),
    minWidth: 'auto'
  },
  header: {
    display: 'flex',
    padding: 24
  },
  tabs: {
    flexGrow: '1'
  },
  hourLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4),
      flexWrap: 'wrap'
    }
  },
  permDay: {
    minWidth: 130
  },
  valider: {
    display: 'block',
    margin: '0 auto',
    '&:hover': {
      backgroundColor: palette.redOpacity
    }
  },
  permBtnCreate: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: palette.greenPrimary,
    color: palette.greenPrimary,
    weight: '700',
    fontSize: 16,
    padding: theme.spacing(1, 2, 1, 1),
    margin: theme.spacing(1, 0, 2, 0),
    '&:hover': {
      backgroundColor: palette.greenOpacity
    }
  },
  permBtnCreateIcon: {
    marginRight: theme.spacing(1)
  },
  permBtnSuppr: {
    color: palette.greenPrimary,
    '&:hover': {
      backgroundColor: palette.greenOpacity
    }
  },
  switchLabel: {
    color: palette.greyMedium,
    fontSize: 16,
    margin: theme.spacing(1, 0, 2, 0)
  }
}))

const RuleForm = ({ index }) => {
  const classes = useStyles()
  return (
    <MuiPickersUtilsProvider utils={DaysJSUtils}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="week-day-label">Jour </InputLabel>
            <Field name={`rules.${index}.day`}>
              {({ field }) => (
                <Select className={classes.permDay} labelId="week-day-label" id="week-day" {...field}>
                  <MenuItem value={RRule.MO}>Lundi</MenuItem>
                  <MenuItem value={RRule.TU}>Mardi</MenuItem>
                  <MenuItem value={RRule.WE}>Mercredi</MenuItem>
                  <MenuItem value={RRule.TH}>Jeudi</MenuItem>
                  <MenuItem value={RRule.FR}>Vendredi</MenuItem>
                  <MenuItem value={RRule.SA}>Samedi</MenuItem>
                  <MenuItem value={RRule.SU}>Dimanche</MenuItem>
                </Select>
              )}
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <Field name={`rules.${index}.timeStart`}>
              {({ field, form }) => (
                <TextField
                  InputLabelProps={{
                    shrink: true
                  }}
                  type="time"
                  label="Heure d‘ouverture"
                  {...field}
                  value={field.value.format('HH:mm')}
                  onChange={e => {
                    const [hour, min] = e.target.value.split(':')
                    form.setFieldValue(
                      field.name,
                      dayjs()
                        .hour(hour)
                        .minute(min)
                    )
                  }}
                />
              )}
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <Field name={`rules.${index}.startDate`}>
              {({ field, form }) => (
                <DatePicker
                  InputLabelProps={{
                    shrink: true
                  }}
                  {...field}
                  label="Date de début"
                  variant="inline"
                  autoOk
                  format="D MMMM YYYY"
                  onChange={value => form.setFieldValue(field.name, value)}
                />
              )}
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <Field name={`rules.${index}.endDate`}>
              {({ field, form }) => (
                <DatePicker
                  InputLabelProps={{
                    shrink: true
                  }}
                  label="Date de fin"
                  variant="inline"
                  autoOk
                  format="D MMMM YYYY"
                  {...field}
                  onChange={value => form.setFieldValue(field.name, value)}
                />
              )}
            </Field>
          </FormControl>
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

const getRrulesFromObject = rObject => {
  const rruleSet = new RRuleSet()
  rObject.map(rule =>
    rruleSet.rrule(
      new RRule({
        freq: RRule.WEEKLY,
        byweekday: rule.day,
        byhour: dayjs.utc(rule.timeStart).hour(),
        byminute: rule.timeStart.minute(),
        dtstart: rule.startDate ? rule.startDate.utc().toDate() : undefined,
        until: rule.endDate ? rule.endDate.utc().toDate() : undefined
        //tzid: 'Europe/Paris'
      })
    )
  )
  return rruleSet.toString()
}

const getRulesFormFromString = RRuleSetString => {
  const rruleSet = rrulestr(RRuleSetString, { forceset: true })

  return rruleSet.rrules().map(rrule => {
    // On enregistre les date en UTC
    return {
      day: rrule.origOptions.byweekday[0],
      timeStart: dayjs()
        .utc()
        .hour(rrule.origOptions.byhour)
        .minute(rrule.origOptions.byminute)
        .local(),
      startDate: rrule.origOptions.dtstart
        ? dayjs(rrule.origOptions.dtstart)
            .utc()
            .local()
        : null,
      endDate: rrule.origOptions.until
        ? dayjs(rrule.origOptions.until)
            .utc()
            .local()
        : null
    }
  })
}

const defaultRule = {
  day: RRule.MO,
  timeStart: dayjs(),
  startDate: null,
  endDate: null
}

const PermanencesRulesForm = () => {
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext
  const { addToast } = useToasts()
  const classes = useStyles()

  if (!composter) return null
  const initialRules = composter.permanencesRule ? getRulesFormFromString(composter.permanencesRule) : [defaultRule]
  return (
    <Formik
      initialValues={{ rules: initialRules }}
      onSubmit={async values => {
        const rrulesSring = getRrulesFromObject(values.rules)
        const response = await api.updateComposter(composter.slug, { permanencesRule: rrulesSring })
        if (response) {
          addToast('Votre modification a bien été prise en compte !', TOAST.SUCCESS)
        } else {
          addToast('Une erreur est survenue', TOAST.ERROR)
        }
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="rules">
            {({ push, remove }) => (
              <div>
                {values.rules &&
                  values.rules.map((rule, index) => (
                    <div key={`rule-${rule.timeStart.valueOf()}`}>
                      <Box className={classes.hourLine}>
                        <RuleForm index={index} {...rule} />

                        <Hidden smDown>
                          <IconButton type="button" onClick={() => remove(index)} className={classes.permBtnSuppr}>
                            <Delete />
                          </IconButton>
                        </Hidden>
                        <Hidden mdUp>
                          <Button type="button" startIcon={<Delete />} onClick={() => remove(index)} variant="contained" color="primary">
                            Supprimer
                          </Button>
                        </Hidden>
                      </Box>
                    </div>
                  ))}

                <Button type="button" onClick={() => push(defaultRule)} className={classes.permBtnCreate}>
                  <Add className={classes.permBtnCreateIcon} />
                  Nouveau créneau
                </Button>
                <Button className={classes.valider} type="submit" color="secondary" variant="contained">
                  Valider
                </Button>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  )
}

RuleForm.propTypes = {
  index: PropTypes.number.isRequired
}

export default PermanencesRulesForm
