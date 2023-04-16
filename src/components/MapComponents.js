import { StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapPolyLineCompnent from './MapPolyLineCompnent';
// import {Image} from 'native-base';

const MapComponents = ({ trackingLineCoordinates, mapRef }) => {
  // console.log({trackingLineCoordinates});

  const [marker, setMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 22.719459654294255,
    longitude: 75.857048307291,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerSize, setMarkerSize] = useState({ width: 0, height: 0 });

  const handleLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    const markerSize = Math.min(width, height) * 0.9;
    setMarkerSize({ width: markerSize, height: markerSize });
  };

  const [heading, setHeading] = useState('0');
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 22.719459654294255,
    longitude: 75.857048307291,
  });


  // useEffect(() => {
  //   console.log({ trackingLineCoordinates });
  //   return () => {

  //   }
  // }, [])

  useEffect(() => {
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
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          4000,
        );
      }
    }

    // Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [trackingLineCoordinates]);

  return (
    <>
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        style={StyleSheet.absoluteFill}
        // minZoomLevel={10}
        showsMyLocationButton={true}
        onRegionChange={setInitialRegion}
        showsCompass={true}
        initialRegion={initialRegion}>
        {trackingLineCoordinates && (
          <MapPolyLineCompnent
            trackingLineCoordinates={trackingLineCoordinates}
          />
        )}
        {trackingLineCoordinates?.length > 1 && (
          <Marker.Animated
            coordinate={markerCoordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            title="Your Bus"
            ref={marker => {
              setMarker(marker);
            }}
            description="Your Bus">
            <Image
              source={require('../assets/BusMarker.png')}
              style={[
                styles.marker,
                markerSize,
                { transform: [{ rotate: `${heading}deg` }] },
              ]}
              alt="Your Bus Is Here"
            />
          </Marker.Animated>
        )}
        {/* )} */}
      </MapView>
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
    transform: [{ rotate: '-70deg' }],
  },
});
