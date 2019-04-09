# BioPocket Mobile Application

Hybrid mobile application for the BioPocket project.

[![Dependency Status](https://gemnasium.com/badges/github.com/MediaComem/biopocket-mobile.svg)](https://gemnasium.com/github.com/MediaComem/biopocket-mobile)
[![Build Status](https://travis-ci.org/MediaComem/biopocket-mobile.svg?branch=master)](https://travis-ci.org/MediaComem/biopocket-mobile)
[![Coverage Status](https://coveralls.io/repos/github/MediaComem/biopocket-mobile/badge.svg?branch=master)](https://coveralls.io/github/MediaComem/biopocket-mobile?branch=master)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Requirements](#requirements)
- [Development](#development)
  - [First-time setup](#first-time-setup)
  - [Run the app in your browser](#run-the-app-in-your-browser)
  - [Run the automated tests](#run-the-automated-tests)
  - [Scripts](#scripts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Requirements

* [Node.js](https://nodejs.org) 8.x & [npm](https://www.npmjs.com) 5.x
* [Ionic](https://ionicframework.com) 3.x & [Cordova](https://cordova.apache.org) 7.x

      npm install -g ionic cordova
* [Chrome](https://www.google.com/chrome/) to run the automated tests



## Development

This section describes how to quickly set up your machine to contribute to the project.

Read the [development guide](DEVELOPMENT.md) for a more detailed technical introduction.

### First-time setup

* Clone this repository:

      git clone https://github.com/MediaComem/biopocket-mobile.git

* Install the application's dependencies:

      cd biopocket-mobile
      npm ci

* Create your development environment's configuration file:

      cp src/environments/environment.sample.ts src/environments/environment.dev.ts

  Update the `backendUrl` property to the URL of a running [BioPocket
  Backend](https://github.com/MediaComem/biopocket-backend).

### Run the app in your browser

Run `npm start` (it will open your browser to visit `http://localhost:8100/`).

### Run the automated tests

* `npm run test:unit` to run the unit tests
* `npm run test:e2e` to run the [end-to-end tests][e2e] (this requires additional setup)
* `npm run test` to run all tests (this requires additional setup for the [end-to-end tests][e2e])

You can add `:watch` to each of these to automatically re-run the tests when files change (e.g. `npm run test:unit:watch`).

**Tip:** only use `test:unit:watch` to watch for changes.
Using `test:e2e:watch` (or `test:watch`) is not very reliable because
`ionic serve` and `test:e2e:watch` will both refresh when you make changes,
and sometimes the end-to-end tests will run before `ionic serve` has had time
to refresh the app.

### Scripts

| Script                        | Purpose                                                                                                                   |
| :---                          | :---                                                                                                                      |
| `npm start`                   | Initialize & start the app with `ionic serve`                                                                             |
| `npm run doctoc`              | Generate the table of contents of this README and the DEVELOPMENT guide                                                   |
| `npm run lint`                | Analyze and check the project's TypeScript code for errors                                                                |
| `npm run locales`             | Compile the .yml locale files to TypeScript once                                                                          |
| `npm run locales:start`       | Compile the .yml locale files to TypeScript and watch for changes                                                         |
| `npm run locales:watch`       | Compile the .yml locale files when changes occur                                                                          |
| `npm run start:lab`           | Start the app with the Ionic Lab feature                                                                                  |
| `npm run start:e2e`           | Start the app for [end-to-end testing][e2e]                                                                               |
| `npm run test`                | Run all unit & end-to-end tests once (may fail if `ionic serve` is running; see [end-to-end tests][e2e])                  |
| `npm run test:watch`          | Run all unit & end-to-end tests and watch for changes (may fail if `ionic serve` is running; see [end-to-end tests][e2e]) |
| `npm run test:unit`           | Run unit tests once                                                                                                       |
| `npm run test:unit:watch`     | Run unit tests and watch for changes                                                                                      |
| `npm run test:e2e`            | Run end-to-end tests once (may fail if `ionic serve` is running; see [end-to-end tests][e2e])                             |
| `npm run test:e2e:watch`      | Run end-to-end tests when changes occur (may fail if `ionic serve` is running; see [end-to-end tests][e2e])               |
| `npm run test:e2e:fast`       | Run end-to-end tests once (assumes backend & app are running in test mode; see [end-to-end tests][e2e])                   |
| `npm run test:e2e:fast:watch` | Run end-to-end tests when changes occur (assumes backend & app are running in test mode; see [end-to-end tests][e2e])     |



[e2e]: DEVELOPMENT.md#end-to-end-tests
