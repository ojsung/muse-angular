import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HaniRoutingModule } from './hani-routing.module'
import { HaniComponent } from './hani.component'
import { SharedModule } from '../shared/shared.module'
import { HttpClientModule } from '@angular/common/http'
import { HaniHttpService } from './hani-http.service'
import { CommonModule } from '@angular/common'
import { HaniService } from './hani.service'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HaniModalComponent } from './hani-modal/hani-modal.component'

@NgModule({
  declarations: [HaniComponent, HaniModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaniRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbModule
  ],
  exports: [ HaniModalComponent ],
  bootstrap: [HaniModalComponent],
  entryComponents: [HaniComponent],
  providers: [HaniHttpService, HaniService]
})
export class HaniModule {}
