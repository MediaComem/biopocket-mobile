# BioPocket Mobile Application Development Guide

<!-- START doctoc -->
<!-- END doctoc -->



## Application

The application is an [Ionic][ionic] hybrid mobile application.

It was generated with:

* Ionic 3.9.2
* Cordova 7.0.1



## Environment

Files can be placed in the `src/environments` directory to define
environment-specific configuration:

| File                                  | Environment                                                   |
| :---                                  | :---                                                          |
| `src/environments/environment.dev.ts` | Development environment (when running `ionic serve` normally) |
| `src/environments/environment.ts`     | Production environment (when running `ionic build --prod`)    |

The file for the current environment can be imported like this:

```ts
import { ENV } from '@app/env';
```

### Implementation

The `@app/env` module is a [module resolution alias][webpack-resolve] defined by
augmenting Ionic's default webpack configuration in the following files:

* `config/optimization.config.js`
* `config/webpack.config.js`

This configuration is applied by the `config.ionic_optimization` and
`config.ionic_webpack` properties of `package.json`.

For TypeScript to correctly identify the `@app/env` module, the path to the
environment files has been added to the `compilerOptions.paths` property of the
`tsconfig.json` file at the root of the project.

This mechanism is based on [Easy to use environment variables for Ionic3!][ionic-env-vars].

## Including CSS files from external modules

When installing external libraries or modules, it could happen that those lib/modules requires a special stylesheet that it provides.

It is *not possible* to include such a file in a `.scss` file with an `@import` statement like this:

```sass
// ./src/app/app.scss
@import 'node_modules/leaflet/dist/leaflet.css'
```
> This results in a `404` on the file at runtime

When Ionic builds the application, with `ionic cordova build {platform}` or `ionis serve`, it executes a `copy` script that copies some ionic's core files from the `node_module` to the `www` or `build` directory.

The `config/copy.config.js` file can be modified to add new files to copy during this step.

To do so, add a new property to the exported object, named as you see fit, that has two properties :
* `src`: an array of paths of directory or files to copy
* `dest`: the path of the destination folder in which all files listed in `src` will be copied

Specific wildcards can be used in the above mentionned path :
* `{{SRC}}` refers to the `./src` folder
* `{{ROOT}}` refers to the root folder
* `{{BUILD}}` refers to the `www/build` folder
* `{{WWW}}` refers to the `www` folder

### Example : adding the `node_modules/leaflet/dist/leaflet.css` file in the `www/build/leaflet` folder:

```javascript
// ./config/copy.config.js file
module.exports = {
  // previous properties
  copyLeaflet: {
    src: ['{{ROOT}}/node_modules/leaflet/dist/leaflet.css'],
    dest: '{{BUILD}}/leaflet/'
  }
};
```
> For the file to be actually copied, you need to restart the server (or rebuild the app)

**When the needed files are copied on the `www` directory, then can be referenced in the `index.html` or on a component.**


## Internationalization

The application is internationalized with [ngx-translate][ngx-translate] for
text in general, while dates are handled by [moment][moment].

Translations are defined in [`.yml`][yaml] files in the `src/locales` directory:

```yml
app: "BioPocket"
pages:
  home:
    title: "Accueil"
```

Each translation can be identified by its dot-separated path in the translation
file. For example, `pages.home.title` corresponds to `Accueil` in the example
above.

Translations can be displayed in a template with the `translate` pipe:

```html
<h1>{{ 'app' | translate }}</h1>
```

Or retrieved in code with `TranslateService`:

```ts
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

class HomePageComponent {
  constructor(private translateService: TranslateService) {
  }

  getTitle(): Observable<string> {
    return this.translateService.get('pages.home.title');
  }
}
```

The `get` method always returns an observable since it is possible to load
translations asynchronously through HTTP or another mechanism.

If you require a synchronous translation, use `instant`. In that case, it's your
responsibility to make sure that the translations are available at the time of
the call:

```ts
const translation: string = this.translateService.instant('pages.home.title');
```

Translations are loaded synchronously in `app.component.ts` for now, but that
could change in the future when we add multiple languages, so `get` is preferred
to `instant`.

### Message format interpolation

Translations follow the [ICU message format][messageformat] and support
pluralization and gender:

```yml
results: >
  {GENDER, select, male{He} female{She} other{They} } found
   {RES, plural, =0{no results} one{1 result} other{# results} } in the
   {CAT, selectordinal, one{#st} two{#nd} few{#rd} other{#th} } category.
```

The message will adapt to the options:

```ts

translateService.get({ GENDER: 'male', RES: 1, CAT: 2 })
// 'He found 1 result in the 2nd category.'

translateService.get({ GENDER: 'female', RES: 1, CAT: 2 })
// 'She found 1 result in the 2nd category.'

translateService.get({ GENDER: 'male', RES: 2, CAT: 1 })
// 'He found 2 results in the 1st category.'

translateService.get({ RES: 2, CAT: 2 })
// 'They found 2 results in the 2nd category.'
```

See the [format guide][messageformat-guide] for more information.



[ionic]: https://ionicframework.com
[ionic-env-vars]: https://github.com/gshigeto/ionic-environment-variables
[messageformat]: https://messageformat.github.io
[messageformat-guide]: https://messageformat.github.io/guide/
[moment]: https://momentjs.com
[ngx-translate]: http://www.ngx-translate.com
[webpack-resolve]: https://webpack.js.org/configuration/resolve/
[yaml]: http://yaml.org
