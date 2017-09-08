const BPromise = require('bluebird');
const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob');
const handlebars = require('handlebars');
const path = require('path');
const yaml = require('js-yaml');

BPromise.promisifyAll(fs);

const rootDir = path.resolve(path.join(__dirname, '..'));
const localesDir = path.join(rootDir, 'src', 'locales');
const generatedLocalesDir = path.join(localesDir, 'generated');
const localeTemplatePath = path.join(__dirname, 'typescript-locale.hbs');

generateTypeScriptLocaleFiles().catch(err => console.warn(err));

/**
 * Reads all .yml files in the `src/locales` directory, injects them in the
 * `lib/typescript-locale.hbs` Handlebars template and saves the result to
 * the equivalent .ts filename in the `src/locales/generated` directory.
 *
 * For example, `src/locales/fr.yml` becomes `src/locales/generated/fr.ts`.
 *
 * The generated file contains the translations as a TypeScript object.
 *
 * This mechanism also generates nested TypeScript interfaces that represent
 * the structure of the translations so that the object is correctly typed.
 */
async function generateTypeScriptLocaleFiles() {

  const [ templateFunc, localeFilenames ] = await BPromise.all([
    compileLocaleTemplate(),
    findLocaleFiles(),
    ensureGeneratedLocalesDirectory()
  ]);

  // Generate all translation files in parallel
  await BPromise.all(localeFilenames.map(async localeFilename => {

    const localeFile = path.join(localesDir, localeFilename);
    const typeScriptLocaleFile = path.join(generatedLocalesDir, localeFilename.replace(/\.[^\.]+$/, '.ts'));

    // Read both the original file and the generated file (if it exists)
    const [ locale, typeScriptLocale ] = await BPromise.all([
      readLocaleFile(localeFile),
      readTypeScriptLocaleFile(typeScriptLocaleFile)
    ]);

    const translations = yaml.safeLoad(locale);
    const translationsJson = JSON.stringify(translations, undefined, 2).trim();

    // Generate the contents of the TypeScript file
    const newTypeScriptLocale = templateFunc({
      source: path.relative(rootDir, localeFile),
      translations: translationsJson,
      types: generateAllTranslationInterfaces(translations).join('\n\n')
    });

    // If the contents have changed, save the file
    // (otherwise do nothing to skip a page refresh by Ionic)
    if (typeScriptLocale && typeScriptLocale == newTypeScriptLocale) {
      console.log(`${chalk.green(path.relative(rootDir, typeScriptLocaleFile))} has not changed`);
    } else {
      return fs.writeFileAsync(typeScriptLocaleFile, newTypeScriptLocale, { encoding: 'utf8' }).then(() => {
        console.log(`${chalk.yellow(path.relative(rootDir, localeFile))} -> ${chalk.green(path.relative(rootDir, typeScriptLocaleFile))}`);
      });
    }
  }));
}

function compileLocaleTemplate() {
  return fs.readFileAsync(localeTemplatePath, { encoding: 'utf8' }).then(contents => handlebars.compile(contents));
}

function findLocaleFiles() {
  return BPromise.promisify(glob)('**/*.yml', { cwd: localesDir });
}

function ensureGeneratedLocalesDirectory() {
  return fs.mkdirsAsync(generatedLocalesDir);
}

function readLocaleFile(file) {
  return fs.readFileAsync(file, { encoding: 'utf8' });
}

function readTypeScriptLocaleFile(file) {
  return fs.readFileAsync(file, { encoding: 'utf8' }).catch(err => {

    // Ignore the error if it indicates that the file doesn't exist
    // (it just means that the compiled translation file is being generated
    // for the first time on this machine)
    if (err.code == 'ENOENT') {
      return;
    }

    throw err;
  });
}

/**
 * Recursively generate definitions for TypeScript interfaces that reflect the structure
 * of a nested translations object. Returns an array of these definitions.
 *
 *     const translations = {
 *       app: 'My App',
 *       pages: {
 *         home: {
 *           title: 'Home',
 *           welcome: 'Welcome'
 *         }
 *       }
 *     };
 *
 *     const interfaces = generateAllTranslationInterfaces(translations);
 *
 *     console.log(interfaces.join('\n\n'));
 *     // interface Translations {
 *     //   app: string;
 *     //   pages: PagesTranslations;
 *     // }
 *     //
 *     // interface PagesTranslations {
 *     //   home: PagesHomeTranslations;
 *     // }
 *     //
 *     // interface PagesHomeTranslations {
 *     //   title: string;
 *     //   welcome: string;
 *     // }
 */
function generateAllTranslationInterfaces(translations, translationPath = [], types = []) {

  // Generate the interface for the current path
  types.push(generateTranslationsInterface(translations, translationPath));

  // Recursively generate the interfaces for all translations sub-objects
  for (let property in translations) {
    const value = translations[property];
    if (typeof(value) != 'string') {
      generateAllTranslationInterfaces(value, [ ...translationPath, property ], types);
    }
  }

  return types;
}

/**
 * Generates the definition of a TypeScript interface for the specified translations object
 * at the specified path in the translations file.
 *
 *     let translations = {
 *       title: 'Home',
 *       welcome: 'Welcome'
 *     };
 *
 *     let path = [ 'pages', 'home' ];
 *
 *     let interface = generateTranslationsInterface(translations, path);
 *
 *     console.log(interface);
 *     // interface PagesHomeTranslations {
 *     //   title: string;
 *     //   welcome: string;
 *     // }
 *
 *     translations = {
 *       home: {
 *         title: 'Home',
 *         welcome: 'Welcome'
 *       }
 *     };
 *
 *     path = [ 'pages' ];
 *
 *     interface = generateTranslationsInterface(translations, path);
 *
 *     console.log(interface);
 *     // interface PagesTranslations {
 *     //   home: PagesHomeTranslations;
 *     // }
 *
 *     translations = {
 *       app: 'My App',
 *       pages: {
 *         home: {
 *           title: 'Home',
 *           welcome: 'Welcome'
 *         }
 *       }
 *     };
 *
 *     path = [];
 *
 *     interface = generateTranslationsInterface(translations, path);
 *
 *     console.log(interface);
 *     // interface Translations {
 *     //   app: string;
 *     //   pages: PagesTranslations;
 *     // }
 */
function generateTranslationsInterface(translationsObject, translationPath = []) {

  let type = `interface ${translationPathToInterfaceName(translationPath)} {`;

  // Define an interface property for each property/value pair in the translations object
  for (let property in translationsObject) {

    const value = translationsObject[property];

    // Define the type of the property:
    //
    // * If the value is a string, the type is "string"
    // * If the value is an object, the type is the interface name for the translations object at that path
    const propertyType = typeof(value) == 'string' ? 'string' : translationPathToInterfaceName([ ...translationPath, property ]);

    type = `${type}\n  ${property}: ${propertyType};`;
  }

  return `${type}\n}`;
}

/**
 * Generates a TypeScript interface name for a translations object at the specified path.
 *
 *     translationPathToInterfaceName([])                    // => "Translations"
 *     translationPathToInterfaceName([ 'foo', 'barBaz' ])   // => "FooBarBazTranslations"
 */
function translationPathToInterfaceName(translationPath) {
  return translationPath.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('') + 'Translations';
}
