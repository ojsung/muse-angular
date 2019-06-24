import { Component, OnInit, OnDestroy } from '@angular/core';
import { HaniService } from '../hani.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cher-hani-reporting',
  templateUrl: './hani-reporting.component.html',
  styleUrls: ['./hani-reporting.component.css'],
  providers: [HaniService]
})
export class HaniReportingComponent implements OnInit, OnDestroy {

  constructor(private hs: HaniService) { }

  private trendingSubscription: Subscription

  public trendingResults: any[]
  public tableState = false
  public csv = ''

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.trendingSubscription) {
      this.trendingSubscription.unsubscribe()
    }
  }

  public sendToSheets() {
    this.tableState = true
    this.trendingSubscription = this.hs.getEntry(this.hs.trendingUrl).subscribe(trending => {
      const trendingArray = trending
      this.trendingResults = trendingArray
      this.arrayToCSV()
    },
      () => {
        this.trendingSubscription.unsubscribe()
    })
  }

  private a(aString): string {
    return `\"${aString}\",`
  }

  private arrayToCSV() {
    this.trendingResults.forEach(entry => {
      this.csv += this.a(entry.user.firstName + ' ' + entry.user.lastName) + this.a('Step')
      entry.trending.forEach(datum => {
        this.csv += this.a(datum.step)
      })
      this.csv += '\n'
      this.csv += this.a(entry.trending[0].workflow) + this.a('Timestamp')
      entry.trending.forEach(datum => {
        this.csv += this.a(datum.date)
      })
      this.csv += '\n\n'
    })
  }
}
