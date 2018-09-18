import { Directive, Input } from '@angular/core';

/**
 * Directive that handles broken <img> sources.
 * To apply this to an <img>, you need to add it a `default` attribute with a source to a default image.
 * This will be applied if the `src` attribute errors.
 *
 * @author Subhan Naeem
 * @see https://medium.com/@sub.metu/angular-fallback-for-broken-images-5cd05c470f08
 */
@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    // '(load)': 'load()',
    '[src]': 'src'
  }
})
export class ImageHandlerDirective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
  }

  // load() {
  //   console.log('image loaded');
  // }
}