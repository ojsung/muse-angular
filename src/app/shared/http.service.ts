import { AuthService } from '../user/auth.service'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

export class HttpService {
  protected incompleteUrl = 'api/'
  // protected incompleteUrl = 'http://localhost:4200/api/'
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `token ${this.auth.token}`
  })

  constructor(protected http: HttpClient, public auth: AuthService) {}

  public getEntry(url): Observable<any[]> {
    return this.http.get<any[]>(this.incompleteUrl + url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    )
  }

  public putEntry(url, body): Observable<any> {
    return this.http.put<any>(this.incompleteUrl + url, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    )
  }

  public postEntry(url, body): Observable<any> {
    return this.http.post<any>(this.incompleteUrl + url, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    )
  }

  protected handleError(err: HttpErrorResponse) {
    let errorMessage = ''
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`
    }
    console.error(errorMessage)
    return throwError(errorMessage)
  }
}
