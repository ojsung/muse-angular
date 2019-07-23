import { Injectable } from '@angular/core'
import { AlertsHttpService } from 'src/app/alerts/alerts-http.service'
import { HttpClient } from '@angular/common/http'
import { AuthService } from 'src/app/user/auth.service'
import { Observable } from 'rxjs'
import { IDisaster } from '../disaster.model'
import { tap, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

  // extends the base alerts http service to specifically serve the disaster component
  // because it extends the service, it is accessible even though disaster component is lazily loaded
export class DisasterHttpService extends AlertsHttpService {
  private disasterUrl = 'api/events'
  constructor(protected http: HttpClient, public auth: AuthService) {
    super(http, auth)
  }

  private changedArray = [
    'timeDown',
    'osTicket',
    'issueLabel',
    'outageSummary',
    'maintenanceETA',
    'acknowledgement'
  ]

/* tslint:disable:variable-name */
  public getDisaster(_id: string): Observable<IDisaster> {
    /* tslint:enable:variable-name */
    return this.http.get<IDisaster>(`${this.disasterUrl}/${_id}`).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  public getChildren(site: string): Observable<IDisaster[]> {
    return this.http.get<IDisaster[]>(`${this.disasterUrl}/${site}`).pipe(
      tap(),
      catchError(this.handleError)
    )
  }

  // when we need to remove an alert, nullify all the fields that declare it as active
  public nullifyThenRemoveEntry(entry: IDisaster, url: string): Observable<any> {
    this.nullifyKey(this.changedArray, entry)
    return this.removeEntry(entry, url)
  }
}
