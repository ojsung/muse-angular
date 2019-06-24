import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HaniComponent } from './hani.component';
import { HaniReportingComponent } from './hani-reporting/hani-reporting.component';

const routes: Routes = [{
  path: '',
  component: HaniComponent
},
{path: 'reporting', component: HaniReportingComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HaniRoutingModule { }
