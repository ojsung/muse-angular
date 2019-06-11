import { Component, OnInit, OnDestroy } from '@angular/core'
import { IHigh } from './high.model'
import { timer, Observable, Subscription } from 'rxjs'
import { HighHttpService } from './high-http.service'

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
  public authorized: boolean
  private highUrl = 'high'
  private timer: Observable<number>
  private subscription: Subscription

  constructor(private hhs: HighHttpService) {}

  ngOnInit() {
    this.timer = timer(0, 15000)
    this.subscription = this.timer.subscribe(() => {
      this.getProblems()
    })

    this.authorized = this.hhs.auth.checkAuthLevel()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  private getProblems() {
    return this.hhs.getEntry(this.highUrl).subscribe(problems => {
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
    })
  }

  public editProblem(alert: IHigh) {
    this.high = alert
    this.viewToggle = true
  }

  public removeProblem(alert) {
    this.findAndSwitch(alert, this.highActive, this.highInactive)
    this.hhs.nullifyThenRemoveEntry(alert, this.highUrl).subscribe(() => (error: any) => console.log(error))
  }

  public addProblem(alert: IHigh) {
    alert.active = true
    this.findAndSwitch(alert, this.highInactive, this.highActive)
    this.hhs.clearIdAndPost(this.highUrl, alert).subscribe(() => (error: any) => console.log(error))
  }

  public toggleView() {
    this.viewToggle = !this.viewToggle
  }

  public toggleInactives() {
    this.inactiveToggle = !this.inactiveToggle
  }

  private findAndSwitch(alert, removeArray, addArray) {
    const removeIndex = removeArray.indexOf(alert)
    removeArray.splice(removeIndex, 1)
    addArray.push(alert)
  }
}
