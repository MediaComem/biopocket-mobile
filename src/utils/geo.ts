import * as turf from '@turf/turf';
import * as L from 'leaflet';

/**
 * Based on cordova geolocatin plugin documentation
 * @see https://github.com/apache/cordova-plugin-geolocation#constants
 */
export const PositionErrorCodes = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
};

/**
 * Converts a turf point (or GeoJSON point feature) into a Leaflet LatLng object.
 */
export function turfPointToLeafletLatLng(pointOrFeature: turf.Point | turf.Feature<turf.Point>): L.LatLng {
  if (pointOrFeature.type === 'Feature') {
    return turfPointToLeafletLatLng(pointOrFeature.geometry);
  }

  return L.latLng(pointOrFeature.coordinates[1], pointOrFeature.coordinates[0]);
}
