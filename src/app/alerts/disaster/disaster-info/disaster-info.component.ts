import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IDisaster } from '../disaster.model'
import { DisasterHttpService } from '../disaster-services/disaster-http.service'

@Component({
  selector: 'muse-disaster-info',
  templateUrl: './disaster-info.component.html',
  styleUrls: ['./disaster-info.component.css']
})
export class DisasterInfoComponent implements OnInit, OnDestroy {
  disaster: any
  children: IDisaster[] = []
  id: string
  errorMessage: string
  private routeParam: any

  constructor(private dhs: DisasterHttpService, private route: ActivatedRoute) {}

  ngOnInit() {
    // on initiation, subscribe to the disasters
    this.routeParam = this.route.params.subscribe({
      next: params => {
        this.id = params._id
        this.dhs.getDisaster(this.id).subscribe({
          next: disaster => {
            this.disaster = disaster
          },
          error: error => (this.errorMessage = error as any)
        })
      }
    })
    if (this.disaster.device !== 'SW.HU') {
      this.dhs.getChildren(this.disaster.site).subscribe({
        next: children => {
          this.children = children
        }
      })
    }
  }

  // on destroy, remove the sub to prevent memory leaks
  ngOnDestroy() {
    this.routeParam.unsubscribe()
  }
}
