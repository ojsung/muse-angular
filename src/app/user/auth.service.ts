import { Injectable } from '@angular/core'
import { IUser } from './user.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { tap, catchError } from 'rxjs/operators'
import { IAuthResponse } from './login/auth-response-model'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: IUser
  constructor(private http: HttpClient) {}

  private TOKEN_KEY = 'token'
  private FIRST_KEY = 'firstName'
  private LAST_KEY = 'lastName'
  private ID_KEY = 'id'
  private options = { headers: new HttpHeaders({ Content_type: 'application/json' }) }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  get firstName() {
    return localStorage.getItem(this.FIRST_KEY)
  }
  get lastName() {
    return localStorage.getItem(this.LAST_KEY)
  }

  get id() {
    return localStorage.getItem(this.ID_KEY)
  }

  public loginUser(userName: string, password: string) {
    const loginInfo = { userName, password }

    return this.http
      .post<IAuthResponse>('/api/user/login', loginInfo, this.options)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('firstName', res.user.firstName)
          localStorage.setItem('lastName', res.user.lastName)
          localStorage.setItem('id', res.user._id.toString())
          this.currentUser = res.user as IUser
        }))
      .pipe(
        catchError(err => of(false)))
  }

  public updateCurrentUser(firstName: string, lastName: string, password: string) {
    this.currentUser.firstName = firstName
    this.currentUser.lastName = lastName

    return this.http.put(`/api/user/${this.currentUser._id}`, { ...this.currentUser, password }, this.options)
  }

  public updatePassword(password: string) {

  }

  public isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  public checkAuthLevel(): boolean {
    return this.firstName === 'T3' ?  true : false
  }

  public getCurrentUser(): IUser {
    return this.currentUser
  }
}
