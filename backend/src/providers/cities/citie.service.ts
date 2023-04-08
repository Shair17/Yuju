import {Service} from 'fastify-decorators';
import {allowedCities} from './allowed-cities';
import {ILocation} from '../realtime/realtime.service';

@Service('CitieServiceToken')
export class CitieService {
  isInAllowedCities({latitude, longitude}: ILocation): boolean {
    const minLatitude = allowedCities.min.latitude;
    const minLongitude = allowedCities.min.longitude;

    const maxLatitude = allowedCities.max.latitude;
    const maxLongitude = allowedCities.max.longitude;

    return (
      minLatitude <= latitude &&
      latitude <= maxLatitude &&
      minLongitude <= longitude &&
      longitude <= maxLongitude
    );
  }
}
