import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NatalieRoutingModule } from './natalie-routing.module';
import { NatalieComponent } from './natalie/natalie.component'

@NgModule({
  declarations: [NatalieComponent],
  imports: [
    CommonModule,
    NatalieRoutingModule
  ]
})
export class NatalieModule { }
