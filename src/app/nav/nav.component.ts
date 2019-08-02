import { Component, OnInit } from '@angular/core'
import { AuthService } from '../user/auth.service'

@Component({
  selector: 'muse-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  pageTitle = 'Muse'
  constructor(public auth: AuthService) { }

  logOut() {
    localStorage.clear()
  }

  ngOnInit() {
  }

}
