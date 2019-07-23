import { Injectable, OnInit, OnDestroy } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Observable } from 'rxjs'
import { AuthService } from '../user/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AlertsSocketService extends Socket implements OnInit, OnDestroy {
  constructor(private auth: AuthService) {
    // super({ url: 'http://13.57.233.73/api/alerts' })
    super({ url: 'http://localhost:4200/api/alerts' })

    const token = this.auth.token
    this.ioSocket.query = {
      token
    }
  }

  public requestEntry(entryName) {
    this.emit(`get ${entryName}`)
  }

  public receiveEntry(entryName): Observable<any> {
    return this.fromEvent(`return ${entryName}`)
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.disconnect()
  }
}
