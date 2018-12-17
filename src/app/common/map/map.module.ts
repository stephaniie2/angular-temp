import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from "@angular/common";

import { MapComponent } from './map.component';
import { CamelizePipe } from 'ngx-pipes';
import { MapService } from './map.service';

@NgModule({
  declarations: [
      MapComponent
  ],
  exports: [
      MapComponent
  ],
  imports: [
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyB_zeBwV0554SwqolHB7LGqhky8nQbvZAo'
      }),
      CommonModule

  ],
  providers: [MapService, CamelizePipe],
  bootstrap: []
})
export class MapModule { }
