import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HaniComponent } from './hani.component';

const routes: Routes = [{
  path: '',
  component: HaniComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HaniRoutingModule { }
