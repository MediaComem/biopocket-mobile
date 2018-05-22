// Mocha global variables (for Windows)
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';

import { Location } from '../models';

describe('Location Object', function () {
  let locationData;
  let locationObj;
  const locationRequiredKeys = [
    'id', 'name', 'description', 'phone', 'photoUrl', 'siteUrl', 'geometry', 'address', 'properties', 'createdAt', 'updatedAt'
  ];
  const locationOptionalKeys = [ 'shortName' ];
  const geometryRequiredKeys = [ 'type', 'coordinates' ];
  const addressRequiredKeys = [ 'street', 'city', 'zipCode', 'state' ];
  const addressOptionalKeys = [ 'number' ];

  beforeEach(function () {
    locationData = {
      id: 'c821bc0f-85b4-44d5-9bbe-a30cf197c30a',
      name: 'Somewhere over the rainbow',
      description: 'Somewhere over the rainbow blue birds fly and the dreams that you dreamed of really do come true.',
      phone: '5550001',
      photoUrl: 'http://example.com/image.jpg',
      siteUrl: 'http://example.com',
      geometry: {
        type: 'Point',
        coordinates: [ 56, 9 ]
      },
      address: {
        street: 'Riverside Drive',
        zipCode: '10021',
        city: 'New York',
        state: 'New York'
      },
      properties: {},
      createdAt: '2000-01-01T16:30:00.123Z',
      updatedAt: '2000-02-03T17:00:00.123Z'
    };
  });

  it('should only have correct required values', function () {
    locationObj = new Location(locationData);
    compareRequiredValues(locationObj, locationData);

    expect(locationObj.shortName).to.equal(undefined);
    expect(locationObj.address.number).to.equal(undefined);

    expect(locationObj, 'The new Location has more or less keys than expected').to.have.all.keys(locationRequiredKeys);
    expect(locationObj.geometry, 'The new Location\'s geometry property has more or less keys than expected.').to.have.all.keys(geometryRequiredKeys);
    expect(locationObj.address, 'The new Location\'s address property has more or less keys than expected.').to.have.all.keys(addressRequiredKeys);
  });

  it('should have all correct values', function () {
    locationData.shortName = 'Somewhere';
    locationData.address.number = 125;

    locationObj = new Location(locationData);
    compareRequiredValues(locationObj, locationData);

    expect(locationObj.shortName, 'locationObj.shortName').to.equal(locationData.shortName);
    expect(locationObj.address.number, 'locationObj.addresse.number').to.equal(locationData.address.number);

    expect(locationObj, 'The new Location has more or less keys than expected')
      .to.have.all.keys(locationRequiredKeys.concat(locationOptionalKeys));
    expect(locationObj.geometry, 'The new Location\'s geometry property has more or less keys than expected.')
      .to.have.all.keys(geometryRequiredKeys);
    expect(locationObj.address, 'The new Location\'s address property has more or less keys than expected.')
      .to.have.all.keys(addressRequiredKeys.concat(addressOptionalKeys));
  });

  function compareRequiredValues(actual, expected) {
    expect(actual.id, 'location.id').to.equal(expected.id);
    expect(actual.name, 'location.name').to.equal(expected.name);
    expect(actual.description, 'location.description').to.equal(expected.description);
    expect(actual.phone, 'location.phone').to.equal(expected.phone);
    expect(actual.photoUrl, 'location.photoUrl').to.equal(expected.photoUrl);
    expect(actual.siteUrl, 'location.siteUrl').to.equal(expected.siteUrl);

    expect(actual.geometry.type, 'location.geometry.type').to.equal(expected.geometry.type);
    // We swaps coordinates value when creating the Location so that they're in the right order for Leaflet.
    expect(actual.geometry.coordinates[0], 'location.geometry.coordinates[0]').to.equal(expected.geometry.coordinates[0]);
    expect(actual.geometry.coordinates[1], 'location.geometry.coordinates[1]').to.equal(expected.geometry.coordinates[1]);

    expect(actual.address.street, 'location.address.street').to.equal(expected.address.street);
    expect(actual.address.zipCode, 'location.address.zipCode').to.equal(expected.address.zipCode);
    expect(actual.address.city, 'location.address.city').to.equal(expected.address.city);
    expect(actual.address.state, 'location.address.state').to.equal(expected.address.state);

    expect(actual.properties, 'location.properties').to.equal(expected.properties);
    expect(actual.createdAt.toISOString(), 'location.createdAt').to.equal(expected.createdAt);
    expect(actual.updatedAt.toISOString(), 'location.updatedAt').to.equal(expected.updatedAt);
  }
});
