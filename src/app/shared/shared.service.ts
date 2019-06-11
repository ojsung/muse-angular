import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { AuthService } from 'src/app/user/auth.service'
import { IHigh } from '../alerts/high/high.model'
import { IDisaster } from '../alerts/disaster/disaster.model'

export class SharedService {
  private enabledArray = ['isDown', 'active']
  constructor(protected http: HttpClient, public auth: AuthService) {}

  private incompleteUrl = 'api/'
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `token ${this.auth.token}`
  })

  protected nullifyKey(keysToNullify: Array<string>, entry: IHigh | IDisaster) {
    for (const key in entry) {
      if (keysToNullify.indexOf(key) > -1) {
        entry[key] = null
      }
    }
  }

  public getEntry(url): Observable<any[]> {
    return this.http.get<any[]>(this.incompleteUrl + url).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  public postEntry(url, body): Observable<any> {
    return this.http.put<any>(this.incompleteUrl + url, body, { headers: this.headers }).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  public clearIdAndPost(url: string, body?: IHigh | IDisaster) {
    const entryId = body._id
    url += `/${entryId}`
    delete body._id
    return this.postEntry(url, body)
    // return this.http
    //   .put<any>(`${this.incompleteUrl + url}/${entryId}`, body, { headers: this.headers })
    //   .pipe(
    //     tap(),
    //     catchError(this.handleError)
    //   )
  }

  protected removeEntry(entry: IHigh | IDisaster, url: string): Observable<any> {
    this.setFalse(entry)
    return this.clearIdAndPost(url, entry)
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

  private setFalse(entry: IHigh | IDisaster) {
    for (const key in entry) {
      if (this.enabledArray.indexOf(key) > -1) {
        entry[key] = false
      }
    }
  }

}
