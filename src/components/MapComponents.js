import {StyleSheet, Image} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import MapPolyLineCompnent from './MapPolyLineCompnent';
import {Text, View} from 'native-base';
// import {Image} from 'native-base';

const MapComponents = ({trackingLineCoordinates, mapRef, user}) => {
  // console.log({trackingLineCoordinates});

  const [marker, setMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 22.719459654294255,
    longitude: 75.857048307291,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [lastLocationRef, setLastLocationRef] = useState('');
  const [markerSize, setMarkerSize] = useState({width: 0, height: 0});

  const handleLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    const markerSize = Math.min(width, height) * 0.9;
    setMarkerSize({width: markerSize, height: markerSize});
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

      if (getLastPosition?.createdAt) {
        const date = new Date(getLastPosition?.createdAt).toLocaleTimeString();
        setLastLocationRef(date || 'Not connected');
      }
    }

    // Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [trackingLineCoordinates]);

  return (
    <>
      <View w="full" h="full">
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
                  markerSize,
                  {transform: [{rotate: `${heading}deg`}]},
                ]}
                alt="Your Bus Is Here"
              />
            </Marker.Animated>
          )}
        </MapView>

        <View
          p="3"
          position={'absolute'}
          bottom="20"
          borderRadius={'2'}
          // h="full"
          style={{
            // backgroundColor: 'blue',
            backgroundColor: 'rgba(205,205,205, 0.5)',
          }}>
          <View flexDirection={'row'}>
            <Text fontSize={'md'} fontWeight="bold" color="black">
              Last Location:{' '}
            </Text>
            <Text fontSize={'md'} fontWeight="extrabold" color="red.500">
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
