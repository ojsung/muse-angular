import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';

@Component({
  selector: 'muse-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

  // there may or may not be easter eggs on this page.  I plead the fifth
export class WelcomeComponent implements OnInit {
  pageTitle = 'Muse'

  private rSysArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  public get rSys() {
    return !this.rSysArray.includes(0, 0)
  }

  public setRSys(i: number) {
    this.rSysArray[i] = 1
    this.logCount()
  }

  private logCount() {
    const sum = this.rSysArray.reduce((a, b) => a + b, 0)
    console.log(17 - sum + ' remaining')
  }

  constructor() {}
  ngOnInit() {
  }
}
