import { Injectable } from '@angular/core'
import { CherHttpService } from 'src/app/cher/cher-http.service'
import { HttpClient } from '@angular/common/http'
import { AuthService } from 'src/app/user/auth.service'
import { Observable } from 'rxjs'
import { IHigh } from './high.model'

@Injectable({
  providedIn: 'root'
})
export class HighHttpService extends CherHttpService {
  constructor(protected http: HttpClient, public auth: AuthService) {
    super(http, auth)
  }

  private changedArray = ['time', 'osTicket', 'issue', 'summary']

  public nullifyThenRemoveEntry(entry: IHigh, url: string): Observable<any> {
    this.nullifyKey(this.changedArray, entry)
    return this.removeEntry(entry, url)
  }
}
