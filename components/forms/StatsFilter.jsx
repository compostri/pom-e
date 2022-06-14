import React from 'react'
import { FormControl, Button, Grid } from '@material-ui/core'
import { useRouter } from 'next/router'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DaysJSUtils from '@date-io/dayjs'
import { pickBy } from 'lodash'
import { makeStyles } from '@material-ui/styles'

const nullIfNotSet = value => {
  if (value && value.length > 0) {
    return value
  }

  return null
}

const useStyles = makeStyles(() => ({
  filterButton: {
    marginTop: 16
  }
}))

const inputLabelProps = {
  shrink: true
}

const propTypes = {}

const StatsFilters = () => {
  const router = useRouter()
  const styles = useStyles()
  const fromDate = nullIfNotSet(router.query.fromDate)
  const toDate = nullIfNotSet(router.query.toDate)
  const hasFilter = fromDate || toDate

  const handleChangeDate = fieldName => value => {
    const params = {
      fromDate,
      toDate
    }

    params[fieldName] = value?.format('YYYY-MM-DD')

    const query = pickBy(
      {
        ...router.query,
        ...params
      },
      val => !!val
    )

    router.push({
      query
    })
  }

  const handleClear = () => {
    const query = pickBy(
      {
        ...router.query,
        fromDate: undefined,
        toDate: undefined
      },
      val => !!val
    )

    router.push({
      query
    })
  }

  return (
    <MuiPickersUtilsProvider utils={DaysJSUtils}>
      <Grid container spacing={3} justify="center" alignItems="flex-start">
        <Grid item>
          <FormControl fullWidth={false}>
            <DatePicker
              name="fromDate"
              InputLabelProps={inputLabelProps}
              label="Date de début"
              variant="dialog"
              autoOk
              format="D MMMM YYYY"
              onChange={handleChangeDate('fromDate')}
              value={fromDate}
              clearable
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth={false}>
            <DatePicker
              name="toDate"
              InputLabelProps={inputLabelProps}
              label="Date de fin"
              variant="dialog"
              autoOk
              format="D MMMM YYYY"
              onChange={handleChangeDate('toDate')}
              value={toDate}
              clearable
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          {hasFilter && (
            <Button type="button" color="secondary" onClick={handleClear} className={styles.filterButton}>
              Effacer les filtres
            </Button>
          )}
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

StatsFilters.propTypes = propTypes

export default StatsFilters
