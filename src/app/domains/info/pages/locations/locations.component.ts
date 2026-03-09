import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  resource,
  signal,
} from '@angular/core';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-locations.component',
  imports: [],
  templateUrl: './locations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LocationsComponent {
  $origin = signal('');

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('Current position:', position);
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin);
      });
    });
  }

  locationRs = resource({
    params: () => ({
      origin: this.$origin(),
    }),
    loader: async ({ params }) => {
      const url = new URL(`${environment.apiUrl}/api/v1/locations`);

      if (params.origin) {
        url.searchParams.set('origin', params.origin);
      }

      const response = await fetch(url.toString());
      return await response.json();
    },
  });
}
