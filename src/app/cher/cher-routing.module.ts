import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DisasterComponent } from './disaster/disaster.component'
import { HighComponent } from './high/high.component'
import { DisasterInfoComponent } from './disaster/disaster-info/disaster-info.component'
import { HighFormComponent } from './high/high-form/high-form.component'

const routes: Routes = [
  { path: 'disaster', component: DisasterComponent },
  { path: 'disaster/:_id', component: DisasterInfoComponent },
  { path: 'high', component: HighComponent },
  { path: 'highform', component: HighFormComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CherRoutingModule {}
