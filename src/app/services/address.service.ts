import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GeolocationService, GeolocationPosition } from './geolocation.service';

export interface GeocodingResult {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly GEOCODING_API_KEY = 'YOUR_GOOGLE_API_KEY';
  private readonly GEOCODING_API_URL =
    'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(
    private http: HttpClient,
    private geolocationService: GeolocationService
  ) {}

  async getCurrentLocation(): Promise<GeolocationPosition> {
    return this.geolocationService.getCurrentPosition();
  }

  reverseGeocode(lat: number, lng: number): Observable<GeocodingResult> {
    const url = `${this.GEOCODING_API_URL}?latlng=${lat},${lng}&key=${this.GEOCODING_API_KEY}`;

    return this.http.get(url).pipe(
      map((response: any): GeocodingResult => {
        if (response.results && response.results.length > 0) {
          const address = response.results[0].address_components;
          return this.parseAddressComponents(address);
        }
        throw new Error('No address found');
      }),
      catchError((error) => {
        console.error('Error fetching address:', error);
        return throwError(() => new Error('Failed to get address details'));
      })
    );
  }

  private parseAddressComponents(components: any[]): GeocodingResult {
    const result: GeocodingResult = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    };

    components.forEach((component) => {
      const types = component.types;

      if (types.includes('street_number')) {
        result.street = component.long_name + ' ';
      }
      if (types.includes('route')) {
        result.street += component.long_name;
      }
      if (types.includes('locality')) {
        result.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        result.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        result.zipCode = component.long_name;
      }
      if (types.includes('country')) {
        result.country = component.long_name;
      }
    });

    return result;
  }

  validateAddress(address: GeocodingResult): boolean {
    return !!(
      address.street &&
      address.city &&
      address.state &&
      address.zipCode &&
      address.country
    );
  }
}
