import React from 'react'
import {
  Paper,
  InputLabel,
  FormControl,
  FormGroup,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  SnackbarContent
} from '@material-ui/core'
import { Add, Delete, Clear } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import Link from 'next/link'
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DaysJSUtils from '@date-io/dayjs'
import { Formik, Form, Field, FieldArray } from 'formik'
import dayjs from 'dayjs'
import { RRule, RRuleSet, rrulestr } from 'rrule'
import 'dayjs/locale/fr'
import InformationsForm from '~/components/forms/composter/InformationsForm'
import PermanencesRulesForm from '~/components/forms/composter/PermanencesRulesForm'

import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'
import ContactForm from '~/components/forms/composter/ContactForm'

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
    margin: '0 auto',
    '&:hover': {
      backgroundColor: palette.orangeOpacity
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
    padding: theme.spacing(2.75, 0, 2.75, 0),
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

const ComposterEdit = ({ composter }) => {
  const [activeTab, setActiveTab] = React.useState('informations-composteur')
  const [snackBarMessage, setSnackBarMessage] = React.useState(false)
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

        <InformationsForm
          p={3}
          role="tabpanel"
          hidden={activeTab !== 'informations-composteur'}
          id="informations-composteur-content"
          aria-labelledby="informations-composteur"
          composter={composter}
          setSnackBarMessage={setSnackBarMessage}
        />

        <ContactForm
          p={3}
          role="tabpanel"
          hidden={activeTab !== 'contact-composteur'}
          id="contact-composteur-content"
          aria-labelledby="contact-composteur"
          composter={composter}
          setSnackBarMessage={setSnackBarMessage}
        ></ContactForm>

        <PermanencesRulesForm
          p={3}
          role="tabpanel"
          hidden={activeTab !== 'perm-composteur'}
          id="perm-composteur-content"
          aria-labelledby="perm-composteur"
          composter={composter}
          setSnackBarMessage={setSnackBarMessage}
        />
        <Snackbar open={snackBarMessage} onClose={() => setSnackBarMessage(false)}>
          <SnackbarContent variant="error" message={snackBarMessage} />
        </Snackbar>
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
