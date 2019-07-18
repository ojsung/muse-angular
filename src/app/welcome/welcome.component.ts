import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'cher-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  pageTitle = 'Cher'

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

  ngOnInit() { }
}
