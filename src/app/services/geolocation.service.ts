import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private platform: Platform) {}

  async getCurrentPosition(): Promise<GeolocationPosition> {
    try {
      // Use browser's geolocation API
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy || 0,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
              },
              timestamp: position.timestamp,
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            reject(new Error('Unable to get location'));
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      });
    } catch (error) {
      console.error('Geolocation error:', error);
      throw new Error('Unable to get location');
    }
  }
}
