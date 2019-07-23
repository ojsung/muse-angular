import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../auth.service'

@Component({
  selector: 'cher-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string
  password: string
  loginInvalid = false

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  login(formValues) {
    this.authService.loginUser(
      formValues.userName,
      formValues.password
    )
      // this doesn't quite work as expected.  Even on a failed login, you will be sent to the welcome page
      // this will be fixed in the future, but is not a big priority right now
      .subscribe({
        next: () => {
            this.router.navigate(['welcome'])
        },
        error: () => {
          this.loginInvalid = true
        }
      })
  }
  cancel() {
    this.router.navigate(['welcome'])
  }
  ngOnInit() {
  }

}
