import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EvaComponent } from './eva/eva.component'
import { EvaDmcaComponent } from './eva-dmca/eva-dmca.component'
import { EeroComponent } from './eero/eva-eero.component'

const routes: Routes = [
  { path: 'dmca', component: EvaDmcaComponent },
  { path: 'eero', component: EeroComponent},
  { path: '', component: EvaComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaRoutingModule {}
