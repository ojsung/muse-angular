import { Component, OnInit, OnDestroy, AbstractType } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { EvaSocketService } from '../eva-socket.service'
import { Subscription } from 'rxjs'
import { IOffender } from './offender.model'

@Component({
  selector: 'cher-eva-dmca',
  templateUrl: './eva-dmca.component.html',
  styleUrls: ['./eva-dmca.component.css']
})
export class EvaDmcaComponent implements OnInit, OnDestroy {
  constructor(private ess: EvaSocketService, private fb: FormBuilder) {}
  public offenders = {}
  public offendersArray = []
  private fullReceiver: Subscription
  private updateReceiver: Subscription
  private currentRow: number
  private focused = false
  public formView = false

  // forms variables
  public dmcaForm: FormGroup
  private azotelIdControl: AbstractControl
  private azotelNameControl: AbstractControl
  private infractionCountControl: AbstractControl
  private CPEMACControl: AbstractControl
  private routerMACControl: AbstractControl
  private emailControl: AbstractControl
  private infractionDateControl: AbstractControl
  private infractionInfoControl: AbstractControl

  ngOnInit() {
    this.ess.requestEntry('eva-DMCA')
    this.ess.receiveOnce('dmca-full')

    this.updateReceiver = this.ess.receiveEntry('dmca-update').subscribe({
      next: update => {
        const entry = update as IOffender
        const azotelId = entry.azotelId
        this.offenders[azotelId] = entry
        this.offendersArray.push(azotelId)
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        this.updateReceiver.unsubscribe()
      }
    })

    this.dmcaForm = this.fb.group({
      azotelId: [null, [Validators.required]],
      azotelName: [null, Validators.required],
      CPEMAC: [null, [Validators.required]],
      routerMAC: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      infractionDate: [null, [Validators.required]],
      infractionInfo: [null, [Validators.required]]
    })
    this.azotelIdControl = this.dmcaForm.get('azotelId')
    this.azotelNameControl = this.dmcaForm.get('azotelName')
    this.infractionCountControl = this.dmcaForm.get('infractionCount')
    this.CPEMACControl = this.dmcaForm.get('CPEMAC')
    this.routerMACControl = this.dmcaForm.get('routerMac')
    this.emailControl = this.dmcaForm.get('email')
    this.infractionDateControl = this.dmcaForm.get('infractionDate')
    this.infractionInfoControl = this.dmcaForm.get('infractionInfo')
  }
  ngOnDestroy() {
    if (this.fullReceiver) {
      this.fullReceiver.unsubscribe()
    }
    if (this.updateReceiver) {
      this.updateReceiver.unsubscribe()
    }
    if (this.focused) {
      this.ess.leaveRow('dmca-row', this.currentRow)
    }
  }

  public focus(i: number) {
    this.currentRow = i
    this.focused = true
    this.ess.useRow('dmca-row', i)
  }

  public toggleForm() {
    this.formView = !this.formView
  }

  public save() {
    const formValue = { emailed: false, ...this.dmcaForm.value } as IOffender
    this.ess.submitChange('dmca-update', formValue)
    console.log('I sent ' + JSON.stringify(formValue))
  }
}
