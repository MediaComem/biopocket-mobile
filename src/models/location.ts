import extend from 'lodash/extend';
import pick from 'lodash/pick';

/**
 * Represents a Location of Interest in the mobile app
 */
export class Location {

  id: string;
  name: string;
  shortName: string;
  description: string;
  phone: string;
  photoUrl: string;
  siteUrl: string;
  geometry: Geometry;
  address: Address;
  properties: object;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Creates a new Location object based on the provided `data` argument.
   * @param {Object} data - An object containing the values for the new Location
   */
  constructor(data: any) {
    extend(this, pick(data, 'id', 'name', 'shortName', 'description', 'phone', 'photoUrl', 'siteUrl'));
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.properties = data.properties || {};
    this.geometry = new Geometry(data.geometry);
    this.address = new Address(data.address);
  }

}

/**
 * Represents a Location's Address
 */
class Address {

  street: string;
  number: string;
  zipCode: string;
  city: string;
  state: string;

  /**
   * Creates a new Address
   * @param {Object} data - An object containing the values for a Location's Address
   */
  constructor(data: any) {
    extend(this, pick(data, 'street', 'zipCode', 'number', 'city', 'state'));
  }

}

/**
 * Represents a Location's Geometry
 */
class Geometry {

  type: string;
  coordinates: [number, number];

  /**
   * Creates a new Geometry
   * @param {Object} data - An object containing the values for a Location's Geomtry 
   */
  constructor(data: any) {
    this.type = data.type;
    this.coordinates = [data.coordinates[1], data.coordinates[0]];
  }

}