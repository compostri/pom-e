import palette from '../variables'

export const getCategoryColor = category => {
  let color = palette.grey
  if (!category) {
    return color
  }
  switch (category.id) {
    case 1:
      color = palette.blue
      break
    case 2:
      color = palette.orangePrimary
      break
    case 3:
      color = palette.brown
      break
    case 4:
      color = palette.greenPrimary
      break
    default:
      color = palette.grey
  }
  return color
}

export const getComposterColor = composter => {
  const cat = typeof composter.categorie === 'object' ? composter.categorie : { id: composter.categorie }
  return getCategoryColor(cat)
}

export const getInitial = name => {
  return name.charAt(0).toUpperCase()
}
