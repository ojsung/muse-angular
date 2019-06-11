import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IDisaster } from '../disaster.model'
import { DisasterHttpService } from '../disaster-services/disaster-http.service'

@Component({
  selector: 'cher-disaster-info',
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
    this.routeParam = this.route.params.subscribe(params => {
      this.id = params._id
      this.dhs.getDisaster(this.id).subscribe(
        disaster => {
          this.disaster = disaster
        },
        error => (this.errorMessage = error as any)
      )
    })
    if (this.disaster.device !== 'SW.HU') {
      this.dhs.getChildren(this.disaster.site).subscribe(children => {
        this.children = children
      })
    }
  }

  ngOnDestroy() {
    this.routeParam.unsubscribe()
  }
}
