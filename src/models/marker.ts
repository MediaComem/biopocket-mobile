import { MarkerOptions, LatLngExpression, Marker as LeafletMarker} from 'leaflet';

interface MarkerData {
}

export default class Marker extends LeafletMarker {

  constructor(public id: string, coordinates: LatLngExpression, options: MarkerOptions, public data?: MarkerData) {
    super(coordinates, options);
  }

}
