import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { HighService } from '../high.service'
import { IHigh, IHighControl } from '../high.model'
import { Subscription } from 'rxjs'
import { HighHttpService } from '../high-http.service'

@Component({
  selector: 'cher-high-form',
  templateUrl: './high-form.component.html',
  styleUrls: ['./high-form.component.css', '../../alerts.tables.css']
})
export class HighFormComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private hs: HighService, private hhs: HighHttpService) { }
  @Input() high: IHigh
  public highForm: FormGroup
  siteMessage: IHighControl = { str: 'This field is required' }
  osTicketMessage: IHighControl = { str: '' }
  timeMessage: IHighControl = { str: 'This field is required' }
  deviceMessage: IHighControl = { str: '' }
  issueMessage: IHighControl = { str: 'This field is required' }
  summaryMessage: IHighControl = { str: 'This field is required' }
  customerCountMessage: IHighControl = { str: 'This field is required' }

  public summaryPlaceholder = 'optional'
  public siteControl: AbstractControl
  public osTicketControl: AbstractControl
  public timeControl: AbstractControl
  public deviceControl: AbstractControl
  public issueControl: AbstractControl
  public summaryControl: AbstractControl
  public customerCountControl: AbstractControl
  private highUrl = 'high'
  private summaryWatcher: Subscription
  private controlsArray: Array<[AbstractControl, { str: string }]>
  private summaryArray: Array<any>

  ngOnInit() {
    this.highForm = this.fb.group({
      site: [null, [Validators.required, Validators.minLength(12)]],
      osTicket: ['INC', [Validators.minLength(8)]],
      time: [, Validators.required],
      device: ['SW.HU', Validators.required],
      issue: [null, Validators.required],
      summary: [null, ''],
      customerCount: [null, [Validators.required, Validators.min(0)]]
    })

    this.siteControl = this.highForm.get('site')
    this.osTicketControl = this.highForm.get('osTicket')
    this.timeControl = this.highForm.get('time')
    this.deviceControl = this.highForm.get('device')
    this.issueControl = this.highForm.get('issue')
    this.summaryControl = this.highForm.get('summary')
    this.customerCountControl = this.highForm.get('customerCount')

    this.controlsArray = [
      [this.siteControl, this.siteMessage],
      [this.osTicketControl, this.osTicketMessage],
      [this.timeControl, this.timeMessage],
      [this.deviceControl, this.deviceMessage],
      [this.issueControl, this.issueMessage],
      [this.summaryControl, this.summaryMessage],
      [this.customerCountControl, this.customerCountMessage]
    ]

    if (this.high) {
      this.siteControl.setValue(this.high.site)
      this.osTicketControl.setValue(this.high.osTicket)
      this.timeControl.setValue(this.high.time)
      this.deviceControl.setValue(this.high.device)
      this.issueControl.setValue(this.high.issue)
      this.summaryControl.setValue(this.high.summary)
      this.customerCountControl.setValue(this.high.customerCount)
    }

    this.summaryArray = [this.issueControl, this.summaryControl]

    this.controlsArray.forEach(controlArray => {
      this.hs.setSubscription(controlArray[0], controlArray[1])
    })

    this.summaryWatcher = this.summaryControl.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        this.summaryPlaceholder = 'optional'
      } else {
        this.summaryPlaceholder = 'required'
      }
    })

    this.hs.setValidation(this.summaryArray)
  }

  ngOnDestroy() {
    this.controlsArray.forEach(controlArray => {
      this.hs.setSubscription(controlArray[0], controlArray[1])
    })
    if (this.summaryWatcher) {
      this.summaryWatcher.unsubscribe()
    }
  }

  save() {
    this.siteControl.setValue(this.siteControl.value.toUpperCase())
    this.high = this.highForm.value as IHigh
    this.hhs.postEntry(this.highUrl, this.high).subscribe()
    this.highForm.reset()
  }
}
