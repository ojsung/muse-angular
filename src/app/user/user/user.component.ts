import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { IUser } from '../user.model'

@Component({
  selector: 'cher-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pageTitle = 'User List'

  users: IUser[] = []
  errorMessage: string
  constructor( private userService: UserService ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users
      },
      error => this.errorMessage = error as any
    )
  }
}
