import palette from '../variables'

const getComposterColor = composter => {
  let composterColor = palette.grey
  if (!composter) {
    return composterColor
  }
  switch (composter.categorie) {
    case 1:
      composterColor = palette.blue
      break
    case 2:
      composterColor = palette.orangePrimary
      break
    case 3:
      composterColor = palette.brown
      break
    case 4:
      composterColor = palette.greenPrimary
      break
    default:
      composterColor = palette.grey
  }
  return composterColor
}

export default getComposterColor
