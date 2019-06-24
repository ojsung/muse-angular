import { Component, OnInit } from '@angular/core'
import { AuthService } from '../user/auth.service'

@Component({
  selector: 'cher-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  pageTitle = 'Cher'
  constructor(public auth: AuthService) { }

  logOut() {
    localStorage.clear()
  }

  ngOnInit() {
  }

}
