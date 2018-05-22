import { Icon, icon as IconFactory, IconOptions } from 'leaflet';

/**
 * The default Icon used by Leaflet.
 * The iconUrl, iconRetinaUrl and shadowUrl have been overwritten so that the images are properly retrieved.
 * 
 * The icon is created with an IIFE that creates an IconDefault instance, updates the required options and return
 * a new Icon with these default updated options.
 * This way, we don't have to manually redefine all options for the default marker.
 */
export const defIcon = (function(): Icon {
  const icon = new Icon.Default();
  icon.options.iconUrl = 'assets/leaflet/marker-icon.png';
  icon.options.iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
  icon.options.shadowUrl = 'assets/leaflet/marker-shadow.png';
  // The icon.options property (which is of type DefaultIconOptions) can be casted as IconOptions since the iconUrl has been defined.
  return IconFactory(icon.options as IconOptions);
})();

export const redIcon = (function(): Icon {
  const icon = new Icon.Default();
  icon.options.iconUrl = 'assets/leaflet/marker-icon-red.png';
  icon.options.iconRetinaUrl = 'assets/leaflet/marker-icon-red.png';
  icon.options.shadowUrl = 'assets/leaflet/marker-shadow.png';
  // The icon.options property (which is of type DefaultIconOptions) can be casted as IconOptions since the iconUrl has been defined.
  return IconFactory(icon.options as IconOptions);
})();
