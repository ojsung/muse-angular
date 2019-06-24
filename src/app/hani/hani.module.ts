import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HaniRoutingModule } from './hani-routing.module'
import { HaniComponent } from './hani.component'
import { SharedModule } from '../shared/shared.module'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HaniModalComponent } from './hani-modal/hani-modal.component'
import { HaniService } from './hani.service';
import { HaniReportingComponent } from './hani-reporting/hani-reporting.component';

@NgModule({
  declarations: [HaniComponent, HaniModalComponent, HaniReportingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaniRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbModule
  ],
  exports: [ HaniModalComponent, HaniComponent ],
  bootstrap: [HaniModalComponent],
  entryComponents: [HaniComponent],
  providers: [HaniService]
})
export class HaniModule {}
