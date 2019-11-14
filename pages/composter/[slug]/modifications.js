import React from 'react'
import { Paper, InputLabel, FormControl, Select, MenuItem, Tabs, Tab, Button, IconButton, Box, Typography } from '@material-ui/core'
import { Add, Remove, Delete, Clear } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import Link from 'next/link'
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DaysJSUtils from '@date-io/dayjs'
import { Formik, Form, Field, FieldArray } from 'formik'
import dayjs from 'dayjs'
import { RRule, RRuleSet, rrulestr } from 'rrule'
import 'dayjs/locale/fr'

import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'

dayjs.locale('fr')

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
  permForm: {
    margin: theme.spacing(0, 2, 2, 0)
  },
  permDay: {
    minWidth: 130
  },
  valider: {
    display: 'block',
    margin: '0 auto'
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
    padding: theme.spacing(2.75, 0, 2.75, 0),
    '&:hover': {
      backgroundColor: palette.greenOpacity
    }
  }
}))

const RuleForm = ({ index }) => {
  const classes = useStyles()
  return (
    <MuiPickersUtilsProvider utils={DaysJSUtils}>
      <FormControl className={classes.permForm}>
        <InputLabel id="week-day-label">Jour </InputLabel>
        <Field name={`rules.${index}.day`}>
          {({ field, form, meta }) => (
            <Select className={classes.permDay} ampm={false} labelId="week-day-label" id="week-day" {...field}>
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
      <FormControl className={classes.permForm}>
        <Field name={`rules.${index}.timeStart`}>
          {({ field, form }) => (
            <TimePicker ampm={false} label="Heure d‘ouverture" variant="inline" autoOk {...field} onChange={value => form.setFieldValue(field.name, value)} />
          )}
        </Field>
      </FormControl>
      <FormControl className={classes.permForm}>
        <Field name={`rules.${index}.startDate`}>
          {({ field, form }) => (
            <DatePicker
              InputLabelProps={{
                shrink: true
              }}
              ampm={false}
              label="Date de début"
              variant="inline"
              autoOk
              {...field}
              onChange={value => form.setFieldValue(field.name, value)}
            />
          )}
        </Field>
      </FormControl>
      <FormControl className={classes.permForm}>
        <Field name={`rules.${index}.endDate`}>
          {({ field, form }) => (
            <DatePicker
              InputLabelProps={{
                shrink: true
              }}
              ampm={false}
              label="Date de fin"
              variant="inline"
              autoOk
              {...field}
              onChange={value => form.setFieldValue(field.name, value)}
            />
          )}
        </Field>
      </FormControl>
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
        byhour: rule.timeStart.hour(),
        byminute: rule.timeStart.minute(),
        dtstart: rule.startDate ? rule.startDate.toDate() : undefined,
        until: rule.endDate ? rule.endDate.toDate() : undefined
      })
    )
  )
  return rruleSet.toString()
}

const getRulesFormFromString = RRuleSetString => {
  const rruleSet = rrulestr(RRuleSetString, { forceset: true })

  return rruleSet.rrules().map(rrule => {
    return {
      day: rrule.origOptions.byweekday[0],
      timeStart: dayjs()
        .hour(rrule.origOptions.byhour)
        .minute(rrule.origOptions.byminute),
      startDate: rrule.origOptions.dtstart ? dayjs(rrule.origOptions.dtstart) : null,
      endDate: rrule.origOptions.until ? dayjs(rrule.origOptions.until) : null
    }
  })
}

const defaultRule = {
  day: RRule.MO,
  timeStart: dayjs(),
  startDate: null,
  endDate: null
}

const PermanencesRules = props => {
  const { composter, ...otherProps } = props
  const initialRules = composter.permanencesRule ? getRulesFormFromString(composter.permanencesRule) : [defaultRule]
  const classes = useStyles()
  return (
    <Box {...otherProps}>
      <Formik
        initialValues={{ rules: initialRules }}
        onSubmit={async values => {
          const rrulesSring = getRrulesFromObject(values.rules)
          const response = await api.updateComposter(composter.slug, { permanencesRule: rrulesSring })
          console.log(response)
        }}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="rules">
              {({ push, remove }) => (
                <div>
                  {values.rules &&
                    values.rules.map((rule, index) => (
                      <div key={`rule-${index}`}>
                        <RuleForm key={index} index={index} {...rule} />

                        <Button type="button" onClick={() => remove(index)} className={classes.permBtnSuppr}>
                          <Delete />
                        </Button>
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
    </Box>
  )
}

const ComposterEdit = ({ composter }) => {
  const [activeTab, setActiveTab] = React.useState('perm-composteur')
  const classes = useStyles()

  return (
    <ComposterContainer composter={composter} maxWidth="md">
      <Paper>
        <div className={classes.header}>
          <Tabs
            className={classes.tabs}
            value={activeTab}
            onChange={event => setActiveTab(event.currentTarget.id)}
            aria-label="Gestion du composteur"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              className={classes.tab}
              label="Informations "
              id="informations-composteur"
              value="informations-composteur"
              aria-controls="informations-composteur-content"
            />
            <Tab
              className={classes.tab}
              label="Formulaires de contact"
              id="contact-composteur"
              value="contact-composteur"
              aria-controls="contact-composteur-content"
            />
            <Tab className={classes.tab} label="Permanences" id="perm-composteur" value="perm-composteur" aria-controls="perm-composteur-content" />
          </Tabs>
          <Link href="/composter/[slug]" as={`/composter/${composter.slug}`} passHref>
            <IconButton>
              <Clear />
            </IconButton>
          </Link>
        </div>

        <Box
          p={3}
          role="tabpanel"
          hidden={activeTab !== 'informations-composteur'}
          id="informations-composteur-content"
          aria-labelledby="informations-composteur"
        >
          <Typography paragraph>Informations du composteur</Typography>
        </Box>
        <Box p={3} role="tabpanel" hidden={activeTab !== 'contact-composteur'} id="contact-composteur-content" aria-labelledby="contact-composteur">
          <Typography paragraph>Formulaire de contact</Typography>
        </Box>
        <PermanencesRules
          p={3}
          role="tabpanel"
          hidden={activeTab !== 'perm-composteur'}
          id="perm-composteur-content"
          aria-labelledby="perm-composteur"
          composter={composter}
        />
      </Paper>
    </ComposterContainer>
  )
}

ComposterEdit.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterEdit
