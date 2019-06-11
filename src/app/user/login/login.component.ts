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
      .subscribe(resp => {
        if (!resp) {
          this.loginInvalid = true
        } else {
          this.router.navigate(['welcome'])
        }
      })
  }
  cancel() {
    this.router.navigate(['welcome'])
  }
  ngOnInit() {
  }

}
