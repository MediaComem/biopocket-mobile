import { Component, Input } from '@angular/core';

/**
 * Component that displays the user's profile picture inside the double border, as defined in the mockup.
 * * To display a particular picture, pass a value to the `src` attribute.
 *   This attribute is the same as an img tag `src` attribute.
 * * Not providing any value (or a falsy one) will result in the default picture being displayed.
 */
@Component({
  selector: 'bip-profile-picture',
  templateUrl: 'bip-profile-picture.html'
})
export class BipProfilePictureComponent {

  @Input() src: string;

}
