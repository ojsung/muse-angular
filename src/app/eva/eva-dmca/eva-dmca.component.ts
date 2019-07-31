import { Component, OnInit, OnDestroy } from '@angular/core'
import { IOffender } from './offender.model'
import { EvaSocketService } from '../eva-socket.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'cher-eva-dmca',
  templateUrl: './eva-dmca.component.html',
  styleUrls: ['./eva-dmca.component.css']
})
export class EvaDmcaComponent implements OnInit, OnDestroy {
  constructor(private ess: EvaSocketService) {}
  public offenders: Array<IOffender>
  private fullReceiver: Subscription
  private updateReceiver: Subscription
  private currentRow: number
  private focused = false
  ngOnInit() {
    this.ess.requestEntry('eva-DMCA')
    this.fullReceiver = this.ess.receiveEntry('eva-full').subscribe({
      next: full => {
        this.offenders = full
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        this.fullReceiver.unsubscribe()
      }
    })
    this.updateReceiver = this.ess.receiveEntry('eva-update').subscribe({
      next: update => {
        const updateObj = update[0] as object
        const keys = Object.keys(updateObj)
        keys.forEach(key => {
          this.offenders[key] = updateObj[key]
        })
      },
      error: err => {
        console.log(err)
      },
      complete: () => {
        this.updateReceiver.unsubscribe()
      }
    })
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
}
