import {StyleSheet, Image, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import MapPolyLineCompnent from './MapPolyLineCompnent';
import {darkMapStyles} from '../Config/MapConfig';
import {Text, useTheme} from 'react-native-paper';
import {useAppFeature} from '../Context/AppFeatureContext';
import AppUpdateComponent from './AppUpdateComponent';

const MapComponents = ({
  trackingLineCoordinates,
  mapRef,
  user,
  updateTitle,
  updateLink,
  updateDescription,
  isUpdateAvailable,
  setNewAppUpdate,
  hardUpdate,
}) => {
  const [marker, setMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 22.719459654294255,
    longitude: 75.857048307291,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [lastLocationRef, setLastLocationRef] = useState('');
  const [markerSize, setMarkerSize] = useState({width: 0, height: 0});

  // const handleLayout = event => {
  //   const {width, height} = event.nativeEvent.layout;
  //   const markerSize = Math.min(width, height) * 0.9;
  //   setMarkerSize({width: markerSize, height: markerSize});
  // };

  const [heading, setHeading] = useState('0');
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 22.719459654294255,
    longitude: 75.857048307291,
  });

  const {appFeatureState} = useAppFeature();

  useEffect(() => {
    if (trackingLineCoordinates) {
      const getLastPosition = trackingLineCoordinates?.slice(-1)[0];

      if (getLastPosition) {
        if (mapRef.current) {
          if (marker) {
            marker.animateMarkerToCoordinate(
              {
                latitude: getLastPosition.latitude,
                longitude: getLastPosition.longitude,
              },
              4000,
            );
          }
          setHeading(getLastPosition.heading);
          console.log('Inside Region');
          mapRef.current.animateToRegion(
            {
              latitude: getLastPosition.latitude,
              longitude: getLastPosition.longitude,
              heading: getLastPosition.heading,
              latitudeDelta: 0.019,
              longitudeDelta: 0.019,
            },
            4000,
          );
        }

        if (getLastPosition?.createdAt) {
          const date = new Date(
            getLastPosition?.createdAt,
          ).toLocaleTimeString();
          setLastLocationRef(date || 'Not connected');
        }
      }
    }

    // Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [trackingLineCoordinates]);

  const {colors} = useTheme();

  return (
    <>
      <View
        style={{
          height: '100%',
          width: '100%',
        }}>
        <MapView
          ref={mapRef}
          showsUserLocation={true}
          style={StyleSheet.absoluteFill}
          // minZoomLevel={10}
          customMapStyle={
            appFeatureState?.theme === 'dark' ? darkMapStyles : []
          }
          mapPadding={{
            top: 50, // Adjust this value to move the My Location button up/down
          }}
          showsMyLocationButton={true}
          // onRegionChange={setInitialRegion}
          showsIndoors={true}
          showsBuildings={true}
          showsCompass={true}
          loadingEnabled={true}
          initialRegion={initialRegion}>
          {trackingLineCoordinates && (
            <MapPolyLineCompnent
              trackingLineCoordinates={trackingLineCoordinates}
            />
          )}
          {trackingLineCoordinates?.length > 1 && (
            <Marker.Animated
              coordinate={markerCoordinate}
              anchor={{x: 0.5, y: 0.5}}
              title="Bus Number"
              ref={marker => {
                setMarker(marker);
              }}
              description={user.busNumber || 'Unavailable'}>
              <Image
                source={require('../assets/BusMarker.png')}
                style={[
                  styles.marker,
                  {width: 0, height: 0},
                  {transform: [{rotate: `${heading}deg`}]},
                ]}
                alt="Your Bus Is Here"
              />
            </Marker.Animated>
          )}
        </MapView>

        {isUpdateAvailable && (
          <AppUpdateComponent
            colors={colors}
            updateDescription={updateDescription}
            updateTitle={updateTitle}
            updateLink={updateLink}
            setNewAppUpdate={setNewAppUpdate}
            hardUpdate={hardUpdate}
          />
        )}
        <View
          // h="full"
          style={{
            borderRadius: 2,
            padding: 2,
            position: 'absolute',
            bottom: 50,
            backgroundColor: colors.darkBlueLightWhite,
          }}>
          <View style={{flexDirection: 'row', padding: 4}}>
            <Text
              variant="titleMedium"
              style={{
                fontWeight: 'bold',
                color: colors.pBlackWhite,
              }}>
              Last Location:{' '}
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontWeight: 'bold',
                color: '#FF0000',
              }}>
              {lastLocationRef || 'Not connected'}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default React.memo(MapComponents);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    resizeMode: 'contain',
    minWidth: 60,
    minHeight: 60,
    transform: [{rotate: '-70deg'}],
  },
});
