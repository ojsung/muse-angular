import { Injectable } from '@angular/core'
import { IUser } from './user.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { tap, catchError } from 'rxjs/operators'
import { IAuthResponse } from './login/auth-response-model'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

// this service is the most reused code in this application.
export class AuthService {
  private currentUser: IUser
  constructor(private http: HttpClient) {}

  // private loginUrl = 'http://localhost:4200/api/user/login'
  private loginUrl = 'api/user/login'
  private TOKEN_KEY = 'token'
  private FIRST_KEY = 'firstName'
  private LAST_KEY = 'lastName'
  private TYPE_KEY = 'userType'
  private options = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  }
  private roleHierarchy = {
    Admin: 0,
    Manager: 1,
    CSPPA: 2,
    T3: 3,
    T2: 4,
    T1: 5
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  get firstName() {
    return localStorage.getItem(this.FIRST_KEY)
  }
  get lastName() {
    return localStorage.getItem(this.LAST_KEY)
  }

  // return the user type as a number.  Used to verify permissions on the client side.
  // This is nice to prevent anyone unauthorized from making requests to the server, reducing the number of
  // garbage requests that the server will have to deal with.
  // However, it is possible to get around this, so all permissions and authorizations are rechecked server side
  // to prevent anyone unauthorized from accessing anything they shouldn't
  get userType(): number {
    const userNumber = JSON.parse(localStorage.getItem(this.TYPE_KEY))
    return userNumber
  }

  public loginUser(userName: string, password: string) {
    const loginInfo = { userName, password }

    return this.http
      .post<IAuthResponse>(this.loginUrl, loginInfo, this.options)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('firstName', res.user.firstName)
          localStorage.setItem('lastName', res.user.lastName)
          this.setRoleLevel(res.user.userType)
          this.currentUser = res.user as IUser
        })
      )
      .pipe(catchError(err => of(false)))
  }

  public updateCurrentUser(firstName: string, lastName: string, password: string) {
    this.currentUser.firstName = firstName
    this.currentUser.lastName = lastName

    return this.http.put(
      `/api/user/${this.currentUser.userName}`,
      { ...this.currentUser, password },
      this.options
    )
  }

  // Need to implement a way to change passwords. But that will wait until Muse is moved to internal server space
  // public updatePassword(password: string) {
  // }

  public isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  public getCurrentUser(): IUser {
    return this.currentUser
  }

  private setRoleLevel(userType) {
    const roleLevel = this.roleHierarchy[userType]
    localStorage.setItem('userType', roleLevel)
  }
}
