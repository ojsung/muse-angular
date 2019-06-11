import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'cher-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  pageTitle = 'Cher'

  constructor() { }

  ngOnInit() {
  }

}
