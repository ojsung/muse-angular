import { Component, OnInit, OnDestroy } from '@angular/core'
import { HaniService } from '../hani.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'muse-hani-reporting',
  templateUrl: './hani-reporting.component.html',
  styleUrls: ['./hani-reporting.component.css'],
  providers: [HaniService]
})
export class HaniReportingComponent implements OnInit, OnDestroy {
  constructor(private hs: HaniService) {}

  private trendingSubscription: Subscription

  public trendingResults: any[]
  public tableState = false
  public csv = ''
  public touched = false
  public nameInput: string

  ngOnInit() {}

  ngOnDestroy() {
    if (this.trendingSubscription) {
      this.trendingSubscription.unsubscribe()
    }
  }

  // I don't feel comfortable creating downloadables on Muse since Muse is not hosted internally
  // I would need to import some dependencies, and they would introduce vulnerabilities
  // because of this, the reporting data will be delivered as a CSV on-screen instead
  public deliverAsCsv() {
    this.tableState = true
    this.trendingSubscription = this.hs.getEntry(this.hs.trendingUrl).subscribe({
      next: trending => {
        const trendingArray = trending
        this.trendingResults = trendingArray
        console.log(JSON.stringify(trendingArray))
        this.arrayToCSV()
      },
      complete: () => {
        this.trendingSubscription.unsubscribe()
      },
      error: error => {
        this.trendingSubscription.unsubscribe()
        console.log(error)
      }
    })
  }

  private encapsulateAsString(aString): string {
    return `\"${aString}\",`
  }

  private arrayToCSV() {
    this.trendingResults.forEach(entry => {
      if (entry.trending[0]) {
        this.csv +=
          this.encapsulateAsString(entry.user.firstName + ' ' + entry.user.lastName) +
          this.encapsulateAsString(entry.trending[0].azotelId) +
          this.encapsulateAsString(entry.timeId) +
          this.encapsulateAsString(entry.endTimeId)
        entry.trending.forEach(datum => {
          this.csv += this.encapsulateAsString(datum.step)
        })
        this.csv += '\n'
        this.csv +=
          this.encapsulateAsString(entry.trending[0].workflow) +
          this.encapsulateAsString('Azotel ID') +
          this.encapsulateAsString('Start Time') +
          this.encapsulateAsString('End Time')
        entry.trending.forEach(datum => {
          this.csv += this.encapsulateAsString(datum.date)
        })
        this.csv += '\n\n'
      }
    })
  }

  public setError() {
    this.touched = true
  }
}
