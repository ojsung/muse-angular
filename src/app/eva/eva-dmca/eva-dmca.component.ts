import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms'
import { EvaSocketService } from '../eva-socket.service'
import { Subscription } from 'rxjs'
import { IOffender } from './offender.model'

@Component({
  selector: 'muse-eva-dmca',
  templateUrl: './eva-dmca.component.html',
  styleUrls: ['./eva-dmca.component.css']
})
export class EvaDmcaComponent implements OnInit, OnDestroy {
  constructor(private ess: EvaSocketService, private fb: FormBuilder) { }
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
  private emailedControl: AbstractControl
  private infractionHistoryControl: AbstractControl

  public get infractionList(): FormArray {
    return this.dmcaForm.get('infractionHistory') as FormArray
  }

  ngOnInit() {
    this.ess.requestEntry('eva-DMCA')
    this.ess.receiveOnce('dmca-full').then(value => {
      Object.assign(this.offenders, value)
      this.offendersArray = Object.keys(this.offenders)
    })

    this.updateReceiver = this.ess.receiveEntry('dmca-update').subscribe({
      next: update => {
        const entry = update as IOffender
        const azotelId = entry.azotelId
        this.offenders[azotelId] = entry
        console.log('offenders ' + JSON.stringify(this.offenders))
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
      emailed: [false],
      infractionHistory: this.fb.array([this.buildHistory()])
    })
    this.azotelIdControl = this.dmcaForm.get('azotelId')
    this.azotelNameControl = this.dmcaForm.get('azotelName')
    this.infractionCountControl = this.dmcaForm.get('infractionCount')
    this.CPEMACControl = this.dmcaForm.get('CPEMAC')
    this.routerMACControl = this.dmcaForm.get('routerMac')
    this.emailControl = this.dmcaForm.get('email')
    this.emailedControl = this.dmcaForm.get('emailed')
    this.infractionHistoryControl = this.dmcaForm.get('infractionHistory')
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

  public sendUpdate(update) {
    this.ess.submitChange('dmca-update', update)
  }

  public buildHistory(date?, info?): FormGroup {
    const formDate = date ? date : null
    const formInfo = info ? info : null
    return this.fb.group({
      infractionDate: formDate,
      infractionInfo: formInfo
    })
  }

  public addHistoryRow(azotelId) {
    this.offenders[azotelId].infractionHistory.push({ infractionDate: null, infractionInfo: null })
  }

  public removeHistoryRow(azotelId, index) {
    this.offenders[azotelId].infractionHistory.splice(index, 1)
  }

  public save() {
    const formValue = this.dmcaForm.value
    Object.assign(formValue, {
      infractionHistory: [
        {
          infractionDate: null,
          infractionInfo: null
        }
      ]
    })
    this.ess.submitChange('dmca-update', formValue)
    console.log('I sent ' + JSON.stringify(formValue))
  }
}
