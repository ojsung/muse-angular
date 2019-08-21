import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HaniRoutingModule } from './hani-routing.module'
import { HaniComponent } from './hani.component'
import { SharedModule } from '../shared/shared.module'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { HaniService } from './hani.service';
import { HaniReportingComponent } from './hani-reporting/hani-reporting.component';
import { CherModule } from '../cher/cher.module';

@NgModule({
  declarations: [HaniComponent, HaniReportingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaniRoutingModule,
    SharedModule,
    HttpClientModule,
    CherModule
  ],
  providers: [HaniService]
})
export class HaniModule {}
