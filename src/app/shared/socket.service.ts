import { OnInit, OnDestroy } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Observable } from 'rxjs'
import { AuthService } from '../user/auth.service'
import { IOffender } from '../eva/eva-dmca/offender.model'
import ipaddr from '../../assets/ipaddr.json'

export class SocketService extends Socket implements OnInit, OnDestroy {
  constructor(protected auth: AuthService) {
    // super({ url: `https://${ipaddr.ipAddress}/api` })
    super({ url: 'http://localhost:4200/api' })

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

  public async receiveOnce(entryName) {
    try {
      const full = await this.fromOneTimeEvent(`return ${entryName}`)
      return full as IOffender
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.disconnect()
  }
}
