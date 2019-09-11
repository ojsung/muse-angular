import { Component, OnInit, OnDestroy } from '@angular/core'
import { EvaHttpService } from '../eva-http.service'
import { ISpeedtestContainer } from './speedtest-container.interface'
import { EvaEeroService } from './eva-eero.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {ColumnMode, SortType} from '@swimlane/ngx-datatable'
import { Subscription } from 'rxjs'

@Component({
  selector: 'muse-eero',
  templateUrl: './eva-eero.component.html',
  styleUrls: ['./eva-eero.component.css', '../eva.module.css']
})
export class EeroComponent implements OnInit, OnDestroy {
  public pageTitle = 'Eva: Eero Tracker'
  public rows: Array<ISpeedtestContainer> = []
  public fileUrl: SafeResourceUrl
  public ColumnMode = ColumnMode
  public SortType = SortType
  public showTable = -1
  public runningTest = false
  private speedtestResults: Subscription
  constructor(private ehs: EvaHttpService, private ees: EvaEeroService, private ds: DomSanitizer) {}

  ngOnInit() {
    this.speedtestResults = this.ehs.getSpeedtests().subscribe({
      next: result => {
        const speedtests = result.reverse() as ISpeedtestContainer[]
        const csv = this.ees.speedtestContainerToCSV(speedtests)
        this.createDownloadableCSV(csv)
        this.rows = [...speedtests]
      }
    })
  }
  private createDownloadableCSV(csv: string) {
    const blob = new Blob([csv], { type: 'text/csv' })
    const unsanitizedFileUrl = window.URL.createObjectURL(blob)
    this.fileUrl = this.ds.bypassSecurityTrustResourceUrl(unsanitizedFileUrl)
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
        // I fully recognize how expensive this looks.  However, it tracked by array.push/pop
        // so array.unshift won't update the indices
        this.rows = [...this.rows]
        const csv = this.ees.speedtestContainerToCSV(this.rows)
        this.createDownloadableCSV(csv)
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
}
