# BioPocket Mobile Application

Hybrid mobile application for the BioPocket project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Requirements](#requirements)
- [Development](#development)
  - [First-time setup](#first-time-setup)
  - [Run the app in your browser](#run-the-app-in-your-browser)
  - [Scripts](#scripts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Requirements

* [Node.js](https://nodejs.org) 8.x
* [Ionic](https://ionicframework.com) 3.x & [Cordova](https://cordova.apache.org) 7.x

      npm install -g ionic cordova
* [Chrome](https://www.google.com/chrome/) to run the automated tests



## Development

How to set up your machine to contribute to the project.

### First-time setup

* Clone this repository:

      git clone https://github.com/MediaComem/biopocket-mobile.git

* Install the application's dependencies:

      cd biopocket-mobile
      npm install

### Run the app in your browser

Run `ionic serve` and visit http://localhost:8100/.

### Scripts

| Script                    | Purpose                                               |
| :---                      | :---                                                  |
| `npm run doctoc`          | Generate the table of contents of this README         |
| `npm run test`            | Run all unit & end-to-end tests once                  |
| `npm run test:watch`      | Run all unit & end-to-end tests and watch for changes |
| `npm run test:unit`       | Run unit tests once                                   |
| `npm run test:unit:watch` | Run unit tests and watch for changes                  |
| `npm run test:e2e`        | Run end-to-end tests once                             |
| `npm run test:e2e:watch`  | Run end-to-end tests and watch for changes            |
