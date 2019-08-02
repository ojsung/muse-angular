import { Component, OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { HaniComponent } from '../hani.component'

@Component({
  selector: 'muse-hani-modal',
  templateUrl: './hani-modal.component.html',
  styleUrls: ['./hani-modal.component.css']
})
export class HaniModalComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService.open(HaniComponent, { windowClass: 'haniWindow' })
    modalRef.componentInstance.name = 'Hani'
  }

  ngOnInit() {}
}
