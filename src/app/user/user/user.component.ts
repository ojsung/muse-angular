import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { IUser } from '../user.model'

@Component({
  selector: 'muse-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pageTitle = 'User List'

  users: IUser[] = []
  errorMessage: string
  constructor(private userService: UserService) {}

  // eventually, this will do more.  It will be used by managers to manage users and profiles.
  // However, right now it just reports the different usernames.
  // it's not a big priority right now though, since I can manage http calls through Postman
  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users
      },
      error: error => (this.errorMessage = error)
    })
  }
}
