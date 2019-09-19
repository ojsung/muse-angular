import { Component, OnInit, OnDestroy } from '@angular/core'
import { EvaHttpService } from '../eva-http.service'
import { ISpeedtestContainer } from './speedtest-container.interface'
import { EvaEeroService } from './eva-eero.service'
import { SafeResourceUrl } from '@angular/platform-browser'
import { ColumnMode, SortType } from '@swimlane/ngx-datatable'
import { Subscription } from 'rxjs'
import { EvaDatePipe } from './eva-date-pipe'

@Component({
  selector: 'muse-eero',
  templateUrl: './eva-eero.component.html',
  styleUrls: ['./eva-eero.component.css', '../eva.module.css']
})
export class EeroComponent implements OnInit, OnDestroy {
  public pageTitle = 'Eva: Eero Tracker'
  public rows: Array<ISpeedtestContainer> = []
  public columns: Array<any> = [
    { name: 'Owner', prop: 'owner', width: '200' },
    { name: 'Network ID', prop: 'networkId', width: '150' },
    { name: 'Internal ID', prop: 'internalId', width: '200' },
    { name: 'Eero SN', prop: 'eeroSN', width: '200' },
    { name: 'Device', prop: 'device', width: '100' },
    { name: 'Date', prop: 'speed.date', width: '300', pipe: new EvaDatePipe('en-US') },
    { name: 'Down Value', prop: 'speed.down.value', width: '100' },
    { name: 'Down Units', prop: 'speed.down.units', width: '100' },
    { name: 'Up Value', prop: 'speed.up.value', width: '100' },
    { name: 'Up Units', prop: 'speed.up.units', width: '100' }
  ]
  public failedColumns: Array<any> = [
    { name: 'Owner', prop: 'owner', width: '200' },
    { name: 'Network ID', prop: 'networkId', width: '150' },
    { name: 'Internal ID', prop: 'internalId', width: '200' },
    { name: 'Eero SN', prop: 'eeroSN', width: '200' },
    { name: 'Device', prop: 'device', width: '100' },
  ]
  public failedRows: Array<any> = []
  public fileUrl: SafeResourceUrl
  public ColumnMode = ColumnMode
  public SortType = SortType
  public showTable = -1
  public runningTest = false
  public formShowing = false
  public showSlice = 5
  private speedtestResults: Subscription
  constructor(private ehs: EvaHttpService, private ees: EvaEeroService) {}

  ngOnInit() {
    this.speedtestResults = this.ehs.getSpeedtests().subscribe({
      next: result => {
        const speedtests = result.reverse() as ISpeedtestContainer[]
        const csv = this.ees.speedtestContainerToCSV(speedtests)
        this.fileUrl = this.ees.createDownloadableCSV(csv)
        this.rows = speedtests
      }
    })
  }

  public setShowingTable(i: number) {
    if (this.showTable === i) {
      this.showTable = -1
    } else {
      this.showTable = i
    }
  }

  public runSpeedtest() {
    this.runningTest = true
    const runningTest: Subscription = this.ehs.runSpeedtest().subscribe({
      next: result => {
        const speedtestContainer = result as ISpeedtestContainer
        this.rows.unshift(speedtestContainer)
        const csv = this.ees.speedtestContainerToCSV(this.rows)
        this.fileUrl = this.ees.createDownloadableCSV(csv)
        this.runningTest = false
      },
      complete: () => {
        runningTest.unsubscribe()
      }
    })
  }

  ngOnDestroy() {
    this.speedtestResults.unsubscribe()
  }

  public increaseShowSlice() {
    this.showSlice += 5
  }

  public showForm() {
    this.formShowing = !this.formShowing
  }
}
