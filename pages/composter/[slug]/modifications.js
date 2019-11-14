import React from 'react'
import { Paper, InputLabel, FormControl, Select, MenuItem, Tabs, Tab, Button, IconButton, Box, Typography } from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DaysJSUtils from '@date-io/dayjs'
import { Formik, Form, Field, FieldArray } from 'formik'
import dayjs from 'dayjs'
import { RRule, RRuleSet, rrulestr } from 'rrule'
import 'dayjs/locale/fr'

import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'

dayjs.locale('fr')

const useStyles = makeStyles(theme => ({}))

const RuleForm = ({ index }) => {
  return (
    <MuiPickersUtilsProvider utils={DaysJSUtils}>
      <FormControl>
        <InputLabel id="week-day-label">Jour de la semaine</InputLabel>
        <Field name={`rules.${index}.day`}>
          {({ field, form, meta }) => (
            <Select ampm={false} labelId="week-day-label" id="week-day" {...field}>
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
      <FormControl>
        <Field name={`rules.${index}.timeStart`}>
          {({ field, form }) => (
            <TimePicker ampm={false} label="Heure d‘ouverture" variant="inline" autoOk {...field} onChange={value => form.setFieldValue(field.name, value)} />
          )}
        </Field>
      </FormControl>
      <FormControl>
        <Field name={`rules.${index}.startDate`}>
          {({ field, form }) => (
            <DatePicker ampm={false} label="Date de début" autoOk {...field} onChange={value => form.setFieldValue(field.name, value)} clearable />
          )}
        </Field>
      </FormControl>
      <FormControl>
        <Field name={`rules.${index}.endDate`}>
          {({ field, form }) => (
            <DatePicker ampm={false} label="Date de fin" autoOk {...field} onChange={value => form.setFieldValue(field.name, value)} clearable />
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
  const RRuleSet = rrulestr(RRuleSetString)
  return RRuleSet.rrules().map(rrule => {
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
                      <div>
                        <RuleForm key={index} index={index} {...rule} />
                        <Button type="button" onClick={() => remove(index)} startIcon={<Remove />}>
                          Retirer la régle
                        </Button>
                      </div>
                    ))}
                  <Button type="button" onClick={() => push(defaultRule)} startIcon={<Add />}>
                    Ajouter une régle
                  </Button>
                  <Button type="submit" color="secondary" variant="contained">
                    Submit
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

  return (
    <ComposterContainer composter={composter} maxWidth="md">
      <Paper>
        <Tabs value={activeTab} onChange={event => setActiveTab(event.currentTarget.id)} aria-label="Gestion du composteur" variant="fullWidth">
          <Tab
            label="Informations sur le site de compost"
            id="informations-composteur"
            value="informations-composteur"
            aria-controls="informations-composteur-content"
          />
          <Tab label="Formulaires de contact" id="contact-composteur" value="contact-composteur" aria-controls="contact-composteur-content" />
          <Tab label="Permanences" id="perm-composteur" value="perm-composteur" aria-controls="perm-composteur-content" />
        </Tabs>
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
