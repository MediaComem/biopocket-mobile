import { icon as IconFactory, Icon, IconOptions } from 'leaflet';

/**
 * The default Icon used by Leaflet.
 * The iconUrl, iconRetinaUrl and shadowUrl have been overwritten so that the images are properly retrieved.
 * 
 * The icon is created with an IIFE that creates an IconDefault instance, updates the required options and return
 * a new Icon with these default updated options.
 * This way, we don't have to manually redefine all options for the default marker.
 */
export const defIcon: Icon = function (): Icon {
  const defIcon: Icon.Default = new Icon.Default;
  defIcon.options.iconUrl = 'assets/leaflet/marker-icon.png';
  defIcon.options.iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
  defIcon.options.shadowUrl = 'assets/leaflet/marker-shadow.png';
  // The defIcon.options property (which is of type DefaultIconOptions) can be casted as IconOptions since the iconUrl has been defined.
  return IconFactory(<IconOptions>defIcon.options);
}();

export const redIcon: Icon = function(): Icon {
  const defIcon: Icon.Default = new Icon.Default;
  defIcon.options.iconUrl = 'assets/leaflet/marker-icon-red.png';
  defIcon.options.iconRetinaUrl = 'assets/leaflet/marker-icon-red.png';
  defIcon.options.shadowUrl = 'assets/leaflet/marker-shadow.png';
  // The defIcon.options property (which is of type DefaultIconOptions) can be casted as IconOptions since the iconUrl has been defined.
  return IconFactory(<IconOptions>defIcon.options);
}();