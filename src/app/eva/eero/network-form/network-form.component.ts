import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { EvaHttpService } from '../../eva-http.service';
import { INetwork } from './network.interface';

@Component({
  selector: 'muse-network-form',
  templateUrl: './network-form.component.html',
  styleUrls: ['./network-form.component.css']
})
export class NetworkFormComponent implements OnInit {
  public networkForm: FormGroup

  constructor(private fb: FormBuilder, private ehs: EvaHttpService) { }

  ngOnInit() {
    this.networkForm = this.fb.group({
      owner: [null, Validators.required],
      networkId: [null, [Validators.required, Validators.min(0)]],
      internalId: [null, Validators.required],
      eeroSN: [null, Validators.required],
      device: [null, Validators.required],
      tower: [null, Validators.required]
    })
  }

  save() {
    const network = this.networkForm.value as INetwork
    this.ehs.updateNetwork(network).subscribe()
    this.networkForm.reset()
   }
}
