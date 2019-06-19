import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HaniRoutingModule } from './hani-routing.module';
import { HaniComponent } from './hani.component';
import { SharedModule } from '../shared/shared.module'
import { HttpClientModule } from '@angular/common/http';
import { HaniHttpService } from './hani-http.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HaniComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaniRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [HaniHttpService]
})
export class HaniModule { }
