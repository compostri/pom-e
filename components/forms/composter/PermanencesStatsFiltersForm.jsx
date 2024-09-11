import React, {useContext, useEffect} from 'react'
import * as Yup from 'yup'
import {Formik, Form, Field} from 'formik'
import {Box, Button, CircularProgress, Grid, FormControl} from '@material-ui/core'
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import dayjs from "dayjs";
import DaysJSUtils from "@date-io/dayjs";

const FilterSchema = Yup.object().shape({
    startDate: Yup.date()
        .required('Le champ date de début est obligatoire'),
    endDate: Yup.date().required('Le champ date de fin est obligatoire')
})

/**
 * Filtre de date pour les stats
 */

const initialValues = {
    startDate: dayjs().subtract(30, 'day').toISOString(),
    endDate: dayjs().toISOString()
}

const ComposterContactForm = ({setFilterDate}) => {


    useEffect(() => {
        setFilterDate(initialValues.startDate, initialValues.endDate)
    }, [])

    const submit = async (values, {setSubmitting }) => {
        setFilterDate(values.startDate, values.endDate)
        setSubmitting(false)
    }

    return (
        <MuiPickersUtilsProvider utils={DaysJSUtils}>
        <Box m={2}>
            <Formik initialValues={initialValues} validationSchema={FilterSchema} enableReinitialize onSubmit={submit}>
                {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
                    <Form>
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={12} sm={5}>
                                <Field name="startDate">
                                    {({ field, form }) => (
                                        <DatePicker
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            {...field}
                                            variant="inline"
                                            autoOk
                                            format="D MMMM YYYY"
                                            required
                                            fullWidth
                                            label="Aprés"
                                            id="filter-startDate"
                                            value={values.startDate}
                                            onChange={value => form.setFieldValue(field.name, value.toISOString())}
                                        />
                                    )}
                                </Field>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Field name="endDate">
                                    {({ field, form }) => (
                                        <DatePicker
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            {...field}
                                            variant="inline"
                                            autoOk
                                            format="D MMMM YYYY"
                                            required
                                            fullWidth
                                            label="Aprés"
                                            id="filter-endDate"
                                            value={values.endDate}
                                            onChange={value => form.setFieldValue(field.name, value.toISOString())}
                                        />
                                    )}
                                </Field>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth={true}>
                                    <Button type="submit" variant="contained" color="secondary" fullWidth={true}>
                                        {isSubmitting ? <CircularProgress /> : 'Envoyer'}
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
        </MuiPickersUtilsProvider>
    )
}

export default ComposterContactForm
