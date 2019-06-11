import { Component, OnInit, OnDestroy } from '@angular/core'
import { IDisaster } from './disaster.model'
import { DisasterService } from './disaster-services/disaster.service'
import { timer, Subscription } from 'rxjs'
import { DisasterHttpService } from './disaster-services/disaster-http.service'
import { DisasterEventEmitterService } from './disaster-services/disaster-event-emitter.service'
import { DisasterFilterService } from './disaster-services/disaster-filter.service'

@Component({
  selector: 'cher-disaster',
  templateUrl: './disaster.component.html',
  styleUrls: ['./disaster.component.css', '../alerts.tables.css', '../alerts.css']
})
export class DisasterComponent implements OnInit, OnDestroy {
  // variables for later
  public pageTitle = 'Disaster Alerts'
  public showDetail = false
  public expandedIndex: number
  public authorized = this.dhs.auth.checkAuthLevel()
  public retrievedDisasters: IDisaster[] = []
  public displayedArray = []
  private filteredDisasters: IDisaster[]
  private finalArray = []
  private eventSubscription: Subscription
  private subscription
  private timer
  private disasterUrl = 'events'
  private errorMessage: any

  // retrieve list filter (if any) from the html.  Also tslint is dumb and doesn't like my variable name
  /* tslint:disable:variable-name */
  _listFilter: string
  /* tslint:enable:variable-name */
  get listFilter(): string {
    return this._listFilter
  }

  // set the filter, and run "performFilter" if listFilter is truthy
  set listFilter(value: string) {
    this._listFilter = value
    this.checkAndUpdateFilter()
  }

  constructor(
    private disasterService: DisasterService,
    private dhs: DisasterHttpService,
    private des: DisasterEventEmitterService,
    private dfs: DisasterFilterService
  ) {
    // begin subscribing to disasterService's filtering now that this page is now loaded
    // this will start getting the listfilter and any outages that match the filter
    this.eventSubscription = this.des.getEventEmitter().subscribe(bool => {
      if (bool === true) {
        this.checkAndUpdateFilter()
      }
    })
  }

  ngOnInit() {
    // Cher will only ask for updates every 15s
    this.timer = timer(0, 15000)
    this.subscription = this.timer.subscribe(x => {
      this.dhs.getEntry(this.disasterUrl).subscribe(
        disasters => {
          this.retrievedDisasters = disasters
          this.filteredDisasters = disasters
          this.finalArray = this.arrayToObjArray(this.filteredDisasters)

          // Tell Cher to start the process to check and update the list filter
          this.des.emitBoolean(true)
        },
        error => {
          this.errorMessage = error as any
          console.log(this.errorMessage)
        }
      )
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    this.eventSubscription.unsubscribe()
  }

  public expandRow(index: number): void {
    this.expandedIndex = index === this.expandedIndex ? -1 : index
  }

  public removeDisaster(disaster) {
    this.dhs.nullifyThenRemoveEntry(disaster, this.disasterUrl).subscribe(() => (error: any) => console.log(error))
  }

  // collect all keys and push to finalObject and return it
  private arrayToObjArray(disaster: IDisaster[]): any[] {
    const finalObject = {}
    this.disasterService.keyCollection(disaster, finalObject)
    return Object.entries(finalObject)
  }

  private checkAndUpdateFilter() {
    this.displayedArray = this.listFilter
      ? this.dfs.performFilter(this.listFilter, this.finalArray)
      : this.finalArray
  }
}
