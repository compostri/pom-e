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

export const redirect = ({ Router: router, ctx, location, status = 302 }) => {
  if (ctx.res) {
    ctx.res.writeHead(status, {
      Location: location,
      // Add the content-type for SEO considerations
      'Content-Type': 'text/html; charset=utf-8'
    })
    ctx.res.end()
    return
  }

  router.replace(location)
}
