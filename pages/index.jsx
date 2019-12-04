import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Button, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Room, Person, RadioButtonChecked } from '@material-ui/icons'

import ReactMapGL, { Popup, Source, Layer } from 'react-map-gl'

import { composterType } from '~/types'
import Sidebar from '~/components/Sidebar'
import DefaultImage from '~/components/DefaultImage'
import { getComposterColor } from '~/utils/utils'

import api from '~/utils/api'
import UserButton from '~/components/UserButton'
import palette from '~/variables'

const useStyles = makeStyles(({ spacing }) => ({
  mapContainer: {
    marginLeft: '0'
  },
  userButton: {
    position: 'fixed',
    top: spacing(5),
    right: spacing(4),
    zIndex: 150
  },

  listItem: {
    padding: 0
  },
  infoIcone: {
    padding: 0,
    margin: 0,
    minWidth: 10
  },
  containerInfo: {
    alignItems: 'center',
    padding: 0,
    backgroundColor: palette.greyExtraLight,
    display: 'flex',
    justifyContent: 'space-around',
    marginLeft: '2%',
    minWidth: 'max-content'
  },

  titre: {
    fontSize: '1.3em',
    color: 'grey',
    fontWeight: 700,
    justifySelf: 'center'
  },
  buttonTitre: {
    alignSelf: 'center'
  },
  infoImg: {
    display: 'flex'
  }
}))
const propTypes = { composter: composterType.isRequired }
const PopupContent = ({ composter }) => {
  const classes = useStyles()
  const composterColor = getComposterColor(composter)

  return (
    <>
      <Link href="/composter/[slug]" as={`/composter/${composter.slug}`} passHref>
        <Button className={classes.buttonTitre}>
          <Typography paragraph className={classes.titre}>
            {composter.name}
          </Typography>
        </Button>
      </Link>
      <div className={classes.infoImg}>
        {composter.image ? (
          <Box>
            <img src={composter.image} alt="Composteur" id="imgComposter" />
          </Box>
        ) : (
          <DefaultImage composter={composter} />
        )}
        <Paper className={classes.containerInfo}>
          <List>
            <div>
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.infoIcone}>
                  <Room style={{ color: composterColor }} />
                </ListItemIcon>
                <ListItemText>{composter.commune.name}</ListItemText>
              </ListItem>
            </div>
            <div>
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.infoIcone}>
                  <RadioButtonChecked style={{ color: composterColor }} />
                </ListItemIcon>
                <ListItemText>{composter.categorieName}</ListItemText>
              </ListItem>
            </div>
            <div className={classes.InfoImg}>
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.infoIcone}>
                  <Person style={{ color: composterColor }} />
                </ListItemIcon>
                <ListItemText>{composter.acceptNewMembers ? 'Accepte' : "N'accepte pas"} de nouveau adhérents</ListItemText>
              </ListItem>
            </div>
          </List>
        </Paper>
      </div>
    </>
  )
}

PopupContent.propTypes = propTypes

const Home = ({ allCommunes, allCategories }) => {
  const classes = useStyles()
  const [composters, setComposters] = useState(null)
  const [mapViewport, setMapViewport] = useState({
    width: '100%)',
    height: '100vh',
    latitude: 47.1890984,
    longitude: -1.5704894,
    zoom: 9,
    bearing: 0,
    pitch: 0
  })

  const [acceptNewMembers, setAcceptNewMembers] = useState(true)
  const [selectedCommune, setSelectedCommune] = useState(allCommunes.map(com => com.id))
  const [selectedCategories, setSelectedCategories] = useState(allCategories.map(cat => cat.id))
  const [selectedStatus, setSelectedStatus] = useState(['Active'])
  const [mapPopup, setMapPopup] = useState(false)

  useEffect(() => {
    fetchComposters()
  }, [])

  const fetchComposters = async () => {
    const geojson = await api.getComposterGeojson()
    if (geojson.status === 200) {
      setComposters(geojson.data)
    }
  }

  const onMapClick = event => {
    const { features } = event
    const composterCircleClicked = features && features.find(f => f.layer.id === 'data')

    if (composterCircleClicked) {
      setMapPopup({
        ...composterCircleClicked.properties,
        lat: composterCircleClicked.geometry.coordinates[1],
        lng: composterCircleClicked.geometry.coordinates[0]
      })
    } else if (mapPopup) {
      setMapPopup(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar
        {...{
          allCommunes,
          allCategories,
          selectedCommune,
          setSelectedCommune,
          selectedCategories,
          setSelectedCategories,
          selectedStatus,
          setSelectedStatus,
          acceptNewMembers,
          setAcceptNewMembers
        }}
      />

      <div className={classes.userButton}>
        <UserButton />
      </div>

      <section className={classes.mapContainer}>
        <ReactMapGL
          {...mapViewport}
          mapStyle={process.env.NEXT_STATIC_MAP_BOX_STYLE}
          mapboxApiAccessToken={process.env.NEXT_STATIC_MAP_BOX_TOKEN}
          onViewportChange={viewport => setMapViewport(viewport)}
          onClick={onMapClick}
        >
          {composters && (
            <Source type="geojson" data={composters}>
              <Layer
                {...{
                  id: 'data',
                  type: 'circle',
                  paint: {
                    'circle-stroke-width': 3,
                    'circle-radius': 7,
                    'circle-color': ['match', ['get', 'categorie'], 1, '#7bced1', 2, '#e86034', 3, '#6c3727', 4, '#a3c538', '#7b7d75'],
                    'circle-stroke-color': 'white'
                  },
                  filter: [
                    'all',
                    ['in', 'commune', ...selectedCommune],
                    ['in', 'categorie', ...selectedCategories],
                    ['in', 'status', ...selectedStatus],
                    ['==', 'acceptNewMembers', acceptNewMembers]
                  ]
                }}
              />
            </Source>
          )}
          {mapPopup && (
            <Popup
              latitude={mapPopup.lat}
              longitude={mapPopup.lng}
              closeButton={() => setMapPopup(false)}
              closeOnClick={false}
              onClose={() => setMapPopup(false)}
              offsetTop={-8}
            >
              <PopupContent composter={mapPopup} />
            </Popup>
          )}
        </ReactMapGL>
      </section>
    </div>
  )
}

Home.getInitialProps = async () => {
  const communes = await api.getCommunes()
  const cat = await api.getCategories()

  return {
    allCommunes: communes.data['hydra:member'],
    allCategories: cat.data['hydra:member']
  }
}

export default Home
