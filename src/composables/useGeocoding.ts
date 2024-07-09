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
  const fetchPathName = async (feature: Feature): Promise<void> => {
    // get coordinates from pathFeature
    const coordinates = feature.getGeometry()?.getCoordinates();
    const startCoordinates = coordinates[0];
    const endCoordinates = coordinates[coordinates.length - 1];
    // assign names
    feature['startName'] = await getLocationName(startCoordinates);
    feature['endName'] = await getLocationName(endCoordinates);
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
    const locationName = data.address.road;
    return locationName;
  };

  return {
    fetchPathName,
    getLocationName,
  };
};
