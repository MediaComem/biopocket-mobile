# BioPocket Mobile Application Development Guide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Documentation](#documentation)
- [Environment](#environment)
  - [Implementation](#implementation)
- [Logging things](#logging-things)
- [Including CSS files from external modules](#including-css-files-from-external-modules)
  - [Example : adding the `node_modules/leaflet/dist/leaflet.css` file in the `www/build/leaflet` folder:](#example--adding-the-node_modulesleafletdistleafletcss-file-in-the-wwwbuildleaflet-folder)
- [Internationalization](#internationalization)
  - [Message format interpolation](#message-format-interpolation)
- [End-to-end tests](#end-to-end-tests)
  - [Running the end-to-end tests](#running-the-end-to-end-tests)
    - [Required end-to-end setup](#required-end-to-end-setup)
    - [Letting the tests automatically spawn a backend and mobile application (slower tests)](#letting-the-tests-automatically-spawn-a-backend-and-mobile-application-slower-tests)
    - [Running a backend and mobile application for testing manually (longer setup)](#running-a-backend-and-mobile-applications-for-testing-manually-longer-setup)
  - [Writing end-to-end tests](#writing-end-to-end-tests)
    - [Using page objects](#using-page-objects)
    - [Watching for changes](#watching-for-changes)
    - [Errors in the Travis environment](#errors-in-the-travis-environment)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Documentation

The application is an [Ionic][ionic] hybrid mobile application.

It was generated with:

* Ionic 3.9.2
* Cordova 7.0.1

Here are the links to the documentation of the main technologies, framework and libraries used in the project:

* [Ionic][ionic-doc]
* [Angular][ng-doc]
* [ngx-leaflet][ngl-doc] - Angular component to display leaflet maps
* [Leaflet][leaflet-doc]
* [Lodash][_doc]
* [Turf][turf-doc] Utilities to manipulate geographical information

And the same for the libraries and frameworks used to test the project:

* [Chai][chai-doc] - Test assertion library
* [Mocha][mocha-doc] - JavaScript test framework
* [Protractor][protractor-doc] - End-to-end test framework for Angular
* [Sinon][sinon-doc] - Test spies, stubs and mocks



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



## Logging things

When in need of logging things in the application, refrain from using the javascript `console` utility.

The project has its own logging utility, called `Print`.
It provides the same API as the `console` utility but only actually log things if the value of `ENV.environment` is in its whitelist.

The whitelist is found in the `./src/utils/print.ts` file, and can be updated there to add more environment :

```ts
// ./src/utils/print.ts
const whitelist: string[] = [
  'development'
];
```
To use the `Print` utility, import it in your file, and call one of its methods :

```ts
import Print from 'path/to/utils/print';

Print.log('Hello World');
Print.debug('Foo');
Print.info('Bar');
Print.debug(Print);
Print.error('Ooops');
```



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

> This feature is documented in the Ionic Documentation : https://ionicframework.com/docs/developer-resources/app-scripts/

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

**When the needed files are copied in the `www` directory, they can be referenced in the `index.html` or in a component.**



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



## End-to-end tests

End-to-end tests are automated tests that run the application in a browser and simulate user
interaction by actually driving the browser like a user would. The user interaction
functionality is provided with [Protractor][protractor], while the tests are standard
[Mocha][mocha-doc] tests like the other tests in the project.

These tests are the `*.spec.ts` files located in the `e2e` directory.

### Running the end-to-end tests

It's important to note that unlike unit tests, **end-to-end tests execute on the running
application**. In other words, they require both the backend and mobile application to be running
(the latter in the browser) in order to work.

The following instructions describe how to run the end-to-end tests with a backend and mobile
application running in test mode.

Note that the end-to-end tests wipe the backend's database clean before each test. To have a proper
test environment with a separate backend running on a separate database than your development
database, **you must stop the `ionic serve` (or `npm start`) command used for development** if you
have it running. The `ionic serve` command is not designed to be run twice in the same directory,
and the one you run for development is running in the wrong environment and using the wrong
configuration for testing (e.g.  the wrong backend URL).

#### Required end-to-end setup

Follow these instructions to set up the project for end-to-end testing:

* You must have a `src/environments/environment.test.ts` file with its `backendUrl` property set.
  This will be the backend that the mobile application will communicate with when running in test
  mode. (If you had previously created this file with a fake sample URL, replace it with the correct
  one.)
* You must have a `config/e2e.config.ts` file with its `backendDatabaseUrl` set. This will be the
  database into which data will be inserted before each test.

  **Beware** not to use the same database as your development database, as it will be wiped clean
  before each test.

The rest of the setup depends on how you run the backend and mobile application in test mode. Two
ways are described below.

#### Letting the tests automatically spawn a backend and mobile application (slower tests)

**TLDR:** stop your development `ionic serve` command (if running) and run `npm run test:e2e`. It
takes a while to start (at least 15 seconds) but is the easiest way to run the end-to-end tests
once.

The project's `e2e/utils.ts` file contains utilities to automatically spawn a backend and mobile
application preconfigured for testing. The following additional **setup steps** are required:

* You must retrieve the `backend` git submodule by running the following command the first time:

  ```bash
  git submodule update --init --recursive
  ```

  Or the following command if someone else has changed the backend version and you need to update
  it:

  ```bash
  git submodule update --recursive
  ```
* You must install the backend's dependencies by running `npm install` in the `backend` directory.

To run the end-to-end tests, stop any running `ionic serve` command if you have it running for
development, then run:

```bash
$> npm run test:e2e
```

Note the following **caveat**: if you have a development backend already running, you may leave it
running, but then the `backendUrl` configured in your `src/environments/environment.test.ts` file
must use a different port number than the one defined in your `src/environments/environment.dev.ts`
file. Otherwise, the test utilities will be unable to start a standalone backend process on the
same, already occupied port number.

The backend and mobile application spawned for testing will be stopped automatically once the tests
are done running.

If the backend or mobile application do not seem to start successfully, set the `$IONIC_E2E_DEBUG`
environment to `1` when running the tests to have the standard output and error streams of the
subprocesses printed to the console:

```bash
$> IONIC_E2E_DEBUG=1 npm run test:e2e
```

If the backend or mobile application take more than 30 seconds to start on your machine, increase
the timeout with the `$IONIC_E2E_STANDALONE_TIMEOUT` environment variable (set it to a number of
milliseconds) or with the `standaloneTimeout` property in the `config/e2e.config.ts` file:

```bash
$> IONIC_E2E_STANDALONE_TIMEOUT=90000 npm run test:e2e
```

#### Running a backend and mobile application for testing manually (longer setup)

**TLDR:** run a backend in test mode, run the mobile application in test mode, and run `npm run
test:e2e:fast` or `npm run test:e2e:fast:watch` to run the tests. This is a bit longer to set up
each time but once it's running, the end-to-end tests will run much faster (as they don't have to
spawn processes each time). It's the way to go if you want to work on the end-to-end tests for a
while.

The tests can be notified that a backend and/or mobile application are already running in test
mode, so that they don't attempt to automatically spawn new ones, by setting the following
environment variables:

* `IONIC_E2E_STANDALONE_BACKEND=0` tells the test utilities not to run a backend.
* `IONIC_E2E_STANDALONE_IONIC=0` tells the test utilities not to run a mobile application.
* `IONIC_E2E_STANDALONE=0` is equivalent to setting both the previous variables.

Running the end-to-end tests with the `npm run test:e2e:fast` script automatically sets
`IONIC_E2E_STANDALONE` to `0`. You may also use `npm run test:e2e:fast:watch` to keep running the
tests automatically as you make changes.

When running the tests this way, it is **your responsibility** to have the backend and mobile
application running in test mode **before you execute the tests**:

* You may **run the backend in test mode** by running the `npm run start:e2e` script in the
  backend's project directory. (You may use the `backend` directory in this project if you follow
  the setup instructions of the previous method, or you may use the same repository you use for
  development.)

  Make sure that your backend's configuration connects it to a different database in the test
  environment than in the development environment, as the database will be wiped clean before each
  test.

  Also make sure that the `backendUrl` property in your `src/environments/environment.test.ts` file
  corresponds to the URL at which your backend is available.
* You may **run the mobile application in test mode** by running the `npm run start:e2e` script in
  this project's directory.

  It also runs on `http://localhost:8100`, so you must stop the `ionic serve` command you use for
  development if you have it running. Do not attempt to run both commands at the same time, as the
  `ionic serve` command was not designed for it.

Once you have both the backend and mobile application running, use the following command to run the
end-to-end tests:

```bash
$> npm run test:e2e:fast
```

You may also run the following command to automatically re-run the tests every time the code or the
tests change:

```bash
$> npm run test:e2e:fast:watch
```

Note the following **caveat**: when running the end-to-end tests in watch mode, there is no problem
when modifying the tests, but there can be a timing issue when you modify the application: the tests
may start running before `ionic serve` has had a chance to re-compile and serve the new version.

### Writing end-to-end tests

A few pointers on how to work with end-to-end tests in this project.

#### Using page objects

* [Page Objects][po]
* [Page Object Best Practices][po-best-practices]

Page object implementations are found in the `e2e/po` directory. They represent the various pages of
the application, and provide methods that can retrieve information from the page, or simulate the
interactions that a user can have with it.

Most of the [Protractor][protractor]-specific code referencing elements of the page should be in
these page objects. This centralizes references to HTML IDs and classes in the page objects to
facilitate refactoring of the tests when the page structure changes.

Note that many Protractor methods are asynchronous and return promises, so make judicious use of
`async/await` to simplify the tests:

```ts
it('should work', async function() {
  const page = new MyPageObject();
  await page.navigateTo();
  await expect(page.getTitle()).to.eventually.equal('BioPocket');
  // Test other stuff...
});
```

In this example, both `page.navigateTo()` and `page.getTitle()` returns a promise, so we use the
following patterns:

* Declare the test function as `async` so that we can use `await` to wait for each assertion.
* Use [chai-as-promised][chai-as-promised]'s `.eventually` chain utility to have the `equal`
  assertion wait a while (e.g. it might have to wait for some AJAX requests or Angular processing to
  complete).
* Do not forget to use `await` on the assertion (which itself returns a promise) so that the test
  function waits for it to be checked before moving on to further assertions.

#### Watching for changes

Be careful when using `npm run test:e2e:watch` or `npm run test:e2e:fast:watch` and making changes
to the application. When a change occurs, both Ionic and the end-to-end tests will react, the former
to reload the app and the latter to re-run the tests. There is no guarantee that the app will be
reloaded when the tests start executing: they may execute on the previous version, so results may
not be reliable the first time after making a change on the app.

The problem will not occur if you only modify the end-to-end test files, as the application is not
reloaded in this case, only the tests.

#### Errors in the Travis environment

End-to-end tests are also run on the Travis continuous integration platform.

Note that the servers running the Travis environment are typically not as fast as your local
development machine. Badly written asynchronous assertions may pass locally because everything is
fast, and fail on Travis because page loads and AJAX calls are slower there.

Do not forget to:

* Use `await` on asynchronous assertions (e.g. `await expect(a).to.eventually.equal(b)`). Without
  the `await` keyword, the test will proceed immediately to the next assertion. Sometimes this works
  locally because things load faster, but it may fail on Travis.
* Wait for asynchronous HTTP calls to complete. You cannot explicitly do this with Protractor, but
  you can, for example, make an assertion on the presence of an HTML element that will only appear
  once an HTTP call is done. If you forget to do this, it may work locally because HTTP calls are
  very fast, but may fail on Travis.



## TODO

* Remove fixed dependency on `postcss` when Ionic issue has been fixed.

  Updating `@ionic/app-scripts` to 3.1.8 caused the following warning to be displayed when starting the app:

  ```
  [17:10:06]  sass started ...
  Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.
  [17:10:07]  sass finished in 819 ms
  ```

  This has been temporarily fixed by adding a fixed dependency to `postcss` version 6.0.14
  (`@ionic/app-scripts` is currently incompatible with the latest version of this dependency).

  See https://github.com/ionic-team/ionic/issues/13763

  The new dependency should be removed with `npm uninstall postcss` once the issue has been fixed by the Ionic team.

* Remove calls to `detectChanges()` when the issue from `ngx-leaflet` has been fixed or a workaround has been deployed.

  Updating `ngx-leaflet` to a version higher than 2.5.x caused an issue when updating markers visible on the map.
  Previously, the library automatically notified Angular when changes where happening inside a Leaflet event (such as `onMapMoved()`).
  With 2.6.x and onward, the decision has been made (although the author is still not sure about it) to remove this automatic update.

  Thus, when updating a component's property from inside a leaflet event, Angular does not detect those changes and does not update itself accordingly.
  To solve this issue, one has to manually tell angular when changes are made.

  This can be done by importing the `ChangeDetectorRef` angular component from `@angular/core` and using its `detectChanges()` method the desired changes.

  For more information, see https://github.com/Asymmetrik/ngx-leaflet/issues/123 and https://github.com/Asymmetrik/ngx-leaflet#a-note-about-change-detection



[_doc]: https://lodash.com/docs/4.17.4
[chai-as-promised]: https://github.com/domenic/chai-as-promised
[chai-doc]: http://chaijs.com/api/
[ionic]: https://ionicframework.com
[ionic-doc]: https://ionicframework.com/docs/
[ionic-env-vars]: https://github.com/gshigeto/ionic-environment-variables
[leaflet-doc]: http://leafletjs.com/reference-1.3.0.html
[messageformat]: https://messageformat.github.io
[messageformat-guide]: https://messageformat.github.io/guide/
[mocha-doc]: https://mochajs.org
[moment]: https://momentjs.com
[ngx-translate]: http://www.ngx-translate.com
[ng-doc]: https://angular.io/docs
[ngl-doc]: https://github.com/Asymmetrik/ngx-leaflet
[po]: https://github.com/SeleniumHQ/selenium/wiki/PageObjects
[po-best-practices]: https://martinfowler.com/bliki/PageObject.html
[protractor]: https://www.protractortest.org/
[protractor-doc]: https://www.protractortest.org/#/api
[sinon-doc]: http://sinonjs.org/releases/v4.2.1/
[turf-doc]: http://turfjs.org/docs/
[webpack-resolve]: https://webpack.js.org/configuration/resolve/
[yaml]: http://yaml.org
