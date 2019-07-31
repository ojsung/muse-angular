import { Component, OnInit, OnDestroy } from '@angular/core'
import { IHigh } from './high.model'
import { Subscription } from 'rxjs'
import { HighHttpService } from './high-http.service'
import { AlertsSocketService } from '../alerts-socket.service'

@Component({
  selector: 'cher-high',
  templateUrl: './high.component.html',
  styleUrls: ['./high.component.css', '../alerts.tables.css']
})
export class HighComponent implements OnInit, OnDestroy {
  public pageTitle = 'High Alerts'
  public viewToggle = false
  public inactiveToggle = false
  public high: IHigh
  public outArray: Array<IHigh>
  public highActive: Array<IHigh>
  public highInactive: Array<IHigh>
  public authLevel: number
  private highUrl = 'high'
  private subscription: Subscription
  public authenticated = this.hhs.auth.firstName

  // there is some unfortunate naming here, but I would rather not break convention, since readability
  // is more important here, and no client will ever know the name of the variable
  constructor(private hhs: HighHttpService, private ass: AlertsSocketService) {}

  ngOnInit() {
    this.authLevel = this.hhs.auth.userType

    this.ass.requestEntry('high')

    this.subscription = this.ass.receiveEntry('high').subscribe({
      next: problems => {
        this.outArray = problems as IHigh[]
        const activesArray: Array<IHigh> = []
        const inactivesArray: Array<IHigh> = []
        this.outArray.forEach(entry => {
          if (entry.active) {
            activesArray.push(entry)
          } else {
            inactivesArray.push(entry)
          }
        })
        this.highActive = activesArray
        this.highInactive = inactivesArray
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        this.subscription.unsubscribe()
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  public editProblem(alert: IHigh) {
    this.high = alert
    this.viewToggle = true
  }

  public removeProblem(alert) {
    this.removeFromArray(alert, this.highActive)
    this.hhs.nullifyThenRemoveEntry(alert, this.highUrl).subscribe({
      error: error => console.log(error)
    })
  }

  public addProblem(alert: IHigh) {
    alert.active = true
    this.removeFromArray(alert, this.highInactive)
    this.hhs.clearIdAndPost(this.highUrl, alert).subscribe({
      error: error => console.log(error)
    })
  }

  public toggleView() {
    this.viewToggle = !this.viewToggle
  }

  public toggleInactives() {
    this.inactiveToggle = !this.inactiveToggle
  }

  private removeFromArray(alert, arrayToClear) {
    const removeIndex = arrayToClear.indexOf(alert)
    arrayToClear.splice(removeIndex, 1)
  }
}
