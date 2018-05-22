import { distance, point } from '@turf/turf';

// DO NOT MOVE these lines.
// Environment variables MUST be set BEFORE backend files are imported.
import { setUp } from './setup';
setUp();

import * as locationFixtures from '../backend/server/spec/fixtures/location';
import { expect } from '../spec/chai';
import { MapPageObject } from './po/map.po';
import { compareCoordinates } from './utils';

const ONEX_BBOX = {
  southWest: [ 6.086417, 46.173987 ],
  northEast: [ 6.112753, 46.196898 ],
  padding: []
};

// Add a 10% padding to latitude & longitude (to make sure markers are displayed well within the screen area).
ONEX_BBOX.padding.push((ONEX_BBOX.northEast[1] - ONEX_BBOX.southWest[1]) / 10);
ONEX_BBOX.padding.push((ONEX_BBOX.northEast[0] - ONEX_BBOX.southWest[0]) / 10);

// Compute bounding box width & height in kilometers.
const ONEX_BBOX_WIDTH = distance(point(ONEX_BBOX.southWest), point([ ONEX_BBOX.northEast[0], ONEX_BBOX.southWest[1] ]));
const ONEX_BBOX_HEIGHT = distance(point(ONEX_BBOX.southWest), point([ ONEX_BBOX.southWest[0], ONEX_BBOX.northEast[1] ]));

describe('App', function() {

  let locations;
  let mapPage: MapPageObject;

  beforeEach(async function() {
    mapPage = new MapPageObject();

    // Insert 3 random locations into the database and sort them by ascending longitude and latitude.
    locations = await Promise.all(new Array(3).fill(0).map(() => locationFixtures.location({ bbox: ONEX_BBOX })));
    locations.sort((a, b) => compareCoordinates(a.get('geometry'), b.get('geometry')));

    // Set a window size with the same width/height ratio as the Onex bounding box.
    const windowWidth = 1440;
    const windowHeight = windowWidth / (ONEX_BBOX_WIDTH / ONEX_BBOX_HEIGHT);
    await mapPage.setWindowSize(windowWidth, windowHeight);
  });

  it('should allow a user to view locations on the map', async function() {
    this.timeout(10000);

    // Navigate to the map page.
    await mapPage.navigateTo();
    await expect(mapPage.getTitle()).to.eventually.equal('BioPocket');

    // Ensure that all markers are displayed.
    const markerIconFinders = await mapPage.getMarkerIcons();
    expect(markerIconFinders).to.have.lengthOf(3);

    // Click on the first marker (they are also sorted by ascending longitude and latitude).
    markerIconFinders[0].click();

    // Ensure that the popover is displayed.
    const popoverFinder = mapPage.getPopover();
    await expect(popoverFinder.isPresent()).to.eventually.equal(true);

    // Ensure that the data of the correct location is displayed in the popover.
    // Since both the location fixtures and marker icons have been sorted by ascending longitude and
    // latitude, the first location should correspond to the first marker icon.
    const location = locations[0];
    const locationDetailsText = await mapPage.getLocationDetails().getText();
    expect(locationDetailsText).to.have.string(location.get('name'));
    expect(locationDetailsText).to.have.string(location.get('short_name'));
  });
});
