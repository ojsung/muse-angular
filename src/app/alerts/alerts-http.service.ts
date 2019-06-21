import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from 'src/app/user/auth.service'
import { IHigh } from './high/high.model'
import { IDisaster } from './disaster/disaster.model'
import { HttpService } from '../shared/http.service';

export class AlertsHttpService extends HttpService{
  private enabledArray = ['isDown', 'active']
  constructor(protected http: HttpClient, public auth: AuthService) {
    super(http, auth)
  }

  protected nullifyKey(keysToNullify: Array<string>, entry: IHigh | IDisaster) {
    for (const key in entry) {
      if (keysToNullify.indexOf(key) > -1) {
        entry[key] = null
      }
    }
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

  private setFalse(entry: IHigh | IDisaster) {
    for (const key in entry) {
      if (this.enabledArray.indexOf(key) > -1) {
        entry[key] = false
      }
    }
  }

}
