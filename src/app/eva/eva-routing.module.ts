import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EvaComponent } from './eva/eva.component'
import { EvaDmcaComponent } from './eva-dmca/eva-dmca.component'

const routes: Routes = [
  { path: 'dmca', component: EvaDmcaComponent },
  { path: '', component: EvaComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaRoutingModule {}
