// types
import type { Feature } from 'ol';

export const useGeocoding = () => {
  /**
   * For a given feature (LineString drawn on the map), fetches the
   * name of the start and end point.
   *
   * @param feature Feature
   * @return Promise<void>
   */
  const getRouteNames = async (
    feature: Feature,
  ): Promise<{ startName: string; endName: string }> => {
    // get coordinates from pathFeature
    const coordinates = feature.getGeometry()?.getCoordinates();
    const startCoordinates = coordinates[0];
    const endCoordinates = coordinates[coordinates.length - 1];
    const startName = await getLocationName(startCoordinates);
    const endName = await getLocationName(endCoordinates);
    // assign names
    return {
      startName: startName,
      endName: endName,
    };
  };

  /**
   * Calls the OpenStreetMap API and returns the name of the location
   * given its coordinates.
   *
   * @param coord number[]
   * @return Promise<string>
   */
  const getLocationName = async (coord: number[]): Promise<string> => {
    const [lon, lat] = coord;
    // TODO: update fetch method (if we will use it)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`,
    );
    const data = await response.json();
    if (data.address?.road) {
      return data.address.road;
    }
    if (data.address?.suburb) {
      return data.address.suburb;
    }
    if (data.address?.city_district) {
      return data.address.city_district;
    }
    if (data.address?.city) {
      return data.address.city;
    }
    return '';
  };

  return {
    getRouteNames,
    getLocationName,
  };
};