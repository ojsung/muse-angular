import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EvaRoutingModule } from './eva-routing.module'
import { EvaComponent } from './eva/eva.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EvaDmcaComponent } from './eva-dmca/eva-dmca.component'
import { EeroComponent } from './eero/eva-eero.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'

@NgModule({
  declarations: [EvaComponent, EvaDmcaComponent, EeroComponent],
  imports: [CommonModule, EvaRoutingModule, FormsModule, ReactiveFormsModule, NgxDatatableModule]
})
export class EvaModule {}
