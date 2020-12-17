/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { makeStyles } from '@material-ui/styles'
import { fitBounds } from 'viewport-mercator-project'
import bbox from '@turf/bbox'
import PropTypes from 'prop-types'

import ReactMapGL, { Popup, Source, Layer, NavigationControl } from 'react-map-gl'

import { communeType, categorieType } from '~/types'
import Sidebar from '~/components/Sidebar'
import api from '~/utils/api'
import UserButton from '~/components/UserButton'
import ComposterInfoWindow from '~/components/ComposterInfoWindow'

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  mapContainer: {
    marginLeft: 80,
    [breakpoints.down('sm')]: {
      marginLeft: 40
    }
  },
  userButton: {
    position: 'fixed',
    top: spacing(5),
    right: spacing(4),
    zIndex: 150
  },
  popup: {
    '& > .mapboxgl-popup-content': {
      padding: 0
    }
  },
  navigationControl: {
    position: 'absolute',
    right: spacing(4),
    bottom: spacing(5)
  }
}))

const Home = ({ allCommunes, allCategories }) => {
  const classes = useStyles()
  const [composters, setComposters] = useState(null)
  const [mapViewport, setMapViewport] = useState({
    width: '100%',
    height: '100vh',
    latitude: 47.1890984,
    longitude: -1.5704894,
    zoom: 9,
    bearing: 0,
    pitch: 0
  })
  const [openSidebar, setOpenSidebar] = useState(true)
  const [acceptNewMembers, setAcceptNewMembers] = useState(true)
  const [selectedCommune, setSelectedCommune] = useState(allCommunes.map(com => com.id))
  const [selectedCategories, setSelectedCategories] = useState(allCategories.map(cat => cat.id))
  const [selectedStatus, setSelectedStatus] = useState(['Active'])
  const [mapPopup, setMapPopup] = useState(false)

  const fetchComposters = async () => {
    const geojson = await api.getComposterGeojson()
    if (geojson.status === 200) {
      setComposters(geojson.data)

      // Fit bound
      const [minLng, minLat, maxLng, maxLat] = bbox(geojson.data)

      const { longitude, latitude, zoom } = fitBounds({
        // eslint-disable-next-line no-undef
        width: window.innerWidth,
        // eslint-disable-next-line no-undef
        height: window.innerHeight,
        bounds: [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        padding: {
          top: 40,
          bottom: 40,
          right: 40,
          left: openSidebar ? 460 : 40
        }
      })
      setMapViewport({ ...mapViewport, longitude, latitude, zoom })
    }
  }

  useEffect(() => {
    fetchComposters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <title>Les composteurs de Compostri</title>
        <meta name="description" content="Retrouvez tous les composteurs de Nantes Métropole géré par l’association Compostri" />
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
          setAcceptNewMembers,
          openSidebar,
          setOpenSidebar
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
                    acceptNewMembers ? ['==', 'acceptNewMembers', acceptNewMembers] : ['>=', 'acceptNewMembers', acceptNewMembers]
                  ]
                }}
              />
            </Source>
          )}
          {mapPopup && (
            <Popup
              latitude={mapPopup.lat}
              longitude={mapPopup.lng}
              closeButton={false}
              closeOnClick={false}
              className={classes.popup}
              onClose={() => setMapPopup(false)}
              offsetTop={-8}
            >
              <ComposterInfoWindow composter={mapPopup} />
            </Popup>
          )}
          <div className={classes.navigationControl}>
            <NavigationControl />
          </div>
        </ReactMapGL>
      </section>
    </div>
  )
}

Home.propTypes = {
  allCommunes: PropTypes.arrayOf(communeType).isRequired,
  allCategories: PropTypes.arrayOf(categorieType).isRequired
}

Home.getInitialProps = async () => {
  const communes = await api.getCommunes({ 'order[name]': 'ASC', 'exists[composters.lat]': true, 'exists[composters.lng]': true })
  const cat = await api.getCategories()

  return {
    allCommunes: communes.data['hydra:member'],
    allCategories: cat.data['hydra:member']
  }
}

export default Home
