import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Sidebar from '../components/sidebar'

import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import ReactMapGL, { Popup, Source, Layer } from 'react-map-gl'
import api from '../utils/api'
import { UserButton } from '../components/UserButton'

const useStyles = makeStyles(theme => ({
  mapContainer: {
    marginLeft: '0'
  },
  userButton: {
    position: 'fixed',
    top: '40px',
    right: '40px',
    zIndex: 150
  }
}))

const PopupContent = ({ composter }) => (
  <Link href="/composter/[slug]" as={`/composter/${composter.id}`} passHref>
    <Button>
      <Typography paragraph>{composter.name}</Typography>
    </Button>
  </Link>
)

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
  const [selectedCommune, setSelectedCommune] = useState(allCommunes[0].id)
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
        {...{ allCommunes, allCategories, selectedCommune, setSelectedCommune, selectedCategories, setSelectedCategories, selectedStatus, setSelectedStatus }}
      />

      <UserButton />

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
                    'circle-radius': 8,
                    'circle-color': 'rgba(55,148,179,1)'
                  },
                  filter: ['all', ['==', 'commune', selectedCommune], ['in', 'categorie', ...selectedCategories], ['in', 'status', ...selectedStatus]]
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
