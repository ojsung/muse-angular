import { Injectable } from '@angular/core'
import { SharedService } from 'src/app/alerts/alerts-http.service'
import { HttpClient } from '@angular/common/http'
import { AuthService } from 'src/app/user/auth.service'
import { Observable } from 'rxjs'
import { IDisaster } from '../disaster.model'
import { tap, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DisasterHttpService extends SharedService {
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

  public nullifyThenRemoveEntry(entry: IDisaster, url: string): Observable<any> {
    this.nullifyKey(this.changedArray, entry)
    return this.removeEntry(entry, url)
  }
}
