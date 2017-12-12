import { MarkerOptions, LatLngExpression, Marker } from 'leaflet';

interface BaseMarkerData {
}

export default class BaseMarker extends Marker {

  constructor(public id: string, coordinates: LatLngExpression, options: MarkerOptions, public data?: BaseMarkerData) {
    super(coordinates, options);
  }

}
