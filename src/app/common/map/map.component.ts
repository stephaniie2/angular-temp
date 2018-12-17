import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

	@Input() location: string;
  isPositionError: boolean = false;

	lat: number;
	lng: number;

  constructor(private mapService: MapService, 
              private ref: ChangeDetectorRef) { }

  mapReadyHandler(){
      this.mapService.getGeoLocation(this.location).subscribe(
        (coord) => {
          this.lat = coord.lat;
          this.lng = coord.lng;
          this.ref.detectChanges();
        }, () => {
          this.isPositionError = true;
        });
  }
}
