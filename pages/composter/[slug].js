import api from "../../utils/api"
import {Paper, Typography} from "@material-ui/core"

const ComposterDetail = ( { composter} ) => {

  return ( <Paper><Typography variant='h1'>{composter.name}</Typography></Paper>)
}

ComposterDetail.getInitialProps = async ( {query}) => {
  const composter = await api.getComposter( query.slug )

  return {
    composter: composter.data,
  }
}

export default ComposterDetail