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
  const locationOptionalKeys = ['shortName'];
  const geometryRequiredKeys = ['type', 'coordinates'];
  const addressRequiredKeys = ['street', 'city', 'zipCode', 'state'];
  const addressOptionalKeys = ['number'];

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
        coordinates: [56, 9]
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
    }
  });

  it('should only have correct required values', function () {
    locationObj = new Location(locationData);
    compareRequiredValues(locationObj, locationData);

    expect(locationObj.shortName).to.be.undefined;
    expect(locationObj.address.number).to.be.undefined;

    expect(locationObj, 'The new Location has more or less keys than expected').to.have.all.keys(locationRequiredKeys);
    expect(locationObj.geometry, 'The new Location\'s geometry property has more or less keys than expected.').to.have.all.keys(geometryRequiredKeys);
    expect(locationObj.address, 'The new Location\'s address property has more or less keys than expected.').to.have.all.keys(addressRequiredKeys);
  });

  it('should have all correct values', function () {
    locationData.shortName = "Somewhere";
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

  function compareRequiredValues(locationObj, locationData) {
    expect(locationObj.id, 'locationObj.id').to.equal(locationData.id);
    expect(locationObj.name, 'locationObj.name').to.equal(locationData.name);
    expect(locationObj.description, 'locationObj.description').to.equal(locationData.description);
    expect(locationObj.phone, 'locationObj.phone').to.equal(locationData.phone);
    expect(locationObj.photoUrl, 'locationObj.photoUrl').to.equal(locationData.photoUrl);
    expect(locationObj.siteUrl, 'locationObj.siteUrl').to.equal(locationData.siteUrl);

    expect(locationObj.geometry.type, 'locationObj.geometry.type').to.equal(locationData.geometry.type);
    // We swaps coordinates value when creating the Location so that they're in the right order for Leaflet.
    expect(locationObj.geometry.coordinates[0], 'locationObj.geometry.coordinates[0]').to.equal(locationData.geometry.coordinates[0]);
    expect(locationObj.geometry.coordinates[1], 'locationObj.geometry.coordinates[1]').to.equal(locationData.geometry.coordinates[1]);

    expect(locationObj.address.street, 'locationObj.address.street').to.equal(locationData.address.street);
    expect(locationObj.address.zipCode, 'locationObj.address.zipCode').to.equal(locationData.address.zipCode);
    expect(locationObj.address.city, 'locationObj.address.city').to.equal(locationData.address.city);
    expect(locationObj.address.state, 'locationObj.address.state').to.equal(locationData.address.state);
    
    expect(locationObj.properties, 'locationObj.properties').to.equal(locationData.properties);
    expect(locationObj.createdAt.toISOString(), 'locationObj.createdAt').to.equal(locationData.createdAt);
    expect(locationObj.updatedAt.toISOString(), 'locationObj.updatedAt').to.equal(locationData.updatedAt);
  }
});
