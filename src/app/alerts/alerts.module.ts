import { NgModule } from '@angular/core'
import { DisasterComponent } from './disaster/disaster.component'
import { HighComponent } from './high/high.component'
import { SharedModule } from '../shared/shared.module'
import { AlertsRoutingModule } from './alerts-routing.module'
import { DisasterInfoComponent } from './disaster/disaster-info/disaster-info.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HighFormComponent } from './high/high-form/high-form.component'

@NgModule({
  declarations: [DisasterComponent, HighComponent, DisasterInfoComponent, HighFormComponent],
  imports: [
    SharedModule,
    AlertsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DisasterComponent
  ]
})
export class AlertsModule { }
