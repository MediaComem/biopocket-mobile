import * as L from 'leaflet';
import * as turf from '@turf/turf';

/**
 * Converts a turf point (or GeoJSON point feature) into a Leaflet LatLng object.
 */
export function turfPointToLeafletLatLng(pointOrFeature: turf.Point | turf.Feature<turf.Point>): L.LatLng {
  if (pointOrFeature.type == 'Feature') {
    return turfPointToLeafletLatLng(pointOrFeature.geometry);
  } else {
    return L.latLng(pointOrFeature.coordinates[1], pointOrFeature.coordinates[0]);
  }
}
