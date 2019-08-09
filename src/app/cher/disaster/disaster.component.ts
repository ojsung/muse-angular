import { Component, OnInit, OnDestroy } from '@angular/core'
import { IDisaster } from './disaster.model'
import { DisasterService } from './disaster-services/disaster.service'
import { Subscription } from 'rxjs'
import { DisasterHttpService } from './disaster-services/disaster-http.service'
import { DisasterEventEmitterService } from './disaster-services/disaster-event-emitter.service'
import { DisasterFilterService } from './disaster-services/disaster-filter.service'
import { CherSocketService } from '../cher-socket.service'

@Component({
  selector: 'muse-disaster',
  templateUrl: './disaster.component.html',
  styleUrls: ['./disaster.component.css', '../cher.tables.css', '../cher.css']
})

// This is the first component I ever created in typescript.  Because of that,
// it is quite bad.  It needs to be rewritten from the bottom up.
// I will rewrite this whole component when there aren't larger fires I need to deal with.
export class DisasterComponent implements OnInit, OnDestroy {
  public pageTitle = 'Disaster Alerts'
  public showDetail = false
  public expandedIndex: number
  public authLevel = this.dhs.auth.userType
  public retrievedDisasters: IDisaster[] = []
  public displayedArray = []
  private filteredDisasters: IDisaster[]
  private objArray = []
  private eventSubscription: Subscription
  private disasterUrl = 'events'
  private errorMessage: any
  public sayRefresh = false
  private eventsSocket: Subscription

  // retrieve list filter (if any) from the html.  Also tslint is dumb and doesn't like my variable name
  /* tslint:disable:variable-name */
  private _listFilter: string
  /* tslint:enable:variable-name */
  get listFilter(): string {
    return this._listFilter
  }

  // set the filter, and run "performFilter" if listFilter is truthy
  set listFilter(value: string) {
    this._listFilter = value
    this.checkAndUpdateFilter()
  }

  // again, the naming for the Alerts Socket Service here is a bit unfortunate.
  // But for readability's sake, I will keep with convention
  constructor(
    private ds: DisasterService,
    private dhs: DisasterHttpService,
    private dees: DisasterEventEmitterService,
    private dfs: DisasterFilterService,
    private css: CherSocketService
  ) {
    // begin subscribing to disasterService's filtering now that this page is now loaded
    // this will start getting the listfilter and any outages that match the filter
    this.eventSubscription = this.dees.getEventEmitter().subscribe({
      next: bool => {
        if (bool === true) {
          this.checkAndUpdateFilter()
        }
      }
    })
  }

  ngOnInit() {
    // start by notifying the server that we want the events
    this.css.requestEntry('events')

    // once events have arrived, subscribe to them
    this.eventsSocket = this.css.receiveEntry('events').subscribe({
      next: disasters => {
        this.retrievedDisasters = disasters
        this.filteredDisasters = disasters
        this.objArray = this.arrayToObjArray(this.filteredDisasters)

        // Tell Muse to start the process to check and update the list filter
        this.dees.emitBoolean(true)
      },
      error: error => {
        console.log(error)
      },
      complete: () => {
        this.eventsSocket.unsubscribe()
      }
    })
  }

  ngOnDestroy() {
    this.eventsSocket.unsubscribe()
  }

  public expandRow(index: number): void {
    this.expandedIndex = index === this.expandedIndex ? -1 : index
  }

  public removeDisaster(disaster) {
    this.dhs.nullifyThenRemoveEntry(disaster, this.disasterUrl).subscribe({
      error: error => console.log(error)
    })
  }

  public trackDisaster(index: number, alert: IDisaster) {
    return alert.site
  }

  // collect all keys and push to finalObject and return it
  private arrayToObjArray(disaster: IDisaster[]): any[] {
    const finalObject = {}
    this.ds.keyCollection(disaster, finalObject)
    return Object.entries(finalObject)
  }

  private checkAndUpdateFilter() {
    this.displayedArray = this.listFilter
      ? this.dfs.performFilter(this.listFilter, this.objArray)
      : this.objArray
  }
}
