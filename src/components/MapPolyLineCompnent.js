import React from 'react';
import {Polyline} from 'react-native-maps';

const MapPolyLineCompnent = ({trackingLineCoordinates}) => {
  return (
    <>
      {trackingLineCoordinates && trackingLineCoordinates.length > 1 ? (
        <>
          <Polyline
            coordinates={trackingLineCoordinates}
            strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={8}
          />

          {/* <Polyline
            coordinates={trackingLineCoordinates}
            strokeColor="rgba(0, 255, 0, 0.3)" // fallback for when `strokeColors` is not supported by the map-provider
            // fillColor=""
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={6}
          /> */}
        </>
      ) : null}
    </>
  );
};

export default React.memo(MapPolyLineCompnent);

 
