import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EvaRoutingModule } from './eva-routing.module'
import { EvaComponent } from './eva/eva.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EvaDmcaComponent } from './eva-dmca/eva-dmca.component'

@NgModule({
  declarations: [EvaComponent, EvaDmcaComponent],
  imports: [CommonModule, EvaRoutingModule, FormsModule, ReactiveFormsModule]
})
export class EvaModule {}
