import { LatLngExpression, Marker as LeafletMarker, MarkerOptions } from 'leaflet';

export class Marker extends LeafletMarker {

  constructor(public id: string, coordinates: LatLngExpression, options: MarkerOptions, public data?: {}) {
    super(coordinates, options);
  }

}
